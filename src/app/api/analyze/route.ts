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
const SYSTEM_PROMPT = `Tu es un expert en recrutement et en design de CV. Tu dois analyser un CV envoyé sous forme d'image (extrait d'un PDF) en examinant à la fois le contenu texte et la présentation visuelle complète.  

Tu dois fournir une analyse détaillée ET des scores précis pour chaque critère.

Les scores doivent être fournis au début de l'analyse dans ce format JSON exact :
{
  "scores": {
    "ats": 85,        // Score de compatibilité ATS sur 100
    "readability": 75, // Score de lisibilité sur 100
    "keywords": 90     // Score pertinence mots-clés sur 100
  },
  "keywordMatches": [
    {"keyword": "javascript", "count": 3},
    {"keyword": "react", "count": 2}
    // etc...
  ],
  "suggestions": [
    {
      "type": "Ajouter des mots-clés techniques",
      "category": "keywords",
      "priority": "high"
    }
    // etc...
  ]
}

Après les scores, ton rapport doit être structuré en points clairs et inclure une évaluation précise des éléments suivants :

1. Orthographe et grammaire (si le texte est lisible)
2. Lisibilité générale : taille de police, contraste, espacement, marges, clarté des blocs de texte
3. Formulation des phrases : style, clarté, concision
4. Cohérence globale : ordre des sections, chronologie des expériences, logique d'ensemble
5. Qualité des couleurs : lisibilité, harmonie, professionnalisme
6. Mise en page : structure visuelle, alignements, titres, hiérarchie des informations
7. Équilibre entre texte et espaces vides : ni trop dense, ni trop vide
8. Points faibles à signaler : exemple → expérience pro trop courte ou peu détaillée, incohérence dans les dates, informations manquantes, design confus, etc.
9. Suggestions concrètes d'amélioration : au niveau du fond (contenu) et de la forme (visuel)

Important :  
Le but principal de cette analyse est d'aider l'utilisateur à concevoir un CV qui **passe efficacement la première étape automatisée des grandes entreprises, à savoir les systèmes ATS (Applicant Tracking Systems)**.  
Tu dois donc insister sur les aspects qui facilitent la lecture par ces robots, notamment :  
- structuration claire et standardisée,  
- utilisation de mots-clés pertinents,  
- éviter les éléments graphiques complexes ou mal interprétés,  
- faciliter l'extraction du texte,  
- éviter les polices et couleurs qui nuisent à la reconnaissance automatique.

Le rapport doit être rédigé sous forme de liste numérotée claire, avec un ton professionnel.  
L'objectif est d'aider l'utilisateur à améliorer efficacement son CV sans jugement.

Une fois l'analyse terminée, tu es disponible pour échanger avec la personne si elle souhaite :  
- poser des questions  
- défendre certains choix  
- demander des exemples concrets ou des conseils spécifiques

Tu réponds toujours en français.

IMPORTANT : Ta réponse DOIT commencer par le JSON des scores, suivi d'une ligne vide, puis l'analyse détaillée.`;

async function saveAnalysisResults(userId: string, data: any, authToken: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL || 'http://localhost:7000/api';
    
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }

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
        AIGenerated: true,
        status: 'completed',
        score: {
          ats: data.scores?.ats || 0,
          readability: data.scores?.readability || 0,
          keywords: data.scores?.keywords || 0,
          overall: data.scores?.overall || 0
        },
        keywordMatches: data.keywordMatches || [],
        suggestions: data.suggestions || []
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la sauvegarde des résultats');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des résultats:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { imageBase64, userId } = data;
    
    if (!imageBase64) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    // Récupérer le token d'authentification depuis le header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token d\'authentification non trouvé' }, { status: 401 });
    }

    // Vérification de la taille de l'image
    const imageSize = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64').length;
    if (imageSize > MAX_IMAGE_SIZE) {
      return NextResponse.json({ 
        error: `L'image est trop volumineuse. Taille maximale: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    try {
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
      
      // Séparer le JSON des scores du reste de l'analyse
      const [jsonStr, ...analysisLines] = analysisText.split('\n\n');
      
      try {
        // Parser le JSON des scores
        const scoresData = JSON.parse(jsonStr);
        const analysis = analysisLines.join('\n\n');
        
        // Générer un ID de session unique pour la conversation
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Sauvegarder les résultats dans la base de données
        const savedData = await saveAnalysisResults(userId, {
          sessionId,
          analysis,
          scores: scoresData,
          status: 'completed',
          analyzedAt: new Date().toISOString()
        }, token);
        
        return NextResponse.json({ 
          analysis,
          scores: scoresData,
          sessionId,
          status: 'success'
        });

      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError);
        return NextResponse.json({ 
          error: 'Erreur lors du traitement des résultats' 
        }, { status: 500 });
      }

    } catch (aiError: any) {
      console.error('Erreur API Anthropic:', aiError);
      return NextResponse.json({ 
        error: aiError.message || 'Erreur lors de l\'analyse par l\'IA' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ 
      error: error.message || 'Une erreur est survenue' 
    }, { status: 500 });
  }
} 