import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  file?: File;
}

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 60));

  const downloadDocument = (format: 'pdf' | 'txt') => {
    const blob = new Blob([document.content], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.name}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-2">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Download Options */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => downloadDocument('txt')}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>TXT</span>
              </button>
              <button
                onClick={() => downloadDocument('pdf')}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div 
            className="prose prose-sm max-w-none transition-all duration-200"
            style={{ fontSize: `${zoom}%` }}
          >
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {document.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;