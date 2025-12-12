import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Edit, Trash2, Calendar, Eye, MoreVertical } from 'lucide-react';
import { videoService, Video } from '../services/videoService';
import { Button } from '../components/ui/Button';

export const MyVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadMyVideos();
  }, []);

  const loadMyVideos = async () => {
    try {
      setLoading(true);
      console.log('Loading my videos...');
      const fetchedVideos = await videoService.getMyVideos();
      console.log('My videos loaded:', fetchedVideos);
      console.log('Total videos:', fetchedVideos.length);
      setVideos(fetchedVideos);
    } catch (err) {
      console.error('Error loading my videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your videos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(videoId);
      await videoService.deleteVideo(videoId);
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={loadMyVideos}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Videos</h1>
        <p className="text-zinc-400">{videos.length} videos</p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={32} className="text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No videos uploaded yet</h2>
          <p className="text-zinc-500 mb-6">Start sharing your content with the world!</p>
          <Button onClick={() => window.location.href = '/upload'}>
            Upload Your First Video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group relative">
              {/* Video Thumbnail/Preview */}
              <div 
                className="aspect-video bg-black relative flex items-center justify-center group-hover:bg-zinc-900 transition-colors cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <video 
                  className="w-full h-full object-cover"
                  poster={video.thumbnail}
                  preload="metadata"
                >
                  <source src={videoService.getVideoStreamUrl(video.id)} type={video.mimeType} />
                </video>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                </div>
                
                {/* Action Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-black/50 rounded-lg p-1 flex gap-1">
                    <button 
                      className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      title="Edit video"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                    >
                      <Edit size={14} className="text-white" />
                    </button>
                    <button 
                      className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                      title="Delete video"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video.id);
                      }}
                      disabled={deletingId === video.id}
                    >
                      {deletingId === video.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border border-white border-t-transparent"></div>
                      ) : (
                        <Trash2 size={14} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                
                {video.description && (
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{formatFileSize(video.size)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    video.visibility === 'public' 
                      ? 'bg-green-900/30 text-green-400' 
                      : video.visibility === 'unlisted'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {video.visibility}
                  </span>
                  
                  <div className="text-xs text-zinc-500">
                    {video.originalName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};