const API_BASE_URL = 'http://localhost:4000';

class DownloadService {
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

  async downloadVideo(videoId: string, videoTitle: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('You must be logged in to download videos');
      }

      console.log('Starting download for video:', videoId);
      
      // Create download URL
      const url = `${API_BASE_URL}/downloads/file/${videoId}`;
      console.log('Download URL:', url);
      
      // Fetch the video file
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Download response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Download failed:', errorText);
        throw new Error(`Failed to download video: ${response.status} - ${errorText}`);
      }

      // Get the blob
      console.log('Downloading blob...');
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = videoTitle + '.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  async recordDownload(videoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/downloads/record/${videoId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to record download');
    }
  }

  async getDownloads(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/downloads`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch downloads');
    }

    return response.json();
  }

  async removeDownload(videoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/downloads/${videoId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove download');
    }
  }

  async getDownloadCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/downloads/count`, {
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

export const downloadService = new DownloadService();
