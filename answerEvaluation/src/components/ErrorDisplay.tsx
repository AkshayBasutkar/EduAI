import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  traceback?: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  traceback, 
  onRetry, 
  onReset 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Failed</h1>
            <p className="text-gray-600">An error occurred while processing your request</p>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-red-900 mb-2">Error Details</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>

          {/* Traceback (if available) */}
          {traceback && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Show technical details
              </summary>
              <div className="mt-3 bg-gray-100 rounded-lg p-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {traceback}
                </pre>
              </div>
            </details>
          )}

          {/* Common Solutions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Common Solutions</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Check that all uploaded files are in the correct format</li>
              <li>• Ensure the backend server is running and accessible</li>
              <li>• Verify that the GEMINI_API_KEY environment variable is set</li>
              <li>• Make sure your files are not corrupted or too large</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRetry}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};