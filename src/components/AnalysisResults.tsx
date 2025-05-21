import { FiFile } from 'react-icons/fi';

interface AnalysisResultsProps {
  file: File;
  analysis: string;
}

const AnalysisResults = ({ file, analysis }: AnalysisResultsProps) => {
  return (
    <div>
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
    </div>
  );
};

export default AnalysisResults; 