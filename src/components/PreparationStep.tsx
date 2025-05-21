import { FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import PdfToImage from './PdfToImage';

interface PreparationStepProps {
  file: File;
  conversionStep: number;
  loading: boolean;
  error: string | null;
  onImageGenerated: (base64Image: string) => void;
  onAnalyze: () => void;
}

const PreparationStep = ({
  file,
  conversionStep,
  loading,
  error,
  onImageGenerated,
  onAnalyze
}: PreparationStepProps) => {
  return (
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
          <PdfToImage pdfFile={file} onImageGenerated={onImageGenerated} />
        </div>
      )}
      
      {conversionStep === 2 && (
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <FiCheckCircle className="text-green-500 mr-2" size={20} />
            <span className="font-medium">CV préparé pour l'analyse</span>
          </div>
          
          <button
            onClick={onAnalyze}
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
  );
};

export default PreparationStep; 