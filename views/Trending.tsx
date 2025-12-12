import React, { useState, useEffect } from 'react';
import { RealVideoCard } from '../components/RealVideoCard';
import { videoService, Video } from '../services/videoService';
import { TrendingUp, Music, Gamepad2, Trophy, Film, Zap } from 'lucide-react';

const TRENDING_CATEGORIES = [
  { id: 'all', label: 'Now', icon: TrendingUp },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'live', label: 'Live', icon: Zap },
];

export const Trending = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingVideos();
  }, [activeCategory]);

  const loadTrendingVideos = async () => {
    try {
      setLoading(true);
      let fetchedVideos: Video[];
      
      if (activeCategory === 'all') {
        fetchedVideos = await videoService.getTrendingVideos();
      } else {
        fetchedVideos = await videoService.getVideosByCategory(activeCategory);
      }
      
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadTrendingVideos}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="text-red-500" size={32} />
          Trending
        </h1>
        <p className="text-zinc-400">
          See what's trending on NebulaStream right now
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {TRENDING_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp size={64} className="text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No trending videos</h2>
          <p className="text-zinc-400">Check back later for trending content!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <div key={video.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-zinc-900/50 transition-colors">
              <div className="text-2xl font-bold text-zinc-500 w-8 text-center">
                {index + 1}
              </div>
              <div className="flex-1">
                <RealVideoCard video={video} layout="list" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};