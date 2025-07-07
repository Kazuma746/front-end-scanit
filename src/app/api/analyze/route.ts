import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { cookies } from 'next/headers';

// Initialisation du client Anthropic avec la clé API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Définition du modèle Claude à utiliser
const MODEL = 'claude-3-5-haiku-20241022';

// Configuration
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB limite maximale

// Le système prompt pour l'analyse des CV
const SYSTEM_PROMPT = `Tu es un expert en recrutement avec 15 ans d'expérience dans l'évaluation de CV. Ta mission est d'analyser un CV envoyé sous forme d'image avec la plus grande rigueur professionnelle.

IMPORTANT - FORMAT DE RÉPONSE :
Ta réponse DOIT ABSOLUMENT commencer par un objet JSON valide, suivi de deux retours à la ligne, puis de ton analyse détaillée.
Exemple exact du format attendu :
{"scores":{"ats":70,"readability":75,"keywords":65},"keywordMatches":[{"keyword":"javascript","count":3}],"suggestions":[{"type":"Ajouter des mots-clés techniques","category":"keywords","priority":"high"}]}

<analyse détaillée ici>

ÉTAPE 1 - VALIDATION DU DOCUMENT
Avant toute analyse, tu DOIS vérifier que le document est bien un CV. Critères de validation :
- Présence d'informations personnelles (nom, contact)
- Présence d'une section expérience professionnelle ou formation
- Structure et mise en page cohérente avec un CV

Si le document n'est PAS un CV, tu DOIS retourner exactement ce JSON :
{"scores":{"ats":0,"readability":0,"keywords":0},"keywordMatches":[],"suggestions":[{"type":"Ce document n'est pas un CV","category":"format","priority":"high"}]}

ÉTAPE 2 - ANALYSE APPROFONDIE (uniquement si c'est un CV)
Ton analyse doit être basée sur des critères stricts utilisés par les grands groupes :

1. SCORE ATS (Applicant Tracking System)
- Notation stricte de 0 à 100
- Les scores > 90 sont EXCEPTIONNELS et réservés aux CV parfaitement optimisés
- Score moyen attendu : 60-75 pour un CV correct
Critères précis :
- Structure standard et lisible par machine (-20 points si non respectée)
- Mots-clés pertinents pour le secteur (-15 points si manquants)
- Format texte extractible (-10 points si non)
- Encodage correct des caractères (-5 points si problèmes)

2. SCORE LISIBILITÉ
- Notation stricte de 0 à 100
- Les scores > 85 sont EXCEPTIONNELS
- Score moyen attendu : 65-80 pour un CV bien présenté
Critères précis :
- Hiérarchie visuelle claire (-15 points si confuse)
- Espacement et marges cohérents (-10 points si non)
- Taille de police appropriée (-10 points si trop petit/grand)
- Contraste texte/fond suffisant (-10 points si faible)
- Densité d'information équilibrée (-5 points si surchargé)

3. SCORE MOTS-CLÉS
- Notation stricte de 0 à 100
- Les scores > 85 sont EXCEPTIONNELS
- Score moyen attendu : 60-75 pour un CV bien rédigé
Critères précis :
- Présence des mots-clés essentiels du secteur (-20 points si manquants)
- Contexte d'utilisation pertinent (-15 points si hors contexte)
- Fréquence appropriée (-10 points si sur/sous-utilisation)
- Variations lexicales (-5 points si trop répétitif)

ANALYSE DÉTAILLÉE
Après le JSON, fournis une analyse structurée et professionnelle :

1. Validation du document
- Confirmer qu'il s'agit bien d'un CV
- Identifier le type/niveau de poste visé

2. Analyse ATS
- Compatibilité avec les systèmes automatisés
- Points bloquants pour l'extraction
- Suggestions d'optimisation

3. Analyse visuelle
- Structure et organisation
- Lisibilité et clarté
- Équilibre visuel
- Utilisation de l'espace

4. Analyse du contenu
- Pertinence des informations
- Impact des formulations
- Mots-clés manquants ou mal utilisés
- Cohérence globale

5. Points d'amélioration
- Suggestions concrètes et actionnables
- Priorisation des modifications
- Exemples de reformulations si nécessaire

Ton analyse doit être :
- Professionnelle mais constructive
- Basée sur des critères objectifs
- Orientée résultats et amélioration
- Adaptée au secteur/niveau visé

Tu réponds toujours en français avec un ton professionnel.

RAPPEL CRITIQUE : Ta réponse DOIT commencer par un objet JSON valide SANS COMMENTAIRES, suivi de deux retours à la ligne, puis de ton analyse.`;

