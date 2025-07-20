import React, { useState } from 'react';
import { GraduationCap, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { ChatInterface } from './components/ChatInterface';
import { ApiService } from './services/api';
import { UploadedFile, ChatMessage } from './types';

function App() {
  const [teacherScript, setTeacherScript] = useState<UploadedFile | null>(null);
  const [studentScript, setStudentScript] = useState<UploadedFile | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'feedback' | 'chat'>('upload');

  const handleCompareScripts = async () => {
    if (!teacherScript || !studentScript) {
      alert('Please upload both teacher and student scripts.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await ApiService.compareScripts({
        teacherScript: teacherScript.content,
        studentScript: studentScript.content,
      });

      setFeedback(response.feedback);
      setSessionId(response.sessionId);
      setCurrentStep('feedback');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while processing the scripts.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendChatMessage = async (message: string) => {
    if (!sessionId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await ApiService.sendChatMessage(sessionId, message);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const resetAssessment = () => {
    setTeacherScript(null);
    setStudentScript(null);
    setFeedback('');
    setSessionId('');
    setChatMessages([]);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Assessment Platform</h1>
                <p className="text-sm text-gray-600">AI-powered script comparison and feedback</p>
              </div>
            </div>
            
            {currentStep !== 'upload' && (
              <button
                onClick={resetAssessment}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                New Assessment
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-medium">Upload Scripts</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep !== 'upload' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'feedback' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'feedback' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-medium">Review Feedback</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep === 'chat' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'chat' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-medium">Interactive Chat</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {currentStep === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Answer Scripts</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload both the teacher's reference script and the student's answer script to get detailed AI-powered feedback and analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FileUpload
                label="Teacher's Reference Script"
                onFileUpload={setTeacherScript}
                uploadedFile={teacherScript}
                onRemoveFile={() => setTeacherScript(null)}
              />
              
              <FileUpload
                label="Student's Answer Script"
                onFileUpload={setStudentScript}
                uploadedFile={studentScript}
                onRemoveFile={() => setStudentScript(null)}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleCompareScripts}
                disabled={!teacherScript || !studentScript || isProcessing}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Scripts...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Analyze Scripts
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {currentStep === 'feedback' && feedback && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Feedback Analysis</h2>
              <p className="text-lg text-gray-600">
                Here's the detailed comparison and feedback for the submitted scripts.
              </p>
            </div>

            <FeedbackDisplay feedback={feedback} />

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('chat')}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Interactive Chat
              </button>
            </div>
          </div>
        )}

        {/* Chat Section */}
        {currentStep === 'chat' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Learning Chat</h2>
              <p className="text-lg text-gray-600">
                Ask follow-up questions about the feedback or request additional clarification.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Feedback</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                    {feedback}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask Questions</h3>
                <ChatInterface
                  messages={chatMessages}
                  onSendMessage={handleSendChatMessage}
                  isLoading={isChatLoading}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;