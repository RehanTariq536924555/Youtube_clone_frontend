import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Trash2, Play, MoreVertical, Calendar, Search, X, Clock, CheckCircle2 } from 'lucide-react';
import { videoService, Video } from '../services/videoService';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000';

interface HistoryItem {
  id: string;
  videoId: string;
  watchTime: number;
  completed: boolean;
  createdAt: Date;
  video: Video;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'shorts'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [searchQuery, selectedDate, history, activeFilter]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('auth_token');
      console.log('Loading history with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('You must be logged in to view history');
      }

      console.log('Fetching history from:', `${API_BASE_URL}/views/history`);
      const response = await fetch(`${API_BASE_URL}/views/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('History response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('History error response:', errorText);
        throw new Error(`Failed to load history: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('History loaded successfully:', data.length, 'items');
      console.log('First history item:', data[0]);
      setHistory(data);
      setFilteredHistory(data);
    } catch (err: any) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // Filter by content type
    if (activeFilter === 'shorts') {
      filtered = filtered.filter(item => item.video.isShort);
    } else if (activeFilter === 'videos') {
      filtered = filtered.filter(item => !item.video.isShort);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.video.title.toLowerCase().includes(query) ||
        item.video.user?.name.toLowerCase().includes(query)
      );
    }

    // Filter by date
    if (selectedDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const viewDate = new Date(item.createdAt);
        const diffDays = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (selectedDate) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredHistory(filtered);
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all watch history? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('You must be logged in to clear history');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/views/history/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear history');
      }

      setHistory([]);
      setFilteredHistory([]);
    } catch (err: any) {
      console.error('Failed to clear history:', err);
      setError(err.message || 'Failed to clear history');
    }
  };

  const handleRemoveItem = async (viewId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('You must be logged in to remove items');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/views/${viewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Remove from local state
      const updatedHistory = history.filter(item => item.id !== viewId);
      setHistory(updatedHistory);
      setFilteredHistory(filteredHistory.filter(item => item.id !== viewId));
    } catch (err: any) {
      console.error('Failed to remove item:', err);
      setError(err.message || 'Failed to remove item');
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const formatViews = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M views';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K views';
    return count + ' views';
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const groupByDate = (items: HistoryItem[]) => {
    const groups: { [key: string]: HistoryItem[] } = {};
    
    items.forEach(item => {
      const date = new Date(item.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    
    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadHistory}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <HistoryIcon className="text-zinc-600" size={64} />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No watch history yet</h2>
            <p className="text-zinc-400 mb-6 text-center max-w-md">
              Videos you watch will appear here
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

  const groupedHistory = groupByDate(filteredHistory);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 px-3 py-4 lg:py-6 border-b lg:border-b-0 lg:border-r border-zinc-800/50">
          <div className="flex lg:flex-col gap-2 lg:space-y-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-zinc-800/80 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <HistoryIcon size={18} className="lg:w-5 lg:h-5" />
              <span className="font-medium text-sm">Watch history</span>
            </button>
            
            <button
              onClick={() => setActiveFilter('videos')}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'videos'
                  ? 'bg-zinc-800/80 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <Play size={18} className="lg:w-5 lg:h-5" />
              <span className="font-medium text-sm">Videos</span>
            </button>
            
            <button
              onClick={() => setActiveFilter('shorts')}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'shorts'
                  ? 'bg-zinc-800/80 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
              </svg>
              <span className="font-medium text-sm">Shorts</span>
            </button>
          </div>

          <div className="hidden lg:block mt-8 pt-6 border-t border-zinc-800/50">
            <button
              onClick={handleClearHistory}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800/40 transition-colors"
            >
              <Trash2 size={20} />
              <span className="font-medium text-sm">Clear all history</span>
            </button>
          </div>

          <div className="hidden lg:block mt-6 space-y-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Filter by date</p>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-zinc-600 outline-none transition-colors"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 md:px-6 lg:px-8 py-4 lg:py-6">
          {/* Header */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {activeFilter === 'all' ? 'Watch history' : activeFilter === 'videos' ? 'Videos' : 'Shorts'}
              </h1>
              
              {/* Mobile Clear Button */}
              <button
                onClick={handleClearHistory}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-zinc-400 hover:bg-zinc-800/40 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search watch history"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-full pl-11 pr-11 py-2.5 text-sm text-white placeholder-zinc-500 focus:bg-zinc-900 focus:border-zinc-700 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p className="text-zinc-400 text-sm mb-4">
              {filteredHistory.length} result{filteredHistory.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="text-zinc-600" size={40} />
              </div>
              <p className="text-zinc-400 text-lg">
                {searchQuery ? 'No videos found' : 'No watch history yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  {/* Date Header - Sticky */}
                  <div className="sticky top-16 z-10 flex items-center gap-3 mb-3 pb-2 border-b border-zinc-800/50 bg-[#0f0f0f] pt-2">
                    <h2 className="text-base font-semibold text-zinc-300">{date}</h2>
                  </div>

                  {/* Videos */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 rounded-xl hover:bg-zinc-900/40 transition-all group cursor-pointer"
                        onClick={() => handleVideoClick(item.videoId)}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full sm:w-40 aspect-video bg-zinc-900 rounded-xl overflow-hidden shrink-0">
                          {item.video.thumbnail ? (
                            <img
                              src={videoService.getThumbnailUrl(item.videoId)}
                              alt={item.video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play size={24} className="text-zinc-700" />
                            </div>
                          )}
                          
                          {/* Duration Badge */}
                          {item.video.duration && (
                            <div className="absolute bottom-1 right-1 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                              {Math.floor(item.video.duration / 60)}:{String(item.video.duration % 60).padStart(2, '0')}
                            </div>
                          )}
                          
                          {/* Watch Progress */}
                          {item.watchTime > 0 && item.video.duration && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/50">
                              <div
                                className="h-full bg-red-600"
                                style={{ width: `${Math.min((item.watchTime / item.video.duration) * 100, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <h3 className="text-white text-sm font-medium line-clamp-2 mb-1 leading-snug">
                            {item.video.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <span className="hover:text-white transition-colors cursor-pointer">
                              {item.video.user?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                            <span>{formatViews(item.video.viewsCount)}</span>
                            <span>•</span>
                            <span>{formatDate(item.video.createdAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:items-start gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleRemoveItem(item.id, e)}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                            title="Remove from watch history"
                          >
                            <X size={16} className="text-zinc-400" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                            title="More options"
                          >
                            <MoreVertical size={16} className="text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
