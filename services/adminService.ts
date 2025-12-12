import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/admin/dashboard/stats`, getAuthHeaders());
    return response.data;
  },

  getAllUsers: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    
    const response = await axios.get(`${API_URL}/admin/users?${params}`, getAuthHeaders());
    return response.data;
  },

  createAdmin: async (name: string, email: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/admin/users/create-admin`,
      { name, email, password },
      getAuthHeaders()
    );
    return response.data;
  },

  changeUserPassword: async (userId: string, newPassword: string) => {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/change-password`,
      { newPassword },
      getAuthHeaders()
    );
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await axios.get(`${API_URL}/admin/users/${userId}`, getAuthHeaders());
    return response.data;
  },

  banUser: async (userId: string, reason: string) => {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/ban`,
      { reason },
      getAuthHeaders()
    );
    return response.data;
  },

  unbanUser: async (userId: string) => {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/unban`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/role`,
      { role },
      getAuthHeaders()
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, getAuthHeaders());
    return response.data;
  },

  getAllVideos: async (page: number, limit: number, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    
    const response = await axios.get(`${API_URL}/admin/videos?${params}`, getAuthHeaders());
    return response.data;
  },

  featureVideo: async (videoId: string) => {
    const response = await axios.put(
      `${API_URL}/admin/videos/${videoId}/feature`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  suspendVideo: async (videoId: string, reason?: string) => {
    const response = await axios.put(
      `${API_URL}/admin/videos/${videoId}/suspend`,
      { reason },
      getAuthHeaders()
    );
    return response.data;
  },

  unsuspendVideo: async (videoId: string) => {
    const response = await axios.put(
      `${API_URL}/admin/videos/${videoId}/unsuspend`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  deleteVideo: async (videoId: string) => {
    const response = await axios.delete(`${API_URL}/admin/videos/${videoId}`, getAuthHeaders());
    return response.data;
  },

  getAllComments: async (page: number, limit: number) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await axios.get(`${API_URL}/admin/comments?${params}`, getAuthHeaders());
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await axios.delete(`${API_URL}/admin/comments/${commentId}`, getAuthHeaders());
    return response.data;
  },

  getAnalytics: async (period: string = '7d') => {
    const response = await axios.get(
      `${API_URL}/admin/analytics?period=${period}`,
      getAuthHeaders()
    );
    return response.data;
  },
};
