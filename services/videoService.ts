const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  thumbnail?: string;
  visibility: 'public' | 'unlisted' | 'private';
  userId: string;
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  tags: string[];
  category?: string;
  duration?: number;
  isShort?: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    subscribersCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UploadVideoData {
  title: string;
  description?: string;
  visibility?: 'public' | 'unlisted' | 'private';
  thumbnail?: File;
  tags?: string[];
  category?: string;
  duration?: number;
  isShort?: boolean;
  channelId?: string;
}

class VideoService {
  private getAuthToken(): string | null {
    const token = localStorage.getItem('auth_token');
    return token;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      throw new Error('You must be logged in to perform this action');
    }
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async uploadVideo(file: File, data: UploadVideoData): Promise<{ message: string; video: any }> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('You must be logged in to upload videos');
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', data.title);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.visibility) {
      formData.append('visibility', data.visibility);
    }
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    if (data.tags && data.tags.length > 0) {
      formData.append('tags', data.tags.join(','));
    }

    if (data.category) {
      formData.append('category', data.category);
    }

    if (data.duration) {
      formData.append('duration', data.duration.toString());
    }

    if (data.isShort !== undefined) {
      formData.append('isShort', data.isShort.toString());
    }

    console.log('Uploading with token:', token.substring(0, 20) + '...');

    const response = await fetch(`${API_BASE_URL}/videos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const error = await response.json();
        console.error('Upload error:', error);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response');
        errorMessage = `Upload failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getAllVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    return response.json();
  }

  async getMyVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/my-videos`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch your videos');
    }

    return response.json();
  }

  async getVideo(id: string): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }

    return response.json();
  }

  async updateVideo(id: string, data: Partial<UploadVideoData>): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }

    return response.json();
  }

  async deleteVideo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }
  }

  getVideoStreamUrl(id: string): string {
    return `${API_BASE_URL}/videos/${id}/stream`;
  }

  getThumbnailUrl(id: string): string {
    return `${API_BASE_URL}/videos/${id}/thumbnail`;
  }

  // Upload progress tracking (for future enhancement)
  async uploadVideoWithProgress(
    file: File, 
    data: UploadVideoData,
    onProgress?: (progress: number) => void
  ): Promise<{ message: string; video: any }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      formData.append('video', file);
      formData.append('title', data.title);
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.visibility) {
        formData.append('visibility', data.visibility);
      }
      
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }

      if (data.tags && data.tags.length > 0) {
        formData.append('tags', data.tags.join(','));
      }

      if (data.category) {
        formData.append('category', data.category);
      }

      if (data.duration) {
        formData.append('duration', data.duration.toString());
      }

      if (data.isShort !== undefined) {
        formData.append('isShort', data.isShort.toString());
      }

      if (data.channelId) {
        formData.append('channelId', data.channelId);
      }

      // Set up event listeners before opening the request
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Upload response status:', xhr.status);
        console.log('Upload response text:', xhr.responseText);
        
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.error('Upload error response:', errorResponse);
            reject(new Error(errorResponse.message || 'Upload failed'));
          } catch (e) {
            console.error('Failed to parse error response:', xhr.responseText);
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      // Open the request BEFORE setting headers
      xhr.open('POST', `${API_BASE_URL}/videos/upload`);
      
      // Set timeout (30 minutes for large video uploads - 2GB can take time)
      xhr.timeout = 30 * 60 * 1000;

      // Set headers AFTER opening the request
      const token = this.getAuthToken();
      console.log('Auth token for upload:', token ? 'Present' : 'Missing');
      
      if (!token) {
        reject(new Error('You must be logged in to upload videos'));
        return;
      }
      
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      // Send the request
      xhr.send(formData);
    });
  }

  async searchVideos(query: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to search videos');
    }

    return response.json();
  }

  async getTrendingVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/trending`);

    if (!response.ok) {
      throw new Error('Failed to fetch trending videos');
    }

    return response.json();
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/category/${encodeURIComponent(category)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch videos by category');
    }

    return response.json();
  }

  async recordView(videoId: string): Promise<void> {
    const token = this.getAuthToken();
    
    if (!token) {
      console.warn('⚠️ No auth token - cannot record view');
      return;
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('📹 Recording view for video:', videoId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/views/record/${videoId}`, {
        method: 'POST',
        headers,
      });
      
      console.log('📡 Record view response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to record view:', response.status, errorText);
        throw new Error(`Failed to record view: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ View recorded successfully:', result);
    } catch (error) {
      console.error('❌ Error recording view:', error);
      throw error; // Re-throw so VideoPlayer can see the error
    }
  }

  async updateWatchTime(viewId: string, watchTime: number, completed: boolean = false): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/views/${viewId}/watch-time`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchTime, completed }),
      });
    } catch (error) {
      console.warn('Failed to update watch time:', error);
    }
  }

  // Shorts-specific methods
  async getAllShorts(): Promise<Video[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth headers if available
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/videos/shorts`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch shorts: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching shorts:', error);
      throw error;
    }
  }

  async getTrendingShorts(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/shorts/trending`);

    if (!response.ok) {
      throw new Error('Failed to fetch trending shorts');
    }

    return response.json();
  }

  async markAsShort(videoId: string): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/mark-as-short`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark as short');
    }

    return response.json();
  }
}

export const videoService = new VideoService();