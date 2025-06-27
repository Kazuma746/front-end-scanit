'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import PreparationStep from '@/components/PreparationStep';
import PdfViewer from '@/components/PdfViewer';
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisChat from '@/components/AnalysisChat';
import AnalysisLoading from '@/components/AnalysisLoading';

export default function AnalyzePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

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
    if (!chatMessage.trim() || !imageBase64) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory,
          sessionId,
          imageBase64
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la conversation');
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: data.role, content: data.reply }
      ]);
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Une erreur est survenue lors de la conversation'}`);
    } finally {
      setChatLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="container py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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