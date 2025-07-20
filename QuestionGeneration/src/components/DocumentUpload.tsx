import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Eye } from 'lucide-react';
import DocumentViewer from './DocumentViewer';

interface Document {
  id: string;
  name: string;
  type: 'syllabus' | 'previous_paper' | 'textbook';
  content: string;
  file?: File;
}

interface DocumentUploadProps {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  onNext: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ documents, setDocuments, onNext }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const fileInputRefs = {
    syllabus: useRef<HTMLInputElement>(null),
    previous_paper: useRef<HTMLInputElement>(null),
    textbook: useRef<HTMLInputElement>(null),
  };

  const documentTypes = [
    { id: 'syllabus', label: 'Syllabus', description: 'Course syllabus and curriculum outline' },
    { id: 'previous_paper', label: 'Previous Year Papers', description: 'Past examination papers for reference' },
    { id: 'textbook', label: 'Textbook/Study Material', description: 'Relevant textbooks and study materials' },
  ] as const;

  const handleFileUpload = async (files: FileList | null, type: Document['type']) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const content = await readFileContent(file);
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type,
      content,
      file,
    };

    setDocuments([...documents.filter(doc => doc.type !== type), newDocument]);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent, type: Document['type']) => {
    e.preventDefault();
    setDragOver(null);
    handleFileUpload(e.dataTransfer.files, type);
  };

  const removeDocument = (type: Document['type']) => {
    setDocuments(documents.filter(doc => doc.type !== type));
  };

  const getDocumentByType = (type: Document['type']) => {
    return documents.find(doc => doc.type === type);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Documents</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Upload your course materials to generate customized question papers. The AI will analyze your documents to create relevant questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documentTypes.map((docType) => {
          const existingDoc = getDocumentByType(docType.id);
          
          return (
            <div key={docType.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{docType.label}</h3>
                <p className="text-sm text-gray-600 mb-4">{docType.description}</p>

                {existingDoc ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 truncate">
                          {existingDoc.name}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingDocument(existingDoc)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeDocument(docType.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      dragOver === docType.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={(e) => handleDrop(e, docType.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(docType.id);
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onClick={() => fileInputRefs[docType.id]?.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drop files here or <span className="text-blue-600 font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">TXT, PDF, DOC supported</p>
                  </div>
                )}

                <input
                  ref={fileInputRefs[docType.id]}
                  type="file"
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files, docType.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {documents.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>Proceed to Generation</span>
            <FileText className="h-4 w-4" />
          </button>
        </div>
      )}

      {viewingDocument && (
        <DocumentViewer
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentUpload;