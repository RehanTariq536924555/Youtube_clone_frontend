const API_BASE_URL = 'http://localhost:4000';

export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  notificationsEnabled: boolean;
  subscriber: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  channel: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    subscribersCount: number;
  };
  createdAt: string;
}

class SubscriptionService {
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

  async toggleSubscription(channelId: string): Promise<{ action: string; subscription?: Subscription }> {
    const response = await fetch(`${API_BASE_URL}/subscriptions/toggle/${channelId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle subscription');
    }

    return response.json();
  }

  async isSubscribed(channelId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/check/${channelId}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.isSubscribed;
    } catch (error) {
      return false;
    }
  }

  async getMySubscriptions(): Promise<Subscription[]> {
    const response = await fetch(`${API_BASE_URL}/subscriptions/my-subscriptions`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
  }

  async getSubscribers(channelId: string): Promise<Subscription[]> {
    const response = await fetch(`${API_BASE_URL}/subscriptions/subscribers/${channelId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }

    return response.json();
  }

  async getSubscriberCount(channelId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/subscriptions/count/${channelId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch subscriber count');
    }

    const result = await response.json();
    return result.count;
  }

  async updateNotificationSettings(channelId: string, notificationsEnabled: boolean): Promise<Subscription> {
    const response = await fetch(`${API_BASE_URL}/subscriptions/notifications/${channelId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notificationsEnabled }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update notification settings');
    }

    return response.json();
  }
}

export const subscriptionService = new SubscriptionService();