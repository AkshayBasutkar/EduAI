import React from 'react';
import { EvaluationResult } from '../types';
import { Award, FileText, TrendingUp, Download, RotateCcw } from 'lucide-react';

interface ResultsDisplayProps {
  result: EvaluationResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const { scores, feedback } = result;
  
  const totalMaxMarks = scores.detailed_scores?.reduce((sum, score) => sum + score.max_marks, 0) || 0;
  const percentage = totalMaxMarks > 0 ? (scores.total_score_awarded / totalMaxMarks) * 100 : 0;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluation_results_${scores.student_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluation Results</h1>
              <p className="text-gray-600">Student ID: {scores.student_id}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={downloadResults}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={onReset}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Evaluation
              </button>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getGradeColor(percentage)} mb-3`}>
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getGrade(percentage)}</h3>
              <p className="text-gray-600">Grade</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-3">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{percentage.toFixed(1)}%</h3>
              <p className="text-gray-600">Percentage</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-3">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{scores.total_score_awarded}</h3>
              <p className="text-gray-600">Marks Scored</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-3">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{totalMaxMarks}</h3>
              <p className="text-gray-600">Total Marks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Scores */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Question-wise Scores</h2>
            {scores.detailed_scores && scores.detailed_scores.length > 0 ? (
              <div className="space-y-4">
                {scores.detailed_scores.map((score) => (
                  <div key={score.question_number} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">Question {score.question_number}</h3>
                      <span className="text-lg font-bold text-gray-900">
                        {score.marks_awarded}/{score.max_marks}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score.max_marks > 0 ? (score.marks_awarded / score.max_marks) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {score.max_marks > 0 ? ((score.marks_awarded / score.max_marks) * 100).toFixed(1) : 0}% correct
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No detailed scores available</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Feedback</h2>
            
            {/* Summary Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Overall Performance</h3>
              <p className="text-blue-800">{feedback.summary_feedback}</p>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Question-wise Feedback</h3>
              {feedback.detailed_feedback && feedback.detailed_feedback.length > 0 ? (
                feedback.detailed_feedback.map((item) => (
                  <div key={item.question_number} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Question {item.question_number}</h4>
                    <p className="text-gray-700">{item.feedback}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No detailed feedback available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};