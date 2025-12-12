import React, { useEffect, useState } from 'react';
import { Download, Trash2, Play, MoreVertical } from 'lucide-react';
import { downloadService } from '../services/downloadService';
import { videoService, Video } from '../services/videoService';
import { useNavigate } from 'react-router-dom';

export const Downloads: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await downloadService.getDownloads();
      console.log('Downloads loaded:', data);
      setVideos(data);
    } catch (err: any) {
      console.error('Failed to load downloads:', err);
      setError(err.message || 'Failed to load downloads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadService.removeDownload(videoId);
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove download');
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const handleDownloadAgain = async (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadService.downloadVideo(video.id, video.title);
    } catch (err: any) {
      alert('Failed to download: ' + err.message);
    }
  };

  const formatViews = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M views';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K views';
    return count + ' views';
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex gap-6">
            <div className="w-[400px] shrink-0">
              <div className="bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-zinc-800"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-48 aspect-video bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadDownloads}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Download className="text-zinc-600" size={64} />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No downloads yet</h2>
            <p className="text-zinc-400 mb-6 text-center max-w-md">
              Videos you download will appear here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
            >
              Browse Videos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Playlist Info Panel */}
          <div className="lg:w-[400px] shrink-0">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl overflow-hidden sticky top-6">
              <div className="relative aspect-video bg-zinc-800 group cursor-pointer" onClick={() => videos[0] && handleVideoClick(videos[0].id)}>
                {videos[0]?.thumbnail ? (
                  <img
                    src={videoService.getThumbnailUrl(videos[0].id)}
                    alt={videos[0].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={48} className="text-zinc-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="bg-black/80 rounded-full p-4">
                    <Download size={32} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="text-green-500" size={24} />
                  <h1 className="text-2xl font-bold text-white">Downloads</h1>
                </div>
                <p className="text-zinc-400 text-sm mb-4">
                  {videos.length} video{videos.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Videos List */}
          <div className="flex-1">
            <div className="space-y-3">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex gap-4 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="flex items-start pt-2">
                    <span className="text-zinc-500 font-medium w-6 text-center">{index + 1}</span>
                  </div>

                  <div className="relative w-48 aspect-video bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                    {video.thumbnail ? (
                      <img
                        src={videoService.getThumbnailUrl(video.id)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={32} className="text-zinc-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span>{video.user?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatViews(video.viewsCount)}</span>
                      <span>•</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    {video.description && (
                      <p className="text-sm text-zinc-500 line-clamp-1 mt-2">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDownloadAgain(video, e)}
                      className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                      title="Download again"
                    >
                      <Download size={18} className="text-zinc-400 hover:text-green-500" />
                    </button>
                    <button
                      onClick={(e) => handleRemove(video.id, e)}
                      className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                      title="Remove from downloads"
                    >
                      <Trash2 size={18} className="text-zinc-400 hover:text-red-500" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                      title="More options"
                    >
                      <MoreVertical size={18} className="text-zinc-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
