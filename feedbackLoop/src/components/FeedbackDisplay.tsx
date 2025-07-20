import React from 'react';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: string;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  // Simple parsing to identify different types of feedback
  const sections = feedback.split('\n\n').filter(section => section.trim());

  const getSectionIcon = (content: string) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('mistake') || lowerContent.includes('error') || lowerContent.includes('incorrect')) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (lowerContent.includes('good') || lowerContent.includes('correct') || lowerContent.includes('well')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Lightbulb className="w-5 h-5 text-blue-500" />;
  };

  const getSectionStyle = (content: string) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('mistake') || lowerContent.includes('error') || lowerContent.includes('incorrect')) {
      return 'border-l-4 border-red-200 bg-red-50';
    }
    if (lowerContent.includes('good') || lowerContent.includes('correct') || lowerContent.includes('well')) {
      return 'border-l-4 border-green-200 bg-green-50';
    }
    return 'border-l-4 border-blue-200 bg-blue-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Feedback Analysis</h3>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getSectionStyle(section)}`}
          >
            <div className="flex items-start space-x-3">
              {getSectionIcon(section)}
              <div className="flex-1">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {section}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Use the chat interface below to ask specific questions about this feedback or request clarification on any points.
        </p>
      </div>
    </div>
  );
};