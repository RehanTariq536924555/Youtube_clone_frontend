const API_BASE_URL = 'http://localhost:4000';

class WatchLaterService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('You must be logged in to perform this action');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async toggleWatchLater(videoId: string): Promise<{ added: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/watch-later/toggle/${videoId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:4000');
      }
      throw error;
    }
  }

  async addToWatchLater(videoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/watch-later/${videoId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to add to watch later');
    }
  }

  async removeFromWatchLater(videoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/watch-later/${videoId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from watch later');
    }
  }

  async getWatchLaterVideos(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/watch-later`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch watch later videos');
    }

    return response.json();
  }

  async checkWatchLater(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/watch-later/check/${videoId}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.isInWatchLater;
    } catch (error) {
      return false;
    }
  }

  async getWatchLaterCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/watch-later/count`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      return 0;
    }
  }
}

export const watchLaterService = new WatchLaterService();
