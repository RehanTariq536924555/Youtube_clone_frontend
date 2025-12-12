import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';

interface SubscribeButtonProps {
  channelId: string;
  channelName: string;
  subscribersCount?: number;
  currentUserId?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  channelId,
  channelName,
  subscribersCount = 0,
  currentUserId,
  size = 'md'
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(subscribersCount);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  useEffect(() => {
    if (currentUserId && channelId !== currentUserId) {
      checkSubscriptionStatus();
    }
  }, [channelId, currentUserId]);

  const checkSubscriptionStatus = async () => {
    try {
      const subscribed = await subscriptionService.isSubscribed(channelId);
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUserId || loading || channelId === currentUserId) return;

    setLoading(true);
    try {
      const result = await subscriptionService.toggleSubscription(channelId);
      
      if (result.action === 'subscribed') {
        setIsSubscribed(true);
        setSubCount(prev => prev + 1);
      } else if (result.action === 'unsubscribed') {
        setIsSubscribed(false);
        setSubCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async () => {
    if (!currentUserId || !isSubscribed) return;

    try {
      await subscriptionService.updateNotificationSettings(channelId, !notificationsEnabled);
      setNotificationsEnabled(!notificationsEnabled);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const formatSubscriberCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Don't show subscribe button for own channel
  if (!currentUserId || channelId === currentUserId) {
    return (
      <div className={`text-gray-600 ${sizeClasses[size]}`}>
        {formatSubscriberCount(subCount)} subscribers
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`
          font-medium rounded-full transition-colors
          ${sizeClasses[size]}
          ${isSubscribed 
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
            : 'bg-red-600 text-white hover:bg-red-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? 'Loading...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>

      {isSubscribed && (
        <button
          onClick={handleNotificationToggle}
          className={`
            p-2 rounded-full transition-colors
            ${notificationsEnabled 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }
          `}
          title={notificationsEnabled ? 'Turn off notifications' : 'Turn on notifications'}
        >
          {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
        </button>
      )}

      <span className="text-sm text-gray-600">
        {formatSubscriberCount(subCount)} subscribers
      </span>
    </div>
  );
};

export default SubscribeButton;