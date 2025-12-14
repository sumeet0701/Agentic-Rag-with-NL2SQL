export interface ChatSession {
  id: string;
  title: string;
  date: string;
}

// TODO: Update this to match your backend API URL if it's running on a different port (e.g., http://localhost:5000/api)
const API_BASE_URL = '/api';

export const chatService = {
  getHistory: async (): Promise<ChatSession[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`);
      if (!response.ok) {
        // Return empty array if backend is not ready yet
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },

  deleteSession: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/chat/history/${id}`, {
      method: 'DELETE',
    });
  }
};