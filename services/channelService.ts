import axios from 'axios';

const API_URL = 'http://localhost:4000';

export interface Channel {
  id: string;
  name: string;
  handle: string;
  description?: string;
  avatar?: string;
  banner?: string;
  userId: string;
  subscribersCount: number;
  videosCount: number;
  totalViews: number;
  isSuspended: boolean;
  suspensionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const channelService = {
  async createChannel(data: { name: string; handle: string; description?: string }) {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(`${API_URL}/channels`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getMyChannels(): Promise<Channel[]> {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/channels/my-channels`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getMyChannelCount(): Promise<number> {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/channels/my-channels/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getChannel(id: string): Promise<Channel> {
    const response = await axios.get(`${API_URL}/channels/${id}`);
    return response.data;
  },

  async getChannelByHandle(handle: string): Promise<Channel> {
    const response = await axios.get(`${API_URL}/channels/handle/${handle}`);
    return response.data;
  },

  async updateChannel(id: string, data: Partial<Channel>) {
    const token = localStorage.getItem('auth_token');
    const response = await axios.patch(`${API_URL}/channels/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteChannel(id: string) {
    const token = localStorage.getItem('auth_token');
    const response = await axios.delete(`${API_URL}/channels/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getAllChannels(page: number = 1, limit: number = 20, search?: string) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await axios.get(`${API_URL}/channels?${params}`);
    return response.data;
  },
};
