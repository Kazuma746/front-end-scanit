'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
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
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { useSelector } from 'react-redux';

export default function AnalyzePage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [scores, setScores] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; content: string}>>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [conversionStep, setConversionStep] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

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
    const base64Data = base64Image.split(',')[1];
    setImageBase64(base64Data);
    setConversionStep(2);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError('Impossible d\'analyser le CV. Veuillez réessayer le téléchargement.');
      return;
    }

    if (!user || !token) {
      setError('Vous devez être connecté pour analyser un CV.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          imageBase64,
          userId: user.id 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      setAnalysis(data.analysis);
      setScores(data.scores);
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

  const handleReset = () => {
    setFile(null);
    setImageBase64(null);
    setError(null);
    setAnalysis(null);
    setScores(null);
    setChatHistory([]);
    setChatMessage('');
    setConversionStep(0);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      handleFileSelect(acceptedFiles[0]);
    },
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
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
            <div className="hidden md:block bg-white rounded-lg shadow-md p-6 h-[calc(100vh-200px)] sticky top-24 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <FiUpload className="h-5 w-5" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <div 
                  ref={imageRef}
                  className="flex-1 relative overflow-hidden cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      transform: isHovering ? 'scale(2)' : 'scale(1)',
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${imageBase64}`}
                      alt="CV"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnalysisResults file={file} analysis={analysis} scores={scores} />
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