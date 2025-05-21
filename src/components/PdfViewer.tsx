import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  file: File | null;
}

const PdfViewer = ({ file }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!file) return null;

  return (
    <div className="pdf-viewer h-full">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
      >
        <Page 
          pageNumber={pageNumber} 
          className="max-w-full"
          scale={1}
        />
      </Document>
      {numPages && numPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => setPageNumber(page => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-secondary text-white rounded-md disabled:opacity-50"
          >
            Précédent
          </button>
          <span>
            Page {pageNumber} sur {numPages}
          </span>
          <button
            onClick={() => setPageNumber(page => Math.min(numPages || 1, page + 1))}
            disabled={pageNumber >= (numPages || 1)}
            className="px-3 py-1 bg-secondary text-white rounded-md disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer; 