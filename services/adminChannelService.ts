import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const adminChannelService = {
  async getAllChannels(page: number = 1, limit: number = 20, search?: string) {
    const token = localStorage.getItem('admin_token');
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await axios.get(`${API_URL}/admin/channels?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getChannelStats() {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/channels/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getUserChannels(userId: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/channels/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getUserChannelCount(userId: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/channels/user/${userId}/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getChannelDetails(id: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/channels/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async suspendChannel(id: string, reason: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(
      `${API_URL}/admin/channels/${id}/suspend`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async unsuspendChannel(id: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(
      `${API_URL}/admin/channels/${id}/unsuspend`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async deleteChannel(id: string) {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${API_URL}/admin/channels/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
