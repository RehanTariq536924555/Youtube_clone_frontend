import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward } from 'lucide-react';
import { Video, videoService } from '../services/videoService';

interface MiniPlayerProps {
  video: Video;
  isVisible: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  video,
  isVisible,
  onClose,
  onExpand
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateProgress = () => {
      const current = videoElement.currentTime;
      const total = videoElement.duration;
      setProgress((current / total) * 100);
      setDuration(total);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden">
      {/* Video */}
      <div className="relative aspect-video bg-black cursor-pointer" onClick={onExpand}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoService.getVideoStreamUrl(video.id)}
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white ml-1" />
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X size={16} className="text-white" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-red-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white truncate flex-1 mr-2">
            {video.title}
          </h3>
          <button
            onClick={onExpand}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
          >
            <Maximize2 size={16} className="text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              {isPlaying ? (
                <Pause size={16} className="text-white" />
              ) : (
                <Play size={16} className="text-white" />
              )}
            </button>
            
            <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
              <SkipBack size={16} className="text-zinc-400" />
            </button>
            
            <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
              <SkipForward size={16} className="text-zinc-400" />
            </button>
            
            <button
              onClick={toggleMute}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              {isMuted ? (
                <VolumeX size={16} className="text-zinc-400" />
              ) : (
                <Volume2 size={16} className="text-white" />
              )}
            </button>
          </div>

          <div className="text-xs text-zinc-400">
            {formatTime(duration * (progress / 100))} / {formatTime(duration)}
          </div>
        </div>

        <div className="text-xs text-zinc-500 mt-1">
          {video.user.name}
        </div>
      </div>
    </div>
  );
};