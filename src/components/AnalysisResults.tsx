import { FiFile } from 'react-icons/fi';

interface Score {
  ats: number;
  readability: number;
  overall: number;
}

interface KeywordMatch {
  keyword: string;
  count: number;
}

interface Suggestion {
  type: string;
  category: string;
  priority: string;
}

interface AnalysisResultsProps {
  file: File | null;
  analysis: string;
  scores?: Score;
}

const AnalysisResults = ({ file, analysis, scores }: AnalysisResultsProps) => {
  console.log('=== AnalysisResults props ===');
  console.log('File:', file);
  console.log('Analysis:', analysis);
  console.log('Scores bruts:', scores);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const displayFile = file || new File([], 'CV analysé');
  const scoresData = scores || { ats: 0, readability: 0, overall: 0 };
  
  console.log('Scores formatés:', scoresData);

  return (
    <div>
      <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
        <FiFile className="text-primary mr-3" size={24} />
        <div>
          <p className="font-medium">{displayFile.name}</p>
          <p className="text-gray-500 text-sm">
            {(displayFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>

      {scores && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-secondary mb-4">
            Scores d'analyse
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Score ATS</p>
              <p className={`text-2xl font-bold ${getScoreColor(scoresData.ats)}`}>
                {scoresData.ats}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Lisibilité</p>
              <p className={`text-2xl font-bold ${getScoreColor(scoresData.readability)}`}>
                {scoresData.readability}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Score global</p>
              <p className={`text-2xl font-bold ${getScoreColor(scoresData.overall)}`}>
                {scoresData.overall}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-secondary mb-4">
          Analyse détaillée
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