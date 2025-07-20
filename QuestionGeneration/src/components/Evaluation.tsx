import React, { useState, useRef } from 'react';
import { Upload, Scan, Calculator, CheckCircle, X, Eye } from 'lucide-react';

interface EvaluationProps {
  generatedPaper: any;
}

interface StudentResponse {
  studentId: string;
  studentName: string;
  answers: any;
  score?: number;
  percentage?: number;
}

const Evaluation: React.FC<EvaluationProps> = ({ generatedPaper }) => {
  const [answerSheets, setAnswerSheets] = useState<StudentResponse[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<any[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [viewingAnswerKey, setViewingAnswerKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnswerSheetUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newSheets: StudentResponse[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await readFileContent(file);
      
      // Parse the answer sheet content (simplified)
      const studentResponse: StudentResponse = {
        studentId: `student_${Date.now()}_${i}`,
        studentName: file.name.replace(/\.[^/.]+$/, ""),
        answers: parseAnswerSheet(content),
      };
      
      newSheets.push(studentResponse);
    }

    setAnswerSheets([...answerSheets, ...newSheets]);
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

  const parseAnswerSheet = (content: string) => {
    // Simplified parsing - in real implementation, this would be more sophisticated
    const lines = content.split('\n').filter(line => line.trim());
    const answers: any = {
      mcq: [],
      shortAnswers: [],
      longAnswers: []
    };

    lines.forEach(line => {
      if (line.includes('MCQ') || line.includes('Multiple Choice')) {
        const match = line.match(/[ABCD]/g);
        if (match) answers.mcq.push(...match);
      } else if (line.includes('Short Answer')) {
        answers.shortAnswers.push(line.replace('Short Answer:', '').trim());
      } else if (line.includes('Long Answer')) {
        answers.longAnswers.push(line.replace('Long Answer:', '').trim());
      }
    });

    return answers;
  };

  const evaluateAnswerSheets = async () => {
    if (!generatedPaper || answerSheets.length === 0) {
      alert('Please upload answer sheets and ensure you have a generated paper with answer key');
      return;
    }

    setIsEvaluating(true);

    try {
      const results = answerSheets.map(sheet => {
        let totalScore = 0;
        let maxScore = generatedPaper.totalMarks || 100;

        // Evaluate MCQs
        if (generatedPaper.answerKey?.mcq && sheet.answers.mcq) {
          const mcqScore = sheet.answers.mcq.reduce((score: number, answer: string, index: number) => {
            return answer === generatedPaper.answerKey.mcq[index] ? score + 1 : score;
          }, 0);
          totalScore += mcqScore;
        }

        // For short and long answers, we'd need AI evaluation
        // This is simplified for demo purposes
        const shortAnswerScore = sheet.answers.shortAnswers?.length * 3 || 0;
        const longAnswerScore = sheet.answers.longAnswers?.length * 8 || 0;
        
        totalScore += shortAnswerScore + longAnswerScore;
        const percentage = Math.min((totalScore / maxScore) * 100, 100);

        return {
          ...sheet,
          score: totalScore,
          percentage: Math.round(percentage * 100) / 100,
          breakdown: {
            mcq: sheet.answers.mcq?.length || 0,
            shortAnswers: sheet.answers.shortAnswers?.length || 0,
            longAnswers: sheet.answers.longAnswers?.length || 0,
          }
        };
      });

      setEvaluationResults(results);
    } catch (error) {
      console.error('Error evaluating answer sheets:', error);
      alert('Failed to evaluate answer sheets');
    } finally {
      setIsEvaluating(false);
    }
  };

  const removeAnswerSheet = (studentId: string) => {
    setAnswerSheets(answerSheets.filter(sheet => sheet.studentId !== studentId));
    setEvaluationResults(evaluationResults.filter(result => result.studentId !== studentId));
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-500' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Answer Sheet Evaluation</h2>
        <p className="text-lg text-gray-600">
          Upload student answer sheets for automated evaluation and scoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Answer Key & Upload Section */}
        <div className="space-y-6">
          {/* Answer Key Preview */}
          {generatedPaper && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Answer Key</h3>
                <button
                  onClick={() => setViewingAnswerKey(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Full Key</span>
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>{generatedPaper.title}</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Total Marks: {generatedPaper.totalMarks} | Duration: {generatedPaper.duration}
                </p>
                {generatedPaper.answerKey?.mcq && (
                  <p className="text-xs text-blue-600 mt-2">
                    MCQ Answers: {generatedPaper.answerKey.mcq.slice(0, 5).join(', ')}
                    {generatedPaper.answerKey.mcq.length > 5 && '...'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Upload Answer Sheets */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Answer Sheets</h3>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop answer sheets here or browse
              </p>
              <p className="text-sm text-gray-500">
                Support for scanned images, PDF, and text files
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".txt,.pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleAnswerSheetUpload(e.target.files)}
            />

            {answerSheets.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Uploaded Answer Sheets ({answerSheets.length})
                </h4>
                <div className="space-y-2">
                  {answerSheets.map((sheet) => (
                    <div key={sheet.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        {sheet.studentName}
                      </span>
                      <button
                        onClick={() => removeAnswerSheet(sheet.studentId)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answerSheets.length > 0 && (
              <button
                onClick={evaluateAnswerSheets}
                disabled={isEvaluating || !generatedPaper}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {isEvaluating ? (
                  <>
                    <Scan className="h-4 w-4 animate-pulse" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    <span>Evaluate Answer Sheets</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Evaluation Results</h3>
          
          {evaluationResults.length > 0 ? (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {evaluationResults.length}
                  </p>
                  <p className="text-sm text-blue-800">Students</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(evaluationResults.reduce((sum, result) => sum + result.percentage, 0) / evaluationResults.length)}%
                  </p>
                  <p className="text-sm text-green-800">Average</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.max(...evaluationResults.map(r => r.percentage))}%
                  </p>
                  <p className="text-sm text-purple-800">Highest</p>
                </div>
              </div>

              {/* Individual Results */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {evaluationResults.map((result) => {
                  const gradeInfo = getGrade(result.percentage);
                  return (
                    <div key={result.studentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{result.studentName}</h4>
                        <span className={`text-lg font-bold ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {result.score}/{generatedPaper?.totalMarks || 100} marks
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {result.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Evaluation results will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer Key Modal */}
      {viewingAnswerKey && generatedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-5/6 overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Complete Answer Key</h3>
              <button
                onClick={() => setViewingAnswerKey(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              {generatedPaper.answerKey && (
                <div className="space-y-6">
                  {generatedPaper.answerKey.mcq && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Multiple Choice Answers</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {generatedPaper.answerKey.mcq.map((answer: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center text-sm">
                            {index + 1}. {answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedPaper.answerKey.shortAnswers && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Short Answer Guidelines</h4>
                      <div className="space-y-2">
                        {generatedPaper.answerKey.shortAnswers.map((answer: string, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700">{index + 1}. </span>
                            <span className="text-gray-600">{answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedPaper.answerKey.longAnswers && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Long Answer Guidelines</h4>
                      <div className="space-y-3">
                        {generatedPaper.answerKey.longAnswers.map((answer: string, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-medium text-gray-700">{index + 1}. </span>
                            <span className="text-gray-600">{answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluation;