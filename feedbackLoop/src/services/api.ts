import { ComparisonRequest, ComparisonResponse, ChatResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your backend URL

export class ApiService {
  static async compareScripts(request: ComparisonRequest): Promise<ComparisonResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error comparing scripts:', error);
      throw new Error('Failed to compare scripts. Please check your connection and try again.');
    }
  }

  static async sendChatMessage(sessionId: string, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }
}