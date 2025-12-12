const API_BASE_URL = 'http://localhost:4000';

export enum LikeType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export enum LikeableType {
  VIDEO = 'video',
  COMMENT = 'comment'
}

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: LikeableType;
  type: LikeType;
  createdAt: string;
}

export interface LikeStats {
  likes: number;
  dislikes: number;
}

class LikeService {
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

  async toggleLike(targetId: string, targetType: LikeableType, type: LikeType): Promise<{ action: string; like?: Like }> {
    const response = await fetch(`${API_BASE_URL}/likes/toggle`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        targetId,
        targetType,
        type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle like');
    }

    return response.json();
  }

  async getUserLike(targetId: string, targetType: LikeableType): Promise<Like | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/user/${targetId}?targetType=${targetType}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      return null;
    }
  }

  async getLikeStats(targetId: string, targetType: LikeableType): Promise<LikeStats> {
    const response = await fetch(`${API_BASE_URL}/likes/stats/${targetId}?targetType=${targetType}`);

    if (!response.ok) {
      throw new Error('Failed to fetch like stats');
    }

    return response.json();
  }
}

export const likeService = new LikeService();