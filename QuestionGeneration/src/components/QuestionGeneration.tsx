import React, { useState } from 'react';
import { Settings, FileText, Download, Loader2, CheckCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
}

interface QuestionGenerationProps {
  documents: Document[];
  generatedPaper: any;
  setGeneratedPaper: (paper: any) => void;
}

interface GenerationParams {
  paperType: 'weekly' | 'monthly' | 'yearly';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  mcqCount: number;
  shortAnswerCount: number;
  longAnswerCount: number;
  includeImportant: boolean;
  totalMarks: number;
  duration: number;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({ 
  documents, 
  generatedPaper, 
  setGeneratedPaper 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [params, setParams] = useState<GenerationParams>({
    paperType: 'weekly',
    difficulty: 'mixed',
    mcqCount: 10,
    shortAnswerCount: 5,
    longAnswerCount: 3,
    includeImportant: true,
    totalMarks: 100,
    duration: 3,
  });

  const generateQuestions = async () => {
    if (documents.length === 0) {
      alert('Please upload documents first');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate mock question paper based on parameters
      const result = await generateMockQuestionPaper();
      setGeneratedPaper(result);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockQuestionPaper = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const documentTopics = documents.map(doc => {
      // Extract potential topics from document content
      const words = doc.content.toLowerCase().split(/\s+/);
      const topics = words.filter(word => word.length > 5).slice(0, 10);
      return { type: doc.type, topics };
    });

    const mcqQuestions = [];
    const shortAnswerQuestions = [];
    const longAnswerQuestions = [];
    const mcqAnswers = [];

    // Generate MCQ questions
    for (let i = 0; i < params.mcqCount; i++) {
      const randomTopic = documentTopics[Math.floor(Math.random() * documentTopics.length)];
      const topic = randomTopic.topics[Math.floor(Math.random() * randomTopic.topics.length)] || 'general topic';
      
      mcqQuestions.push({
        id: i + 1,
        question: `Which of the following best describes ${topic} in the context of ${params.paperType} assessment?`,
        options: [
          `A) ${topic} is primarily used for theoretical understanding`,
          `B) ${topic} has practical applications in real-world scenarios`,
          `C) ${topic} is fundamental to advanced concepts`,
          `D) ${topic} requires memorization of key principles`
        ],
        correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        marks: 1,
        difficulty: params.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : params.difficulty
      });
      
      mcqAnswers.push(mcqQuestions[i].correctAnswer);
    }

    // Generate Short Answer questions
    for (let i = 0; i < params.shortAnswerCount; i++) {
      const randomTopic = documentTopics[Math.floor(Math.random() * documentTopics.length)];
      const topic = randomTopic.topics[Math.floor(Math.random() * randomTopic.topics.length)] || 'key concept';
      
      shortAnswerQuestions.push({
        id: i + 1,
        question: `Explain the significance of ${topic} and its applications in the given context. Provide relevant examples.`,
        marks: Math.ceil(params.totalMarks * 0.3 / params.shortAnswerCount),
        difficulty: params.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : params.difficulty,
        sampleAnswer: `${topic} plays a crucial role in understanding the fundamental concepts. It involves key principles that are essential for practical applications and theoretical understanding.`
      });
    }

    // Generate Long Answer questions
    for (let i = 0; i < params.longAnswerCount; i++) {
      const randomTopic = documentTopics[Math.floor(Math.random() * documentTopics.length)];
      const topic = randomTopic.topics[Math.floor(Math.random() * randomTopic.topics.length)] || 'advanced topic';
      
      longAnswerQuestions.push({
        id: i + 1,
        question: `Discuss in detail the comprehensive understanding of ${topic}. Analyze its theoretical foundations, practical implementations, and future implications in the field.`,
        marks: Math.ceil(params.totalMarks * 0.4 / params.longAnswerCount),
        difficulty: params.difficulty === 'mixed' ? ['medium', 'hard'][Math.floor(Math.random() * 2)] : params.difficulty,
        sampleAnswer: `${topic} represents a comprehensive area of study that encompasses multiple dimensions. The theoretical foundations include fundamental principles and established methodologies. Practical implementations demonstrate real-world applications and case studies. Future implications suggest emerging trends and potential developments in the field.`
      });
    }

    const paperTitle = `${params.paperType.charAt(0).toUpperCase() + params.paperType.slice(1)} Assessment Paper`;
    
    return {
      title: paperTitle,
      duration: `${params.duration} hours`,
      totalMarks: params.totalMarks,
      sections: [
        ...(params.mcqCount > 0 ? [{
          name: "Section A - Multiple Choice Questions",
          instructions: "Choose the correct answer from the given options. Each question carries 1 mark.",
          questions: mcqQuestions
        }] : []),
        ...(params.shortAnswerCount > 0 ? [{
          name: "Section B - Short Answer Questions",
          instructions: "Answer the following questions in 50-100 words each.",
          questions: shortAnswerQuestions
        }] : []),
        ...(params.longAnswerCount > 0 ? [{
          name: "Section C - Long Answer Questions", 
          instructions: "Answer the following questions in 200-300 words each. Support your answers with relevant examples.",
          questions: longAnswerQuestions
        }] : [])
      ],
      answerKey: {
        mcq: mcqAnswers,
        shortAnswers: shortAnswerQuestions.map(q => q.sampleAnswer),
        longAnswers: longAnswerQuestions.map(q => q.sampleAnswer)
      }
    };
  };

  const downloadPaper = (format: 'pdf' | 'txt') => {
    if (!generatedPaper) return;

    let content = '';
    
    if (format === 'txt') {
      content = `${generatedPaper.title}\n`;
      content += `Duration: ${generatedPaper.duration}\n`;
      content += `Total Marks: ${generatedPaper.totalMarks}\n\n`;
      
      generatedPaper.sections.forEach((section: any, sectionIndex: number) => {
        content += `${section.name}\n`;
        content += `${section.instructions}\n\n`;
        
        section.questions.forEach((q: any, qIndex: number) => {
          content += `${qIndex + 1}. ${q.question}\n`;
          if (q.options) {
            q.options.forEach((option: string) => {
              content += `   ${option}\n`;
            });
          }
          content += `   [${q.marks} marks]\n\n`;
        });
      });
    }

    const blob = new Blob([content], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-paper-${params.paperType}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Question Paper</h2>
        <p className="text-lg text-gray-600">
          Configure your preferences and generate AI-powered question papers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Parameters Panel */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Paper Configuration</h3>
          </div>

          <div className="space-y-6">
            {/* Paper Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Type
              </label>
              <select
                value={params.paperType}
                onChange={(e) => setParams({...params, paperType: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Weekly Assessment</option>
                <option value="monthly">Monthly Test</option>
                <option value="yearly">Annual Examination</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={params.difficulty}
                onChange={(e) => setParams({...params, difficulty: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed Difficulty</option>
              </select>
            </div>

            {/* Question Counts */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MCQs
                </label>
                <input
                  type="number"
                  value={params.mcqCount}
                  onChange={(e) => setParams({...params, mcqCount: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Answer
                </label>
                <input
                  type="number"
                  value={params.shortAnswerCount}
                  onChange={(e) => setParams({...params, shortAnswerCount: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Answer
                </label>
                <input
                  type="number"
                  value={params.longAnswerCount}
                  onChange={(e) => setParams({...params, longAnswerCount: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="10"
                />
              </div>
            </div>

            {/* Total Marks and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={params.totalMarks}
                  onChange={(e) => setParams({...params, totalMarks: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={params.duration}
                  onChange={(e) => setParams({...params, duration: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="6"
                  step="0.5"
                />
              </div>
            </div>

            {/* Include Important Topics */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeImportant"
                checked={params.includeImportant}
                onChange={(e) => setParams({...params, includeImportant: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeImportant" className="text-sm font-medium text-gray-700">
                Prioritize Important Topics
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuestions}
              disabled={isGenerating || documents.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Generate Question Paper</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Paper Preview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Generated Paper</h3>
            {generatedPaper && (
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadPaper('txt')}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>TXT</span>
                </button>
                <button
                  onClick={() => downloadPaper('pdf')}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>

          {generatedPaper ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Paper Generated Successfully</span>
                </div>
                <h4 className="font-semibold text-gray-900">{generatedPaper.title}</h4>
                <p className="text-sm text-gray-600">
                  Duration: {generatedPaper.duration} | Total Marks: {generatedPaper.totalMarks}
                </p>
              </div>

              {generatedPaper.sections?.map((section: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">{section.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">{section.instructions}</p>
                  <p className="text-xs text-blue-600">
                    {section.questions?.length || 0} questions
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Generated question paper will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGeneration;