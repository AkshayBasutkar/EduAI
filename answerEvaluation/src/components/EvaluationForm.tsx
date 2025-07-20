import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { EvaluationRequest } from '../types';
import { Play, AlertCircle } from 'lucide-react';

interface EvaluationFormProps {
  onSubmit: (request: EvaluationRequest) => void;
  isLoading: boolean;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ onSubmit, isLoading }) => {
  const [evaluationType, setEvaluationType] = useState<'omr' | 'descriptive' | 'mixed'>('descriptive');
  const [formatType, setFormatType] = useState<'handwritten' | 'digital'>('handwritten');
  const [studentScript, setStudentScript] = useState<File | null>(null);
  const [teacherKey, setTeacherKey] = useState<File | null>(null);
  const [markingScheme, setMarkingScheme] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!studentScript) newErrors.push('Student answer script is required');
    if (!teacherKey) newErrors.push('Teacher key answers file is required');
    if (!markingScheme) newErrors.push('Marking scheme file is required');

    // Validate file types
    if (studentScript) {
      if (formatType === 'handwritten') {
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validImageTypes.includes(studentScript.type)) {
          newErrors.push('Handwritten scripts must be image files (.jpg, .jpeg, .png)');
        }
      } else {
        if (studentScript.type !== 'application/json' && !studentScript.name.endsWith('.json')) {
          newErrors.push('Digital scripts must be JSON files');
        }
      }
    }

    if (teacherKey && !teacherKey.name.endsWith('.txt')) {
      newErrors.push('Teacher key must be a .txt file');
    }

    if (markingScheme && !markingScheme.name.endsWith('.json')) {
      newErrors.push('Marking scheme must be a JSON file');
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (validationErrors.length === 0 && studentScript && teacherKey && markingScheme) {
      const request: EvaluationRequest = {
        evaluation_type: evaluationType,
        format_type: evaluationType === 'omr' ? undefined : formatType,
        student_script: studentScript,
        teacher_key: teacherKey,
        marking_scheme: markingScheme,
      };
      onSubmit(request);
    }
  };

  const getStudentScriptAccept = () => {
    if (evaluationType === 'omr') return '.jpg,.jpeg,.png';
    return formatType === 'handwritten' ? '.jpg,.jpeg,.png' : '.json';
  };

  const getStudentScriptDescription = () => {
    if (evaluationType === 'omr') return 'Upload OMR sheet image (.jpg, .jpeg, .png)';
    return formatType === 'handwritten' 
      ? 'Upload handwritten answer script image (.jpg, .jpeg, .png)'
      : 'Upload digital answer script JSON file (.json)';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Answer Script Evaluator</h1>
        <p className="text-gray-600">Upload your files and select evaluation options to get started</p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Evaluation Type Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Evaluation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['omr', 'descriptive', 'mixed'] as const).map((type) => (
              <label
                key={type}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  evaluationType === type
                    ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="evaluation_type"
                  value={type}
                  checked={evaluationType === type}
                  onChange={(e) => setEvaluationType(e.target.value as typeof type)}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 capitalize">
                    {type}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {type === 'omr' && 'Multiple choice questions'}
                    {type === 'descriptive' && 'Written answers'}
                    {type === 'mixed' && 'Both OMR and descriptive'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Format Type Selection (only for descriptive/mixed) */}
        {(evaluationType === 'descriptive' || evaluationType === 'mixed') && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Answer Format</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['handwritten', 'digital'] as const).map((format) => (
                <label
                  key={format}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formatType === format
                      ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="format_type"
                    value={format}
                    checked={formatType === format}
                    onChange={(e) => setFormatType(e.target.value as typeof format)}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 capitalize">
                      {format}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {format === 'handwritten' && 'Scanned/photographed papers'}
                      {format === 'digital' && 'JSON formatted answers'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* File Uploads */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">File Uploads</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FileUpload
              label="Student Answer Script"
              accept={getStudentScriptAccept()}
              file={studentScript}
              onFileSelect={setStudentScript}
              description={getStudentScriptDescription()}
            />
            
            <FileUpload
              label="Teacher Key Answers"
              accept=".txt"
              file={teacherKey}
              onFileSelect={setTeacherKey}
              description="Upload teacher's answer key (.txt file)"
            />
            
            <FileUpload
              label="Marking Scheme"
              accept=".json"
              file={markingScheme}
              onFileSelect={setMarkingScheme}
              description="Upload marking scheme configuration (.json file)"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
            }`}
          >
            <Play className="h-5 w-5 mr-2" />
            {isLoading ? 'Processing...' : 'Start Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};