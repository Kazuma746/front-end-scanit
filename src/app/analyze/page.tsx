'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import PreparationStep from '@/components/PreparationStep';
import PdfViewer from '@/components/PdfViewer';
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisChat from '@/components/AnalysisChat';
import AnalysisLoading from '@/components/AnalysisLoading';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; content: string}>>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [conversionStep, setConversionStep] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setAnalysis(null);
    setChatHistory([]);
    setConversionStep(0);
    setImageBase64(null);
    setFile(selectedFile);
    setConversionStep(1);
  };

  const handleImageGenerated = (base64Image: string) => {
    setImageBase64(base64Image);
    setConversionStep(2);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError('Impossible d\'analyser le CV. Veuillez réessayer le téléchargement.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      setAnalysis(data.analysis);
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
          <FileUpload onFileSelect={handleFileSelect} />
        ) : !analysis ? (
          loading ? (
            <AnalysisLoading />
          ) : (
            <PreparationStep
              file={file}
              conversionStep={conversionStep}
              loading={loading}
              error={error}
              onImageGenerated={handleImageGenerated}
              onAnalyze={handleAnalyze}
            />
          )
        ) : (
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="hidden md:block bg-white rounded-lg shadow-md p-6 h-[calc(100vh-200px)] sticky top-24">
              <PdfViewer file={file} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <AnalysisResults file={file} analysis={analysis} />
              <AnalysisChat
                chatHistory={chatHistory}
                chatMessage={chatMessage}
                chatLoading={chatLoading}
                onMessageChange={setChatMessage}
                onSubmit={handleChatSubmit}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
} 