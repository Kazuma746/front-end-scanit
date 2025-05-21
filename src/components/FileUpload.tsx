import { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Vérification du type de fichier (PDF seulement)
    if (selectedFile.type !== 'application/pdf') {
      // On pourrait ajouter un callback pour la gestion des erreurs
      return;
    }

    onFileSelect(selectedFile);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-secondary mb-4">
          Téléchargez votre CV au format PDF
        </h2>
        
        <div 
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 cursor-pointer" 
          onClick={() => fileInputRef.current?.click()}
        >
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
  );
};

export default FileUpload; 