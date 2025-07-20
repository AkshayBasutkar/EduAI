import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  label: string;
  onFileUpload: (file: UploadedFile) => void;
  uploadedFile: UploadedFile | null;
  onRemoveFile: () => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileUpload,
  uploadedFile,
  onRemoveFile,
  accept = '.txt,.pdf,.doc,.docx'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const content = await file.text();
      onFileUpload({
        file,
        content,
        name: file.name
      });
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{label}</p>
              <p className="text-sm text-green-600">{uploadedFile.name}</p>
            </div>
          </div>
          <button
            onClick={onRemoveFile}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          {isProcessing ? (
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {isProcessing ? 'Processing file...' : 'Drag and drop your file here, or click to browse'}
          </p>
          
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <File className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </label>
        </div>
        
        <p className="text-xs text-gray-400">
          Supported formats: TXT, PDF, DOC, DOCX
        </p>
      </div>
    </div>
  );
};