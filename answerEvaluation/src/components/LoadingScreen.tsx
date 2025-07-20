import React from 'react';
import { Brain, FileText, CheckCircle, Clock } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Animated Brain Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-blue-600 rounded-full p-6 inline-block">
              <Brain className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Evaluating Answer Script
          </h2>
          <p className="text-gray-600 mb-8">
            Our AI is carefully analyzing the submission...
          </p>

          {/* Progress Steps */}
          <div className="space-y-4">
            <div className="flex items-center text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Files uploaded successfully</p>
                <p className="text-xs text-gray-500">All documents received and validated</p>
              </div>
            </div>

            <div className="flex items-center text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Processing answer script</p>
                <p className="text-xs text-gray-500">Extracting and analyzing content</p>
              </div>
            </div>

            <div className="flex items-center text-left opacity-50">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Comparing with answer key</p>
                <p className="text-xs text-gray-500">Evaluating responses against criteria</p>
              </div>
            </div>

            <div className="flex items-center text-left opacity-50">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Generating results</p>
                <p className="text-xs text-gray-500">Preparing scores and feedback</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This may take a few minutes...</p>
          </div>
        </div>
      </div>
    </div>
  );
};