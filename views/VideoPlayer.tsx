import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Calendar, User, Eye, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { videoService, Video } from '../services/videoService';
import CommentSection from '../components/CommentSection';
import LikeDislikeButton from '../components/LikeDislikeButton';
import SubscribeButton from '../components/SubscribeButton';
import { LikeableType } from '../services/likeService';
import { WatchLaterButton } from '../components/WatchLaterButton';
import { DownloadButton } from '../components/DownloadButton';

export const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewRecorded, setViewRecorded] = useState(false);

  useEffect(() => {
    // Get current user from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: payload.sub });
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    }

    if (id) {
      loadVideo(id);
    }
  }, [id]);

  useEffect(() => {
    // Record view when video starts playing
    if (video && !viewRecorded && isPlaying) {
      console.log('🎬 Recording view for video:', video.id);
      videoService.recordView(video.id)
        .then(() => {
          console.log('✅ View recorded successfully');
          setViewRecorded(true);
        })
        .catch(err => {
          console.error('❌ Failed to record view:', err);
        });
    }
  }, [video, isPlaying, viewRecorded]);

  const loadVideo = async (videoId: string) => {
    try {
      setLoading(true);
      const fetchedVideo = await videoService.getVideo(videoId);
      setVideo(fetchedVideo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.requestFullscreen();
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M views';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K views';
    }
    return count + ' views';
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      alert('Video URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Video not found</h2>
          <p className="text-zinc-400 mb-6">{error || 'The video you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')} variant="secondary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative">
        <video
          ref={setVideoRef}
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] object-contain bg-black"
          controls
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement).muted)}
        >
          <source src={videoService.getVideoStreamUrl(video.id)} type={video.mimeType} />
          Your browser does not support the video tag.
        </video>

        {/* Back Button Overlay */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            size="sm"
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-xs sm:text-sm"
          >
            <ArrowLeft size={14} sm:size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>

      {/* Video Information */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-8">
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {video.title}
          </h1>

          {/* Video Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 text-zinc-300 text-sm">
              <span>{formatViews(video.viewsCount)}</span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0">
              <LikeDislikeButton
                targetId={video.id}
                targetType={LikeableType.VIDEO}
                initialLikes={video.likesCount}
                initialDislikes={video.dislikesCount}
                currentUserId={currentUser?.id}
              />
              
              <WatchLaterButton videoId={video.id} variant="button" />
              
              <DownloadButton videoId={video.id} videoTitle={video.title} variant="button" />
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors text-sm"
              >
                <Share2 size={14} sm:size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Channel Info and Subscribe */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 p-4 bg-zinc-800 rounded-lg gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-medium">
                {video.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">{video.user.name}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">
                  {video.user.subscribersCount} subscribers
                </p>
              </div>
            </div>
            
            <SubscribeButton
              channelId={video.userId}
              channelName={video.user.name}
              subscribersCount={video.user.subscribersCount}
              currentUserId={currentUser?.id}
            />
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {video.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Details */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Video Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-zinc-300">
                  <User size={16} className="text-zinc-500" />
                  <span>Uploaded by <strong>{video.user.name}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar size={16} className="text-zinc-500" />
                  <span>Published on {formatDate(video.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Eye size={16} className="text-zinc-500" />
                  <span>File size: {formatFileSize(video.size)}</span>
                </div>
              </div>
            </div>

            {/* Video Properties */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Properties</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Visibility</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    video.visibility === 'public' 
                      ? 'bg-green-900/30 text-green-400' 
                      : video.visibility === 'unlisted'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {video.visibility}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Format</span>
                  <span className="text-zinc-300">{video.mimeType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Original Name</span>
                  <span className="text-zinc-300 truncate ml-4">{video.originalName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          {video.thumbnail && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Thumbnail</h3>
              <img 
                src={videoService.getThumbnailUrl(video.id)} 
                alt="Video thumbnail"
                className="w-48 h-auto rounded-lg border border-zinc-700"
              />
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection
            videoId={video.id}
            currentUserId={currentUser?.id}
          />
        </div>
      </div>
    </div>
  );
};