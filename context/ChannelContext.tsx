import React, { createContext, useContext, useState, useEffect } from 'react';
import { channelService, Channel } from '../services/channelService';
import { useAuth } from './AuthContext';

interface ChannelContextType {
  channels: Channel[];
  activeChannel: Channel | null;
  isLoading: boolean;
  setActiveChannel: (channel: Channel | null) => void;
  refreshChannels: () => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannelState] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Load channels when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadChannels();
    } else {
      setChannels([]);
      setActiveChannelState(null);
      localStorage.removeItem('active_channel');
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const loadChannels = async () => {
    try {
      setIsLoading(true);
      const userChannels = await channelService.getMyChannels();
      setChannels(userChannels);

      // Try to restore previously selected channel
      const savedChannelId = localStorage.getItem('active_channel');
      if (savedChannelId) {
        const savedChannel = userChannels.find(c => c.id === savedChannelId);
        if (savedChannel) {
          setActiveChannelState(savedChannel);
        } else if (userChannels.length > 0) {
          // If saved channel not found, select first channel
          setActiveChannelState(userChannels[0]);
          localStorage.setItem('active_channel', userChannels[0].id);
        }
      } else if (userChannels.length > 0) {
        // No saved channel, select first one
        setActiveChannelState(userChannels[0]);
        localStorage.setItem('active_channel', userChannels[0].id);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveChannel = (channel: Channel | null) => {
    setActiveChannelState(channel);
    if (channel) {
      localStorage.setItem('active_channel', channel.id);
    } else {
      localStorage.removeItem('active_channel');
    }
  };

  const refreshChannels = async () => {
    await loadChannels();
  };

  return (
    <ChannelContext.Provider
      value={{
        channels,
        activeChannel,
        isLoading,
        setActiveChannel,
        refreshChannels,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
};
