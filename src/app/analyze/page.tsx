'use client';

import { useRef, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAnalysisData, addChatMessage, resetAnalysis, setConversionStep, setImageBase64 } from '@/store/slices/analysisSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import PreparationStep from '@/components/PreparationStep';
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisChat from '@/components/AnalysisChat';
import AnalysisLoading from '@/components/AnalysisLoading';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiRefreshCw } from 'react-icons/fi';
import { updateUser} from '@/store/slices/authSlice';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Récupérer l'état depuis Redux
  const { user, token, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const {
    imageBase64,
    analysis,
    scores,
    chatHistory,
    sessionId,
    conversionStep
  } = useAppSelector((state) => state.analysis);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    dispatch(resetAnalysis());
    setFile(selectedFile);
    dispatch(setConversionStep(1));
  };

  const handleImageGenerated = (base64Image: string) => {
    const base64Data = base64Image.split(',')[1];
    dispatch(setImageBase64(base64Data));
    dispatch(setConversionStep(2));
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/spendCredits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id })
      });

      const body = await res.json();
      console.log(body);
      if (!res.ok) {
        throw new Error(body.message || 'Erreur HTTP');
      }    
      
      // console.log(body);
      // if (!body.ok) {
      //   throw new Error(body.message || 'Pas assez de crédits');
      // }

      console.log('Succès ! Nouveau solde :', body.credits);

      await dispatch(updateUser({credits : body.credits}))

      console.log('=== Début analyse ===');
      console.log('Données envoyées:', {
        imageBase64: imageBase64.substring(0, 50) + '...',
        userId: user.id,
        fileName: file?.name
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageBase64,
          userId: user.id,
          fileName: file?.name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      dispatch(setAnalysisData({
        imageBase64,
        analysis: data.analysis,
        scores: data.scores,
        sessionId: data.sessionId
      }));

      dispatch(addChatMessage({
        role: 'assistant',
        content: data.analysis
      }));

    } catch (err: any) {
      console.error('Erreur complète:', err);
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
      // Ajouter le message de l'utilisateur au chat
      dispatch(addChatMessage({
        role: 'user',
        content: userMessage
      }));

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

      // Ajouter la réponse de l'assistant au chat
      dispatch(addChatMessage({
        role: data.role,
        content: data.reply
      }));
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Une erreur est survenue lors de la conversation'}`);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    dispatch(resetAnalysis());
    setError(null);
    setChatMessage('');
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

        {!file && !analysis ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : !analysis ? (
          loading ? (
            <AnalysisLoading />
          ) : (
            file ? (
              <PreparationStep
                file={file}
                conversionStep={conversionStep}
                loading={loading}
                error={error}
                onImageGenerated={handleImageGenerated}
                onAnalyze={handleAnalyze}
              />
            ) : null
          )
        ) : (
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="hidden md:block bg-white rounded-lg shadow-md p-6 h-[calc(100vh-200px)] sticky top-24 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUpload className="h-5 w-5" />
                    <span className="font-medium">{file?.name || 'CV analysé'}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Réinitialiser l'analyse"
                  >
                    <FiRefreshCw className="h-5 w-5" />
                  </button>
                </div>
                {imageBase64 && (
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
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnalysisResults
                file={file}
                analysis={analysis}
                scores={scores}
              />
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