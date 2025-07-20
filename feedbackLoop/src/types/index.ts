export interface UploadedFile {
  file: File;
  content: string;
  name: string;
}

export interface ComparisonRequest {
  teacherScript: string;
  studentScript: string;
}

export interface ComparisonResponse {
  feedback: string;
  sessionId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
}