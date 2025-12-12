import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { videoService, Video } from '../services/videoService';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search videos...',
  showSuggestions = true
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Video[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() && showSuggestions) {
        fetchSuggestions(query.trim());
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, showSuggestions]);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const results = await videoService.searchVideos(searchQuery);
      setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestionsList(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestionsList(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSuggestionClick = (video: Video) => {
    setQuery('');
    setShowSuggestionsList(false);
    navigate(`/video/${video.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
  };

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

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestionsList(true);
              }
            }}
            placeholder={placeholder}
            className="w-full pl-4 pr-20 py-3 bg-white border-2 border-purple-200 rounded-full text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-purple-50 transition-all duration-200 hover:border-purple-300 shadow-sm"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 p-1 text-purple-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <X size={16} />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-purple-300 disabled:to-pink-300 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Search size={16} />
          </button>
        </div>
      </form>

      {showSuggestionsList && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto backdrop-blur-sm">
          {loading && (
            <div className="p-4 text-center text-purple-500">
              Searching...
            </div>
          )}
          
          {suggestions.map((video) => (
            <div
              key={video.id}
              onClick={() => handleSuggestionClick(video)}
              className="flex items-center p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer border-b border-purple-100 last:border-b-0 transition-all duration-200"
            >
              <div className="relative w-20 h-12 bg-purple-100 rounded flex-shrink-0 mr-3">
                {video.thumbnail ? (
                  <img
                    src={videoService.getThumbnailUrl(video.id)}
                    alt={video.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-400">
                    <Search size={16} />
                  </div>
                )}
                {video.duration && (
                  <span className="absolute bottom-1 right-1 bg-purple-600 bg-opacity-90 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-purple-900 truncate">
                  {video.title}
                </h4>
                <p className="text-xs text-purple-600 truncate">
                  {video.user.name}
                </p>
                <p className="text-xs text-purple-500">
                  {formatViews(video.viewsCount)} • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;