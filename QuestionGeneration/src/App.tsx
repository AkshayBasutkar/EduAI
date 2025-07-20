import React, { useState } from 'react';
import { FileText, Upload, Settings, Download, Scan, Calculator } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import QuestionGeneration from './components/QuestionGeneration';
import DocumentViewer from './components/DocumentViewer';
import Evaluation from './components/Evaluation';

type Tab = 'upload' | 'generate' | 'evaluate';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [documents, setDocuments] = useState<any[]>([]);
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);

  const tabs = [
    { id: 'upload', label: 'Document Upload', icon: Upload },
    { id: 'generate', label: 'Generate Papers', icon: FileText },
    { id: 'evaluate', label: 'Evaluation', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EduGen AI</h1>
                <p className="text-sm text-gray-600">Smart Question Paper Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by Groq Llama</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <DocumentUpload 
            documents={documents} 
            setDocuments={setDocuments}
            onNext={() => setActiveTab('generate')}
          />
        )}
        {activeTab === 'generate' && (
          <QuestionGeneration 
            documents={documents}
            generatedPaper={generatedPaper}
            setGeneratedPaper={setGeneratedPaper}
          />
        )}
        {activeTab === 'evaluate' && (
          <Evaluation 
            generatedPaper={generatedPaper}
          />
        )}
      </main>
    </div>
  );
}

export default App;