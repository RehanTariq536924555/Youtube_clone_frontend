import React, { useState, useEffect, useRef } from 'react';
import { Play, Heart, MessageCircle, Share, MoreVertical, Volume2, VolumeX, User, ArrowUp, ArrowDown, X, Send } from 'lucide-react';
import { videoService, Video } from '../services/videoService';
import { useAuth } from '../context/AuthContext';
import { likeService, LikeType, LikeableType } from '../services/likeService';
import { commentService, Comment } from '../services/commentService';


interface ShortVideoPlayerProps {
  video: Video;
  isActive: boolean;
  onVideoEnd: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalVideos: number;
}

const ShortVideoPlayer: React.FC<ShortVideoPlayerProps> = ({
  video,
  isActive,
  onVideoEnd,
  onNext,
  onPrevious,
  currentIndex,
  totalVideos
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Like functionality
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);

  // Comment functionality
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsCount, setCommentsCount] = useState(video.commentsCount);

  // Share functionality
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.currentTime = 0;
      videoElement.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateProgress = () => {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd();
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Load user's like status when video changes
  useEffect(() => {
    console.log('Video changed or user/active status changed:', {
      videoId: video.id,
      userId: user?.id,
      isActive,
      hasUser: !!user
    });

    if (user && isActive) {
      loadUserLikeStatus();
    }
  }, [video.id, user, isActive]);

  const loadUserLikeStatus = async () => {
    try {
      console.log('Loading like status for video:', video.id, 'user:', user?.id);
      const userLike = await likeService.getUserLike(video.id, LikeableType.VIDEO);
      console.log('User like status:', userLike);
      setIsLiked(userLike?.type === LikeType.LIKE);
    } catch (error) {
      console.error('Failed to load like status:', error);
      // Don't show alert for this, just log the error
    }
  };

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      videoElement.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
    setShowControls(true);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    setIsMuted(videoElement.muted);
    setShowControls(true);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Like functionality
  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like videos');
      return;
    }

    try {
      console.log('Toggling like for video:', video.id);
      const result = await likeService.toggleLike(video.id, LikeableType.VIDEO, LikeType.LIKE);
      console.log('Like toggle result:', result);

      if (result.action === 'created' || result.action === 'updated') {
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      } else if (result.action === 'removed') {
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to like video';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Comment functionality
  const handleShowComments = async () => {
    if (!showComments) {
      try {
        console.log('Loading comments for video:', video.id);
        const videoComments = await commentService.getVideoComments(video.id);
        console.log('Comments loaded:', videoComments);
        setComments(videoComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load comments';
        alert(`Error loading comments: ${errorMessage}`);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      console.log('Creating comment for video:', video.id);
      const comment = await commentService.createComment({
        content: newComment.trim(),
        videoId: video.id
      });
      console.log('Comment created:', comment);

      setComments(prev => [comment, ...prev]);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Share functionality
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyVideoLink = () => {
    const videoUrl = `${window.location.origin}/video/${video.id}`;
    navigator.clipboard.writeText(videoUrl).then(() => {
      alert('Video link copied to clipboard!');
      setShowShareMenu(false);
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const shareToSocial = (platform: string) => {
    const videoUrl = `${window.location.origin}/video/${video.id}`;
    const text = `Check out this video: ${video.title}`;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(videoUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + videoUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video Container - YouTube Shorts style */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoService.getVideoStreamUrl(video.id)}
          muted={isMuted}
          playsInline
          preload="metadata"
          loop
        />
      </div>

      {/* Tap Areas for Navigation */}
      <div className="absolute inset-0 flex">
        {/* Left tap area - Previous */}
        <div
          className="flex-1 cursor-pointer flex items-center justify-start pl-8"
          onClick={onPrevious}
        >
          {showControls && currentIndex > 0 && (
            <div className="bg-black/30 rounded-full p-2 opacity-60">
              <ArrowUp size={24} className="text-white" />
            </div>
          )}
        </div>

        {/* Center tap area - Play/Pause */}
        <div
          className="flex-2 cursor-pointer flex items-center justify-center"
          onClick={togglePlayPause}
          onMouseMove={() => setShowControls(true)}
        >
          {!isPlaying && showControls && (
            <div className="bg-black/50 rounded-full p-6">
              <Play size={48} className="text-white ml-2" />
            </div>
          )}
        </div>

        {/* Right tap area - Next */}
        <div
          className="flex-1 cursor-pointer flex items-center justify-end pr-8"
          onClick={onNext}
        >
          {showControls && currentIndex < totalVideos - 1 && (
            <div className="bg-black/30 rounded-full p-2 opacity-60">
              <ArrowDown size={24} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - YouTube style */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-red-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Right Side Actions - YouTube Shorts style */}
      <div className="absolute right-3 bottom-16 flex flex-col items-center space-y-4">
        {/* User Avatar with Subscribe */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img
              src={video.user.avatar || `https://ui-avatars.com/api/?name=${video.user.name}&background=random`}
              alt={video.user.name}
              className="w-full h-full object-cover"
            />
          </div>
          {user?.id !== video.userId && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          )}
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Heart
              size={28}
              className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
            />
          </button>
          <span className="text-white text-xs font-medium mt-1">{formatNumber(likesCount)}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleShowComments}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <MessageCircle size={28} className="text-white" />
          </button>
          <span className="text-white text-xs font-medium mt-1">{formatNumber(commentsCount)}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center relative">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Share size={28} className="text-white" />
          </button>
          <span className="text-white text-xs font-medium mt-1">Share</span>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute right-full top-0 mr-4 bg-black/90 rounded-lg p-3 min-w-48">
              <div className="space-y-2">
                <button
                  onClick={copyVideoLink}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  📋 Copy Link
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  🐦 Share on Twitter
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  📘 Share on Facebook
                </button>
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  💬 Share on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* More Options */}
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={28} className="text-white" />
        </button>
      </div>

      {/* Bottom Info - YouTube style */}
      <div className="absolute bottom-4 left-4 right-20">
        <div className="space-y-1">
          {/* Username */}
          <div className="flex items-center space-x-2">
            <User size={16} className="text-white" />
            <span className="text-white font-semibold text-sm">@{video.user.name}</span>
          </div>

          {/* Title */}
          <p className="text-white text-sm font-medium line-clamp-2 leading-tight">
            {video.title}
          </p>

          {/* Description */}
          {video.description && (
            <p className="text-white/90 text-sm line-clamp-2 leading-tight">
              {video.description}
            </p>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {video.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-blue-300 text-xs font-medium">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {/* Volume Control */}
          <button
            className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
          </button>

          {/* Video Counter */}
          <div className="bg-black/30 rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium">
              {currentIndex + 1} / {totalVideos}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Hints */}
      {showControls && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <div className="bg-black/30 rounded-lg px-3 py-2">
            <p className="text-white text-xs">
              ↑↓ Navigate • Tap to play/pause
            </p>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 bg-black/80 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl max-h-[70%] flex flex-col">
            {/* Comments Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-black">Comments ({commentsCount})</h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}&background=random`}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-black text-sm">{comment.user.name}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-black text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            {user && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Shorts = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'shorts' | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadVideos();
  }, [viewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Space') {
        e.preventDefault();
        // Space bar handled by video player
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      console.log(`Loading ${viewMode}...`);

      let fetchedVideos: Video[];

      if (viewMode === 'shorts') {
        // Load only shorts
        fetchedVideos = await videoService.getAllShorts();
      } else {
        // Load all videos
        fetchedVideos = await videoService.getAllVideos();
      }

      console.log(`Fetched ${viewMode}:`, fetchedVideos);
      console.log(`Number of ${viewMode}:`, fetchedVideos.length);

      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${viewMode}`);
      console.error(`Failed to load ${viewMode}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(videos.length - 1); // Loop to last
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading {viewMode === 'shorts' ? 'Shorts' : 'Videos'}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadVideos}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-black">
        <div className="text-center">
          <Play size={48} className="text-white mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Videos Available</h2>
          <p className="text-gray-400 mb-6">Upload some videos to get started!</p>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'all'
                ? 'bg-white text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              All Videos
            </button>
            <button
              onClick={() => setViewMode('shorts')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'shorts'
                ? 'bg-white text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              Shorts Only
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-900 flex items-center justify-center">
      {/* Shorts Player Container - Mobile Width */}
      <div
        ref={containerRef}
        className="w-full max-w-md h-full bg-black relative overflow-hidden rounded-lg shadow-2xl"
        onWheel={handleScroll}
      >
        {/* YouTube Shorts Logo - Top Left */}
        <div className="absolute top-4 left-4 z-50">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Shorts</span>
          </div>
        </div>

        {/* Current Video */}
        <div className="w-full h-full">
          <ShortVideoPlayer
            video={videos[currentIndex]}
            isActive={true}
            onVideoEnd={goToNext}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentIndex={currentIndex}
            totalVideos={videos.length}
          />
        </div>



        {/* Navigation Indicators - Left Side */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 max-h-80 overflow-y-auto">
          {videos.map((video, index) => (
            <button
              key={index}
              className={`w-1 h-6 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-white w-2' : 'bg-white/30 hover:bg-white/50'
                }`}
              onClick={() => setCurrentIndex(index)}
              title={video.title}
            />
          ))}
        </div>

        {/* Video Info Overlay - Top Right */}
        <div className="absolute top-4 right-4 z-40 text-right">
          <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
            <p className="text-white text-xs font-medium">
              Video {currentIndex + 1} of {videos.length}
            </p>
            <p className="text-white/70 text-xs">
              {videos[currentIndex]?.isShort ? 'Short' : 'Video'} • {videos[currentIndex]?.visibility}
            </p>

          </div>
        </div>

        {/* Keyboard Instructions - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-40">
          <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
            <p className="text-white/70 text-xs">
              ↑↓ Navigate • Space Play/Pause • Scroll to browse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
