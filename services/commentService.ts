const API_BASE_URL = 'http://localhost:4000';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  parentId?: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  videoId: string;
  parentId?: string;
}

class CommentService {
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

  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create comment');
    }

    return response.json();
  }

  async getVideoComments(videoId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/video/${videoId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  async getCommentReplies(commentId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies`);

    if (!response.ok) {
      throw new Error('Failed to fetch replies');
    }

    return response.json();
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update comment');
    }

    return response.json();
  }

  async deleteComment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete comment');
    }
  }
}

export const commentService = new CommentService();