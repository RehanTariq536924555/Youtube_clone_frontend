import React, { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { watchLaterService } from '../services/watchLaterService';

interface WatchLaterButtonProps {
  videoId: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (added: boolean) => void;
}

export const WatchLaterButton: React.FC<WatchLaterButtonProps> = ({
  videoId,
  variant = 'icon',
  size = 'md',
  onToggle,
}) => {
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkWatchLaterStatus();
  }, [videoId]);

  const checkWatchLaterStatus = async () => {
    try {
      const status = await watchLaterService.checkWatchLater(videoId);
      setIsInWatchLater(status);
    } catch (error) {
      console.error('Failed to check watch later status:', error);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await watchLaterService.toggleWatchLater(videoId);
      setIsInWatchLater(result.added);
      onToggle?.(result.added);
    } catch (error: any) {
      console.error('Failed to toggle watch later:', error);
      
      // Show more helpful error message
      let errorMsg = 'Failed to update watch later';
      if (error.message.includes('logged in')) {
        errorMsg = 'Please log in to use Watch Later';
      } else if (error.message.includes('fetch')) {
        errorMsg = 'Cannot connect to server. Make sure backend is running.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isInWatchLater
            ? 'bg-zinc-700 text-white hover:bg-zinc-600'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isInWatchLater ? (
          <>
            <Check size={iconSize} />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Clock size={iconSize} />
            <span>Watch Later</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isInWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
      className={`p-2 rounded-full transition-colors ${
        isInWatchLater
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isInWatchLater ? <Check size={iconSize} /> : <Clock size={iconSize} />}
    </button>
  );
};
