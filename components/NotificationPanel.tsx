import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, User, Video, Heart, MessageCircle, UserPlus } from 'lucide-react';

interface Notification {
  id: string;
  type: 'video' | 'like' | 'comment' | 'subscribe' | 'system';
  title: string;
  message: string;
  thumbnail?: string;
  avatar?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'video',
        title: 'New video from TechReviewer',
        message: 'iPhone 15 Pro Max Review - Is it worth the upgrade?',
        thumbnail: 'https://via.placeholder.com/120x68',
        avatar: 'https://ui-avatars.com/api/?name=TechReviewer&background=random',
        timestamp: '2 hours ago',
        read: false,
        actionUrl: '/video/123'
      },
      {
        id: '2',
        type: 'like',
        title: 'Someone liked your video',
        message: 'John Doe liked "My Amazing Travel Vlog"',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
        timestamp: '4 hours ago',
        read: false,
        actionUrl: '/video/456'
      },
      {
        id: '3',
        type: 'comment',
        title: 'New comment on your video',
        message: 'Sarah commented: "Great content! Keep it up!"',
        avatar: 'https://ui-avatars.com/api/?name=Sarah&background=random',
        timestamp: '6 hours ago',
        read: true,
        actionUrl: '/video/456'
      },
      {
        id: '4',
        type: 'subscribe',
        title: 'New subscriber',
        message: 'Mike Johnson subscribed to your channel',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
        timestamp: '1 day ago',
        read: true,
        actionUrl: '/channel/789'
      },
      {
        id: '5',
        type: 'system',
        title: 'NebulaStream Update',
        message: 'New features available! Check out our latest updates.',
        avatar: '/logo.png',
        timestamp: '2 days ago',
        read: true,
        actionUrl: '/updates'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'subscribe':
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-zinc-400" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed top-16 right-4 w-96 max-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell size={20} />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                <Settings size={18} className="text-zinc-400" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
              >
                <X size={18} className="text-zinc-400" />
              </button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ml-auto text-sm text-blue-400 hover:text-blue-300"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No notifications</p>
              <p className="text-zinc-500 text-sm">
                {filter === 'unread' ? 'All caught up!' : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      // Navigate to action URL
                      window.location.hash = notification.actionUrl;
                      onClose();
                    }
                  }}
                >
                  <div className="flex gap-3">
                    {/* Avatar/Thumbnail */}
                    <div className="relative shrink-0">
                      {notification.thumbnail ? (
                        <img
                          src={notification.thumbnail}
                          alt=""
                          className="w-12 h-8 object-cover rounded"
                        />
                      ) : (
                        <img
                          src={notification.avatar || `https://ui-avatars.com/api/?name=User&background=random`}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      
                      {/* Type Icon */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-700">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {notification.timestamp}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-700 bg-zinc-800/50">
          <button className="w-full text-sm text-blue-400 hover:text-blue-300 text-center">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
};