import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { likeService, LikeType, LikeableType } from '../services/likeService';

interface LikeDislikeButtonProps {
  targetId: string;
  targetType: LikeableType;
  initialLikes?: number;
  initialDislikes?: number;
  currentUserId?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LikeDislikeButton: React.FC<LikeDislikeButtonProps> = ({
  targetId,
  targetType,
  initialLikes = 0,
  initialDislikes = 0,
  currentUserId,
  size = 'md'
}) => {
  const [userLike, setUserLike] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [dislikesCount, setDislikesCount] = useState(initialDislikes);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  useEffect(() => {
    if (currentUserId) {
      likeService.getUserLike(targetId, targetType)
        .then(setUserLike)
        .catch(() => setUserLike(null));
    }
  }, [targetId, targetType, currentUserId]);

  const handleLike = async (type: LikeType) => {
    if (!currentUserId || loading) return;

    setLoading(true);
    try {
      const result = await likeService.toggleLike(targetId, targetType, type);
      
      if (result.action === 'created') {
        setUserLike(result.like);
        if (type === LikeType.LIKE) {
          setLikesCount(prev => prev + 1);
        } else {
          setDislikesCount(prev => prev + 1);
        }
      } else if (result.action === 'removed') {
        setUserLike(null);
        if (type === LikeType.LIKE) {
          setLikesCount(prev => prev - 1);
        } else {
          setDislikesCount(prev => prev - 1);
        }
      } else if (result.action === 'updated') {
        setUserLike(result.like);
        if (userLike?.type === LikeType.LIKE) {
          setLikesCount(prev => prev - 1);
          setDislikesCount(prev => prev + 1);
        } else {
          setDislikesCount(prev => prev - 1);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLike(LikeType.LIKE)}
        disabled={!currentUserId || loading}
        className={`
          flex items-center space-x-1 rounded-full border transition-colors
          ${sizeClasses[size]}
          ${userLike?.type === LikeType.LIKE 
            ? 'bg-blue-100 border-blue-300 text-blue-700' 
            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
          }
          ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
        `}
      >
        <ThumbsUp size={iconSizes[size]} />
        <span>{formatCount(likesCount)}</span>
      </button>

      <button
        onClick={() => handleLike(LikeType.DISLIKE)}
        disabled={!currentUserId || loading}
        className={`
          flex items-center space-x-1 rounded-full border transition-colors
          ${sizeClasses[size]}
          ${userLike?.type === LikeType.DISLIKE 
            ? 'bg-red-100 border-red-300 text-red-700' 
            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
          }
          ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
        `}
      >
        <ThumbsDown size={iconSizes[size]} />
        <span>{formatCount(dislikesCount)}</span>
      </button>
    </div>
  );
};

export default LikeDislikeButton;