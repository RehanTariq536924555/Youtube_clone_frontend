import React, { useState, useEffect } from 'react';
import { RealVideoCard } from '../components/RealVideoCard';
import { videoService, Video } from '../services/videoService';
import { 
  TrendingUp, 
  Music, 
  Gamepad2, 
  Trophy, 
  Film, 
  Zap, 
  Lightbulb,
  Shirt,
  Podcast,
  Compass,
  Play,
  Eye,
  Clock
} from 'lucide-react';

const EXPLORE_SECTIONS = [
  {
    id: 'trending',
    title: 'Trending',
    icon: TrendingUp,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'music',
    title: 'Music',
    icon: Music,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'gaming',
    title: 'Gaming',
    icon: Gamepad2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'sports',
    title: 'Sports',
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    id: 'movies',
    title: 'Movies & TV',
    icon: Film,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'live',
    title: 'Live',
    icon: Zap,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
  },
  {
    id: 'learning',
    title: 'Learning',
    icon: Lightbulb,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'fashion',
    title: 'Fashion & Beauty',
    icon: Shirt,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    icon: Podcast,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
];

export const Explore = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExploreContent();
  }, []);

  const loadExploreContent = async () => {
    try {
      setLoading(true);
      const [allVideos, trending] = await Promise.all([
        videoService.getAllVideos(),
        videoService.getTrendingVideos()
      ]);
      
      setVideos(allVideos);
      setTrendingVideos(trending);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load explore content');
    } finally {
      setLoading(false);
    }
  };

  const getVideosByCategory = (categoryId: string) => {
    if (categoryId === 'trending') return trendingVideos.slice(0, 4);
    return videos.filter(video => 
      video.category?.toLowerCase() === categoryId || 
      video.tags?.some(tag => tag.toLowerCase().includes(categoryId))
    ).slice(0, 4);
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
            onClick={loadExploreContent}
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
          <Compass className="text-blue-500" size={32} />
          Explore
        </h1>
        <p className="text-zinc-400">
          Discover new content across different categories
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
        {EXPLORE_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className={`${section.bgColor} rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`${section.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-white font-semibold text-sm">{section.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Trending Section */}
      {trendingVideos.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingVideos.slice(0, 8).map((video) => (
              <RealVideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Category Sections */}
      {EXPLORE_SECTIONS.map((section) => {
        const categoryVideos = getVideosByCategory(section.id);
        if (categoryVideos.length === 0) return null;

        const Icon = section.icon;
        return (
          <div key={section.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Icon className={section.color} size={24} />
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              <button className="ml-auto text-blue-400 hover:text-blue-300 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryVideos.map((video) => (
                <RealVideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Stats Section */}
      <div className="bg-zinc-900 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Platform Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-3">
              <Play className="text-blue-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{videos.length}</div>
            <div className="text-zinc-400">Total Videos</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-3">
              <Eye className="text-green-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">
              {videos.reduce((sum, video) => sum + video.viewsCount, 0).toLocaleString()}
            </div>
            <div className="text-zinc-400">Total Views</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-3">
              <Clock className="text-purple-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-zinc-400">Always Online</div>
          </div>
        </div>
      </div>
    </div>
  );
};