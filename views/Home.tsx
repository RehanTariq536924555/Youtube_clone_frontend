import React, { useState, useEffect } from 'react';
import { RealVideoCard } from '../components/RealVideoCard';
import { Button } from '../components/ui/Button';
import { videoService, Video } from '../services/videoService';
import { Filter, Play, TrendingUp, Upload, Video as VideoIcon, RefreshCw } from 'lucide-react';


const CATEGORIES = ['All', 'My Uploads', 'Trending', 'Gaming', 'Music', 'Tech', 'Live', 'AI', 'Podcasts', 'News', 'Sports', 'Learning'];

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
    loadTrendingVideos();
    loadMyVideos();
  }, []);

  useEffect(() => {
    if (activeCategory !== 'All' && activeCategory !== 'Trending' && activeCategory !== 'My Uploads') {
      loadVideosByCategory(activeCategory);
    }
  }, [activeCategory]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await videoService.getAllVideos();
      setVideos(fetchedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingVideos = async () => {
    try {
      const trending = await videoService.getTrendingVideos();
      setTrendingVideos(trending);
    } catch (err) {
      console.error('Failed to load trending videos:', err);
    }
  };

  const loadMyVideos = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token, skipping my videos load');
        setMyVideos([]);
        return;
      }
      console.log('Loading my videos...');
      const myUploads = await videoService.getMyVideos();
      console.log('My videos loaded:', myUploads);
      setMyVideos(myUploads || []);
      console.log('Total my videos:', myUploads?.length || 0);
    } catch (err) {
      console.error('Failed to load my videos:', err);
    }
  };

  const loadVideosByCategory = async (category: string) => {
    try {
      setLoading(true);
      const categoryVideos = await videoService.getVideosByCategory(category.toLowerCase());
      setVideos(categoryVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentVideos = (): Video[] => {
    if (activeCategory === 'My Uploads') {
      return myVideos;
    } else if (activeCategory === 'Trending') {
      return trendingVideos;
    } else if (activeCategory === 'All') {
      return videos;
    } else {
      return videos; // Category-filtered videos are already loaded
    }
  };

  const currentVideos = getCurrentVideos();

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={loadVideos} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Category Pills - Sticky */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <div className="shrink-0 p-2 bg-zinc-900/80 rounded-lg mr-1 hover:bg-zinc-800 transition-colors">
              <Filter size={14} sm:size={16} className="text-zinc-400" />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 sm:gap-2 ${
                  activeCategory === cat
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat === 'Trending' && <TrendingUp size={12} sm:size={14} />}
                {cat === 'My Uploads' && <VideoIcon size={12} sm:size={14} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

        {currentVideos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              {activeCategory === 'My Uploads' ? (
                <Upload size={48} className="text-zinc-600" />
              ) : (
                <Play size={48} className="text-zinc-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">
              {activeCategory === 'My Uploads' ? 'No uploads yet' : 'No videos yet'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {activeCategory === 'My Uploads' 
                ? 'Upload your first video to get started!' 
                : 'Be the first to upload a video!'}
            </p>
            <Button onClick={() => window.location.href = '/#/upload'} className="px-6 py-3 flex items-center gap-2 mx-auto">
              <Upload size={20} />
              Upload Video
            </Button>
          </div>
        ) : (
          <>
            {/* Featured/Trending Section */}
            {activeCategory === 'All' && trendingVideos.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-red-500" size={24} />
                    Trending Now
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {trendingVideos.slice(0, 3).map((video) => (
                    <div key={video.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                      <RealVideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Video Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${
                    activeCategory === 'My Uploads' ? 'bg-purple-500' :
                    activeCategory === 'Trending' ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`}></div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {activeCategory === 'My Uploads' && <VideoIcon size={24} className="text-purple-500" />}
                    {activeCategory === 'Trending' && <TrendingUp size={24} className="text-red-500" />}
                    {activeCategory === 'Trending' ? 'Trending Videos' : 
                     activeCategory === 'All' ? 'Recommended' : 
                     activeCategory === 'My Uploads' ? 'My Uploads' :
                     activeCategory}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-500">
                    {currentVideos.length} video{currentVideos.length !== 1 ? 's' : ''}
                  </span>
                  {activeCategory === 'My Uploads' && (
                    <button
                      onClick={loadMyVideos}
                      className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                      title="Refresh my videos"
                    >
                      <RefreshCw size={18} className="text-zinc-400 hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
                {currentVideos.map((video) => (
                  <div key={video.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                    <RealVideoCard video={video} layout="grid" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
