import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { videoService, Video } from '../services/videoService';
import SearchBar from '../components/SearchBar';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views'>('relevance');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    if (query) {
      searchVideos(query);
    }
  }, [query]);

  const searchVideos = async (searchQuery: string) => {
    setLoading(true);
    try {
      const results = await videoService.searchVideos(searchQuery);
      setVideos(results);
    } catch (error) {
      console.error('Failed to search videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const sortVideos = (videos: Video[], sortType: string): Video[] => {
    const sorted = [...videos];
    switch (sortType) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'views':
        return sorted.sort((a, b) => b.viewsCount - a.viewsCount);
      case 'relevance':
      default:
        return sorted; // Already sorted by relevance from backend
    }
  };

  const filterVideos = (videos: Video[], filterType: string): Video[] => {
    if (filterType === 'all') return videos;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (filterType) {
      case 'today':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return videos;
    }
    
    return videos.filter(video => new Date(video.createdAt) >= cutoffDate);
  };

  const processedVideos = sortVideos(filterVideos(videos, filterBy), sortBy);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 pb-3 border-b border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setSortBy('relevance')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              sortBy === 'relevance'
                ? 'bg-white text-black'
                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Filter size={14} className="inline mr-1" />
            Relevance
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              sortBy === 'date'
                ? 'bg-white text-black'
                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Upload date
          </button>
          <button
            onClick={() => setSortBy('views')}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              sortBy === 'views'
                ? 'bg-white text-black'
                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            View count
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && processedVideos.length === 0 && query && (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto text-zinc-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-zinc-400">
              Try different keywords or remove search filters
            </p>
          </div>
        )}

        {/* Results List */}
        {!loading && processedVideos.length > 0 && (
          <div className="space-y-4">
            {processedVideos.map((video) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-zinc-900/30 p-2 rounded-xl transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-[280px] md:w-[360px] aspect-video bg-zinc-900 rounded-xl overflow-hidden shrink-0">
                  {video.thumbnail ? (
                    <img
                      src={videoService.getThumbnailUrl(video.id)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Search size={32} className="text-zinc-700" />
                    </div>
                  )}
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-white text-base md:text-lg font-medium line-clamp-2 mb-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center text-xs text-zinc-400 mb-2 md:mb-3">
                    <span>{formatViews(video.viewsCount)}</span>
                    <span className="mx-1.5">•</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {video.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs md:text-sm text-zinc-400 hover:text-white transition-colors">
                      {video.user.name}
                    </span>
                  </div>

                  {video.description && (
                    <p className="hidden sm:block text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}

                  {video.tags && video.tags.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-2 mt-3">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded hover:bg-zinc-700 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;