import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialisation du client Anthropic avec la clé API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Définition du modèle Claude à utiliser
const MODEL = 'claude-3-5-haiku-20241022';

// Le système prompt pour l'analyse des CV et la conversation
const SYSTEM_PROMPT = `Tu es un expert en recrutement et en design de CV. Tu dois aider l'utilisateur à améliorer son CV pour qu'il passe efficacement la première étape automatisée des grandes entreprises (systèmes ATS).

L'utilisateur peut te poser des questions sur une analyse déjà fournie, défendre certains choix, ou demander des exemples concrets ou des conseils spécifiques.

Important :  
Le but principal est d'aider l'utilisateur à concevoir un CV qui **passe efficacement la première étape automatisée des grandes entreprises, à savoir les systèmes ATS (Applicant Tracking Systems)**.  
Tu dois donc insister sur les aspects qui facilitent la lecture par ces robots, notamment :  
- structuration claire et standardisée,  
- utilisation de mots-clés pertinents,  
- éviter les éléments graphiques complexes ou mal interprétés,  
- faciliter l'extraction du texte,  
- éviter les polices et couleurs qui nuisent à la reconnaissance automatique.

Tu réponds toujours en français avec un ton professionnel mais bienveillant.`;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { message, chatHistory, sessionId, imageBase64 } = data;
    
    if (!message) {
      return NextResponse.json({ error: 'Aucun message fourni' }, { status: 400 });
    }

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image du CV manquante' }, { status: 400 });
    }

    // Préparation des messages pour l'API Anthropic
    // Pour le premier message, nous incluons l'image du CV
    const firstMessage = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Voici le CV à analyser. Je vais maintenant te poser des questions spécifiques à son sujet.'
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
    };

    // Pour le message actuel de l'utilisateur
    const currentMessage = {
      role: 'user',
      content: message
    };

    // Préparation de l'historique du chat pour l'API Anthropic
    // On ne garde que les messages textuels intermédiaires
    const historyMessages = chatHistory
      .slice(1) // Ignorer le premier message (l'analyse)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

    // Construction de la liste complète des messages
    const messages = [firstMessage, ...historyMessages, currentMessage];

    // Appel à l'API Anthropic Claude pour continuer la conversation
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    return NextResponse.json({ 
      reply: response.content[0].text,
      role: 'assistant',
      sessionId: sessionId
    });
  } catch (error: any) {
    console.error('Erreur lors de la conversation:', error);
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Une erreur est survenue'}` },
      { status: 500 }
    );
  }
} 