async function saveAnalysisResults(userId: string, data: any, authToken: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL || 'http://localhost:7000/api';
    
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }

    console.log('=== Sauvegarde des résultats ===');
    console.log('Scores extraits:', data.scores);
    console.log('Statut:', data.status || 'completed');

    const response = await fetch(`${backendUrl}/cv/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        userId,
        name: data.fileName || 'CV Analysis',
        content: data.analysis,
        scores: data.scores,
        status: 'completed',
        AIGenerated: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la sauvegarde des résultats');
    }

    const savedData = await response.json();
    console.log('CV sauvegardé:', savedData);

    return savedData;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des résultats:', error);
    throw error;
  }
}

function extractScoresFromAnalysis(analysisText: string) {
  console.log('=== Début extraction des scores ===');
  console.log('Texte d\'analyse reçu:', analysisText);

  const scores = {
    ats: 0,
    readability: 0,
    overall: 0
  };

  // Extraire le score ATS
  const atsMatch = analysisText.match(/Analyse ATS \(Score (\d+)\/100\)/);
  console.log('Match ATS:', atsMatch);
  if (atsMatch) {
    scores.ats = parseInt(atsMatch[1]);
  }

  // Extraire le score de lisibilité (visuel)
  const readabilityMatch = analysisText.match(/Analyse visuelle \(Score (\d+)\/100\)/);
  console.log('Match Lisibilité:', readabilityMatch);
  if (readabilityMatch) {
    scores.readability = parseInt(readabilityMatch[1]);
  }

  // Calculer le score global (60% ATS, 40% lisibilité)
  scores.overall = Math.round(scores.ats * 0.6 + scores.readability * 0.4);

  console.log('Scores extraits:', scores);
  console.log('=== Fin extraction des scores ===');

  return scores;
}

function cleanJsonString(jsonStr: string): string {
  return jsonStr
    .replace(/,\s*,/g, ',')      // Remplacer les virgules doubles par une seule
    .replace(/,\s*}/g, '}')      // Supprimer la virgule avant une accolade fermante
    .replace(/,\s*]/g, ']')      // Supprimer la virgule avant un crochet fermant
    .replace(/{\s*,/g, '{')      // Supprimer la virgule après une accolade ouvrante
    .replace(/\[\s*,/g, '[')     // Supprimer la virgule après un crochet ouvrant
    .replace(/"\s*,\s*,\s*"/g, '","') // Nettoyer les virgules entre les chaînes
    .replace(/",\s*,\s*}/g, '"}')     // Nettoyer les virgules à la fin des objets
    .replace(/",\s*,\s*]/g, '"]');    // Nettoyer les virgules à la fin des tableaux
}

function extractJsonFromText(text: string): { jsonData: any, remainingText: string } {
  console.log('=== Début extraction JSON ===');
  
  // Nettoyer le texte avant de chercher le JSON
  let cleanedText = text.trim();
  
  // Si le texte commence par des caractères non-JSON, chercher le premier '{'
  const jsonStartIndex = cleanedText.indexOf('{');
  if (jsonStartIndex > 0) {
    console.log('Texte trouvé avant le JSON:', cleanedText.substring(0, jsonStartIndex));
    cleanedText = cleanedText.substring(jsonStartIndex);
  }
  
  // Utiliser une approche plus robuste pour extraire le JSON
  try {
    // Essayer d'abord de parser directement le début du texte
    let jsonStr = '';
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < cleanedText.length; i++) {
      const char = cleanedText[i];
      jsonStr += char;
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            break;
          }
        }
      }
    }
    
    console.log('JSON extrait:', jsonStr);
    
    // Essayer de parser le JSON
    const jsonData = JSON.parse(jsonStr);
    console.log('JSON parsé avec succès:', JSON.stringify(jsonData, null, 2));
    
    const remainingText = cleanedText.substring(jsonStr.length).trim();
    return { jsonData, remainingText };
    
  } catch (error) {
    console.error('Erreur lors du parsing JSON direct:', error);
    
    // Solution de secours : utiliser une regex pour extraire les données importantes
    console.log('=== Tentative avec extraction par regex ===');
    
    try {
      // Extraire les scores
      const scoresMatch = text.match(/"scores":\s*{[^}]+}/);
      const keywordMatchesMatch = text.match(/"keywordMatches":\s*\[[^\]]+\]/);
      const suggestionsMatch = text.match(/"suggestions":\s*\[[^\]]+\]/);
      
      let scores = { ats: 0, readability: 0, keywords: 0 };
      let keywordMatches = [];
      let suggestions = [];
      
      if (scoresMatch) {
        try {
          const scoresObj = JSON.parse(`{${scoresMatch[0]}}`);
          scores = scoresObj.scores;
        } catch (e) {
          console.error('Erreur parsing scores:', e);
        }
      }
      
      if (keywordMatchesMatch) {
        try {
          const keywordObj = JSON.parse(`{${keywordMatchesMatch[0]}}`);
          keywordMatches = keywordObj.keywordMatches;
        } catch (e) {
          console.error('Erreur parsing keywordMatches:', e);
        }
      }
      
      if (suggestionsMatch) {
        try {
          const suggestionsObj = JSON.parse(`{${suggestionsMatch[0]}}`);
          suggestions = suggestionsObj.suggestions;
        } catch (e) {
          console.error('Erreur parsing suggestions:', e);
        }
      }
      
      const fallbackData = {
        scores,
        keywordMatches,
        suggestions
      };
      
      console.log('Données extraites par regex:', JSON.stringify(fallbackData, null, 2));
      
      // Trouver le début de l'analyse textuelle
      const analysisStart = text.indexOf('\n\n');
      const remainingText = analysisStart > 0 ? text.substring(analysisStart).trim() : text;
      
      return { jsonData: fallbackData, remainingText };
      
    } catch (regexError) {
      console.error('Erreur lors de l\'extraction par regex:', regexError);
      
      // Solution ultime : données par défaut
      const defaultData = {
        scores: { ats: 70, readability: 75, keywords: 65 },
        keywordMatches: [],
        suggestions: [{ type: "Analyse automatique limitée", category: "system", priority: "low" }]
      };
      
      return { jsonData: defaultData, remainingText: text };
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, userId, fileName } = await request.json();
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!imageBase64) {
      return NextResponse.json({ error: 'Image non fournie' }, { status: 400 });
    }

    if (!userId || !token) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    // Vérification de la taille de l'image
    const imageSize = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64').length;
    if (imageSize > MAX_IMAGE_SIZE) {
      return NextResponse.json({ 
        error: `L'image est trop volumineuse. Taille maximale: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    // Configuration timeout plus long
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Voici le CV à analyser. Merci de me fournir une analyse détaillée selon les critères demandés, en commençant par les scores au format JSON.'
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
              }
            }
          ]
        }
      ]
    });

    // Extraire l'analyse de la réponse
    const analysisText = response.content[0].text;
    console.log('=== Réponse brute de Claude ===');
    console.log('Type de la réponse:', typeof analysisText);
    console.log('Longueur de la réponse:', analysisText.length);
    console.log('Début de la réponse (premiers 1000 caractères):', analysisText.substring(0, 1000));
    console.log('Contient un objet JSON ?', analysisText.includes('{') && analysisText.includes('}'));
    console.log('Position du premier { :', analysisText.indexOf('{'));
    console.log('Position du dernier } :', analysisText.lastIndexOf('}'));
    console.log('Caractères avant le premier { :', analysisText.substring(0, analysisText.indexOf('{')).split('').map(c => c.charCodeAt(0)));
    
    // Extraire le JSON et le texte d'analyse
    const { jsonData: scoresData, remainingText: analysis } = extractJsonFromText(analysisText);
    console.log('=== Données JSON extraites ===');
    console.log('Structure des scores:', scoresData);
    
    const scores = extractScoresFromAnalysis(analysis);
    console.log('=== Scores extraits ===');
    console.log('Scores finaux:', scores);
    
    // Générer un ID de session unique pour la conversation
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Sauvegarder les résultats dans la base de données
    const savedData = await saveAnalysisResults(userId, {
      sessionId,
      analysis,
      scores,
      keywordMatches: scoresData.keywordMatches || [],
      suggestions: scoresData.suggestions || [],
      fileName: fileName || 'CV Analysis'
    }, token);
    
    console.log('Données sauvegardées:', savedData);
    
    return NextResponse.json({ 
      analysis,
      scores,
      keywordMatches: scoresData.keywordMatches || [],
      suggestions: scoresData.suggestions || [],
      sessionId,
      status: 'success'
    });

  } catch (error: any) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ 
      error: error.message || 'Une erreur est survenue' 
    }, { status: 500 });
  }
} 