import React, { useState } from 'react';
import { Menu, Search, Bell, Video as VideoIcon, User as UserIcon, Mic, LogOut, Settings, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { NotificationPanel } from './NotificationPanel';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { ChannelSwitcher } from './ChannelSwitcher';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
      logout();
      setShowProfileMenu(false);
      navigate('/login');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
          <Menu size={20} />
        </Button>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            <span className="text-red-500">{settings.site_name}</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4 md:px-8 hidden md:block">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded-l-full px-3 md:px-4 py-2 focus-within:border-blue-500 transition-all">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            variant="secondary" 
            className="rounded-r-full rounded-l-none bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 border-l-0 px-4 md:px-6 py-2 h-10"
          >
            <Search size={18} className="text-zinc-300" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="ml-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hidden lg:flex"
          >
            <Mic size={18} />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-zinc-400"
          onClick={() => setShowMobileSearch(true)}
        >
           <Search size={20} />
        </Button>
        
        {isAuthenticated ? (
            <>
                <div className="hidden lg:block">
                  <ChannelSwitcher />
                </div>
                <Link to="/upload">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="flex items-center justify-center w-10 h-10 text-white hover:text-primary hover:bg-zinc-800 rounded-full transition-all duration-200" 
                        title="Upload Video"
                    >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="12" y1="18" x2="12" y2="12"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                    </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-zinc-400 hover:text-white relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </Button>
                
                <div className="relative ml-2">
                    <img 
                        src={user?.avatar} 
                        alt="Profile" 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-9 h-9 rounded-full border border-white/10 object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
                    />
                    
                    {showProfileMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                            <div className="absolute right-0 top-12 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="px-4 py-4 border-b border-zinc-700 flex items-center gap-3">
                                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-10 h-10 rounded-full" alt="avatar" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-white truncate">{user?.name}</p>
                                        <p className="text-sm text-zinc-400 truncate">{user?.email}</p>
                                        <Link to={`/channel/${user?.id}`} className="text-sm text-blue-400 hover:text-blue-300">
                                          View your channel
                                        </Link>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <Link to={`/channel/${user?.id}`} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <UserIcon size={20} className="text-zinc-400" /> 
                                        <span>Your channel</span>
                                    </Link>
                                    <Link to="/studio" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <LayoutDashboard size={20} className="text-zinc-400" /> 
                                        <span>NebulaStream Studio</span>
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors border-l-2 border-red-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold">Admin Panel</span>
                                        </Link>
                                    )}
                                    <Link to="/subscriptions" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <Bell size={20} className="text-zinc-400" /> 
                                        <span>Switch account</span>
                                    </Link>
                                </div>
                                <div className="border-t border-zinc-700" />
                                <div className="py-2">
                                    <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <Settings size={20} className="text-zinc-400" /> 
                                        <span>Settings</span>
                                    </Link>
                                    <Link to="/help" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        <span>Help</span>
                                    </Link>
                                    <Link to="/feedback" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                                        <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                        <span>Send feedback</span>
                                    </Link>
                                </div>
                                <div className="border-t border-zinc-700" />
                                <div className="py-2">
                                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 w-full text-left transition-colors">
                                        <LogOut size={20} className="text-zinc-400" /> 
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </>
        ) : (
             <Link to="/login">
                <Button variant="outline" className="gap-2 rounded-full border-zinc-700 text-primary hover:text-primary-hover hover:border-primary/50 hover:bg-primary/5">
                    <UserIcon size={18} />
                    <span className="hidden md:inline">Sign In</span>
                </Button>
             </Link>
        )}
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="bg-background border-b border-white/10 p-4">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={() => setShowMobileSearch(false)}
                className="text-zinc-400"
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 focus-within:border-blue-500 transition-all">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-zinc-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="text-zinc-400"
              >
                <Search size={20} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
};