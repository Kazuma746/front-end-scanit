'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configuration de pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfToImageProps {
  pdfFile: File;
  onImageGenerated: (imageBase64: string) => void;
}

const PdfToImage = ({ pdfFile, onImageGenerated }: PdfToImageProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function convertPageToImage(): void {
    setLoading(true);
    setError(null);
    
    // Trouver le canvas du PDF rendu
    const canvas = document.querySelector('.react-pdf__Page__canvas') as HTMLCanvasElement;
    
    if (!canvas) {
      setError('Impossible de trouver le canvas de rendu PDF');
      setLoading(false);
      return;
    }
    
    try {
      // Convertir le canvas en image base64
      const imageBase64 = canvas.toDataURL('image/png');
      onImageGenerated(imageBase64);
    } catch (err: any) {
      setError(`Erreur lors de la conversion : ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const changePage = (offset: number) => {
    if (!numPages) return;
    const newPage = Math.max(1, Math.min(pageNumber + offset, numPages));
    setPageNumber(newPage);
  };

  return (
    <div className="flex flex-col items-center">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="border rounded-lg overflow-hidden mb-4"
      >
        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
      
      {numPages && numPages > 1 && (
        <div className="flex items-center mb-4">
          <button
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
            className="px-4 py-2 bg-gray-200 rounded-l-md disabled:opacity-50"
          >
            &lt;
          </button>
          <p className="px-4 py-2 bg-gray-100">
            Page {pageNumber} sur {numPages}
          </p>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
            className="px-4 py-2 bg-gray-200 rounded-r-md disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
      
      <button
        onClick={convertPageToImage}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Conversion en cours...' : 'Utiliser cette page pour l\'analyse'}
      </button>
      
      {error && (
        <div className="text-red-500 mt-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default PdfToImage; 