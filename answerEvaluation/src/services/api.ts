import axios from 'axios';
import { EvaluationRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for long-running evaluations
});

export const evaluateScript = async (request: EvaluationRequest): Promise<ApiResponse> => {
  const formData = new FormData();
  
  formData.append('evaluation_type', request.evaluation_type);
  if (request.format_type) {
    formData.append('format_type', request.format_type);
  }
  formData.append('student_script', request.student_script);
  formData.append('teacher_key', request.teacher_key);
  formData.append('marking_scheme', request.marking_scheme);

  const response = await api.post<ApiResponse>('/evaluate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const checkHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await api.get('/health');
  return response.data;
};