import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

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
Ton rapport doit être structuré en points clairs et inclure une évaluation précise des éléments suivants :

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

Tu réponds toujours en français.`;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { imageBase64 } = data;
    
    if (!imageBase64) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 });
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
                text: 'Voici le CV à analyser. Merci de me fournir une analyse détaillée selon les critères demandés pour optimiser la lecture par les robots ATS.'
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
      const analysis = response.content[0].text;
      
      // Générer un ID de session unique pour la conversation
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      return NextResponse.json({ 
        analysis, 
        sessionId 
      });
    } catch (error: any) {
      console.error('Erreur API Anthropic:', error);
      
      if (error.status === 429) {
        return NextResponse.json({ 
          error: 'Le service est temporairement surchargé. Veuillez réessayer dans quelques instants.' 
        }, { status: 429 });
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse du CV:', error);
    return NextResponse.json(
      { 
        error: `Erreur: ${error.message || 'Une erreur est survenue'}`,
        details: error.status === 429 ? 'Service temporairement surchargé' : undefined
      },
      { status: error.status || 500 }
    );
  }
} 