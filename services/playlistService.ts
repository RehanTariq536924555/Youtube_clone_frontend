const API_BASE_URL = 'http://localhost:4000';

export enum PlaylistVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  visibility: PlaylistVisibility;
  isSystemPlaylist: boolean;
  systemPlaylistType?: string;
  videosCount: number;
  createdAt: string;
  updatedAt: string;
  playlistVideos?: PlaylistVideo[];
}

export interface PlaylistVideo {
  id: string;
  playlistId: string;
  videoId: string;
  position: number;
  addedAt: string;
  video?: any;
}

class PlaylistService {
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

  async getMyPlaylists(): Promise<Playlist[]> {
    const response = await fetch(`${API_BASE_URL}/playlists/my-playlists`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    return response.json();
  }

  async getPlaylist(id: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist');
    }

    return response.json();
  }

  async createPlaylist(data: { name: string; description?: string; visibility?: PlaylistVisibility }): Promise<Playlist> {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    return response.json();
  }

  async updatePlaylist(id: string, data: { name?: string; description?: string; visibility?: PlaylistVisibility }): Promise<Playlist> {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update playlist');
    }

    return response.json();
  }

  async deletePlaylist(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete playlist');
    }
  }

  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<PlaylistVideo> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/videos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add video to playlist');
    }

    return response.json();
  }

  async removeVideoFromPlaylist(playlistId: string, videoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/videos/${videoId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove video from playlist');
    }
  }
}

export const playlistService = new PlaylistService();
