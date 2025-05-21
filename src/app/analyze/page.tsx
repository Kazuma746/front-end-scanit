'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PdfToImage from '@/components/PdfToImage';
import PdfViewer from '@/components/PdfViewer';
import { FiUpload, FiCheckCircle, FiAlertCircle, FiFile } from 'react-icons/fi';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; content: string}>>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [conversionStep, setConversionStep] = useState(0); // 0: début, 1: conversion en cours, 2: prêt pour analyse
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setAnalysis(null);
    setChatHistory([]);
    setConversionStep(0);
    setImageBase64(null);
    
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Vérification du type de fichier (PDF seulement)
    if (selectedFile.type !== 'application/pdf') {
      setError('Veuillez sélectionner un fichier PDF');
      return;
    }

    setFile(selectedFile);
    // Démarrer automatiquement le processus de conversion
    setConversionStep(1);
  };

  const handleImageGenerated = (base64Image: string) => {
    setImageBase64(base64Image);
    setConversionStep(2); // Prêt pour l'analyse
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError('Impossible d\'analyser le CV. Veuillez réessayer le téléchargement.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Appel à l'API d'analyse
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
      
      // Stocker le sessionId retourné par l'analyse pour maintenir la conversation
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      setAnalysis(data.analysis);
      // Initialiser l'historique du chat avec l'analyse
      setChatHistory([
        { role: 'assistant', content: data.analysis }
      ]);
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    const newMessage = { role: 'user', content: chatMessage };
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
    setChatLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatMessage,
          chatHistory: chatHistory,
          sessionId: sessionId,
          imageBase64: imageBase64
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur de communication');
      }
      
      // Mettre à jour le sessionId si un nouveau est fourni
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      setChatHistory([...chatHistory, newMessage, { 
        role: 'assistant', 
        content: data.reply 
      }]);
    } catch (err: any) {
      setError(`Erreur de chat: ${err.message}`);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-12">
        <h1 className="text-3xl font-bold text-secondary text-center mb-10">
          Analyse de CV
        </h1>
        
        {!file ? (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-secondary mb-4">
                Téléchargez votre CV au format PDF
              </h2>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 cursor-pointer" 
                   onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="text-center">
                  <FiUpload className="mx-auto text-gray-400 text-3xl mb-3" />
                  <p className="text-gray-500">Cliquez pour sélectionner votre CV au format PDF</p>
                  <p className="text-gray-400 text-sm mt-2">Taille maximale: 10 MB</p>
                </div>
              </div>
            </div>
          </div>
        ) : !analysis ? (
          // Affichage sur une colonne pendant la préparation et avant l'analyse
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
              <FiFile className="text-primary mr-3" size={24} />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {conversionStep === 1 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-secondary mb-4">
                  Préparation de votre CV pour l'analyse
                </h3>
                <PdfToImage pdfFile={file} onImageGenerated={handleImageGenerated} />
              </div>
            )}
            
            {conversionStep === 2 && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <FiCheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="font-medium">CV préparé pour l'analyse</span>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Analyse en cours...' : 'Analyser mon CV'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
                <FiAlertCircle className="mr-2 mt-1 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          // Affichage sur deux colonnes une fois l'analyse effectuée
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* Colonne de gauche - Affichage du PDF */}
            <div className="hidden md:block bg-white rounded-lg shadow-md p-6 h-[calc(100vh-200px)] sticky top-24">
              <PdfViewer file={file} />
            </div>

            {/* Colonne de droite - Analyse et chat */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
                <FiFile className="text-primary mr-3" size={24} />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-secondary mb-4">
                  Résultats de l'analyse
                </h3>
                <div className="prose max-w-none">
                  {analysis.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>

              {/* Section chat */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-semibold text-secondary mb-4">
                  Des questions sur l'analyse?
                </h3>
                
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === 'assistant'
                          ? 'bg-gray-50'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Posez une question sur l'analyse de votre CV..."
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatMessage.trim()}
                      className={`btn-secondary ${
                        chatLoading || !chatMessage.trim()
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
} 