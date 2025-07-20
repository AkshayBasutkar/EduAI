export interface EvaluationRequest {
  evaluation_type: 'omr' | 'descriptive' | 'mixed';
  format_type?: 'handwritten' | 'digital';
  student_script: File;
  teacher_key: File;
  marking_scheme: File;
}

export interface DetailedScore {
  question_number: number;
  max_marks: number;
  marks_awarded: number;
}

export interface DetailedFeedback {
  question_number: number;
  feedback: string;
}

export interface ScoresResult {
  student_id: string;
  total_score_awarded: number;
  detailed_scores: DetailedScore[];
}

export interface FeedbackResult {
  student_id: string;
  summary_feedback: string;
  detailed_feedback: DetailedFeedback[];
}

export interface EvaluationResult {
  scores: ScoresResult;
  feedback: FeedbackResult;
}

export interface ApiResponse {
  success: boolean;
  result?: EvaluationResult;
  error?: string;
  traceback?: string;
}