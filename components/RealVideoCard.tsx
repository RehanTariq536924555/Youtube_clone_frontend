import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, videoService } from '../services/videoService';
import { MoreVertical, CheckCircle2, Play, Calendar, User, Eye, ThumbsUp } from 'lucide-react';
import { WatchLaterButton } from './WatchLaterButton';

interface RealVideoCardProps {
  video: Video;
  layout?: 'grid' | 'list';
}

export const RealVideoCard: React.FC<RealVideoCardProps> = ({ video, layout = 'grid' }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
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

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    navigate(`/video/${video.id}`);
  };

  if (layout === 'list') {
    return (
      <div className="flex gap-3 sm:gap-4 group cursor-pointer p-2 rounded-xl hover:bg-zinc-900/50 transition-colors" onClick={handleClick}>
        <div className="relative shrink-0 w-32 sm:w-40 md:w-64 aspect-video rounded-xl overflow-hidden bg-zinc-800">
          {video.thumbnail ? (
            <img 
              src={videoService.getThumbnailUrl(video.id)} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <Play size={24} className="text-zinc-500" />
          </div>
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </span>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="flex flex-col flex-1 py-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm md:text-base font-semibold text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 flex-1">
              {video.title}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded-full transition-all shrink-0 hidden sm:block">
              <MoreVertical size={16} className="text-zinc-400" />
            </button>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs text-zinc-400 flex items-center gap-1">
              <User size={12} />
              {video.user.name}
              <CheckCircle2 size={12} className="text-zinc-500" />
            </div>
            <div className="text-xs text-zinc-500 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{formatViews(video.viewsCount)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{video.likesCount}</span>
              </div>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
          {video.description && (
            <p className="text-xs text-zinc-500 mt-2 line-clamp-1 hidden md:block">{video.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer flex flex-col gap-3" onClick={handleClick}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
        {video.thumbnail ? (
          <img 
            src={videoService.getThumbnailUrl(video.id)} 
            alt={video.title} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <Play size={32} className="text-zinc-500" />
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <WatchLaterButton videoId={video.id} size="sm" />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Play size={20} className="text-white ml-1" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 sm:gap-3 px-1">
        <div className="shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {video.user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {video.title}
          </h3>
          <div className="text-xs sm:text-sm text-zinc-400 hover:text-white mt-1 flex items-center gap-1">
            <span className="truncate">{video.user.name}</span>
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-sm text-zinc-500 flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{formatViews(video.viewsCount)}</span>
            </div>
            <span>•</span>
            <span className="truncate">{formatDate(video.createdAt)}</span>
          </div>
          <div className={`mt-1 px-2 py-1 rounded-full text-xs w-fit ${
            video.visibility === 'public' 
              ? 'bg-green-900/30 text-green-400' 
              : video.visibility === 'unlisted'
              ? 'bg-yellow-900/30 text-yellow-400'
              : 'bg-red-900/30 text-red-400'
          }`}>
            {video.visibility}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 -mt-1 p-1 h-fit hover:bg-zinc-800 rounded-full transition-all hidden sm:block">
          <MoreVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-400" />
        </button>
      </div>
    </div>
  );
};