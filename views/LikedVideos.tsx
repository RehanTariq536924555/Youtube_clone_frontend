import React, { useState, useEffect } from 'react';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { playlistService, Playlist } from '../services/playlistService';
import { RealVideoCard } from '../components/RealVideoCard';

export const LikedVideos = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all user playlists
      const playlists = await playlistService.getMyPlaylists();
      
      // Find the "Liked Videos" system playlist
      const likedPlaylist = playlists.find(
        p => p.isSystemPlaylist && p.systemPlaylistType === 'liked_videos'
      );

      if (likedPlaylist) {
        // Fetch full playlist with videos
        const fullPlaylist = await playlistService.getPlaylist(likedPlaylist.id);
        setPlaylist(fullPlaylist);
      } else {
        // No liked videos yet
        setPlaylist(null);
      }
    } catch (err: any) {
      console.error('Error loading liked videos:', err);
      setError(err.message || 'Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const videos = playlist?.playlistVideos?.map(pv => pv.video).filter(Boolean) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <ThumbsUp size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Liked Videos</h1>
            <p className="text-gray-400 mt-1">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </p>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-16">
          <ThumbsUp size={64} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No liked videos yet</h2>
          <p className="text-gray-500">
            Videos you like will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video: any) => (
            <RealVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
