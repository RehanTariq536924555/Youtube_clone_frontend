import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  Download, 
  User, 
  Settings, 
  HelpCircle,
  Flag,
  MessageSquare,
  TrendingUp,
  Music,
  Gamepad2,
  Trophy,
  Lightbulb,
  Shirt,
  Podcast,
  Radio,
  Film,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const mainItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: PlaySquare, label: 'Shorts', path: '/shorts' },
    { icon: Radio, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const libraryItems = isAuthenticated ? [
    { icon: User, label: 'My Channels', path: '/my-channels' },
    { icon: PlaySquare, label: 'Your videos', path: '/my-videos' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked videos', path: '/liked' },
    { icon: Download, label: 'Downloads', path: '/downloads' },
  ] : [];

  const exploreItems = [
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Music, label: 'Music', path: '/music' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Trophy, label: 'Sports', path: '/sports' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Zap, label: 'Live', path: '/live' },
    { icon: Lightbulb, label: 'Learning', path: '/learning' },
    { icon: Shirt, label: 'Fashion', path: '/fashion' },
    { icon: Podcast, label: 'Podcasts', path: '/podcasts' },
  ];

  const moreItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Flag, label: 'Report history', path: '/report' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: MessageSquare, label: 'Send feedback', path: '/feedback' },
  ];

  const SidebarItem: React.FC<{
    icon: React.ComponentType<any>;
    label: string;
    path: string;
    onClick?: () => void;
  }> = ({ icon: Icon, label, path, onClick }) => (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-6 px-3 py-2 rounded-lg transition-colors hover:bg-white/10 ${
        isActive(path) ? 'bg-white/10 text-white' : 'text-zinc-300'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  const SidebarSection: React.FC<{
    title?: string;
    items: Array<{ icon: React.ComponentType<any>; label: string; path: string }>;
  }> = ({ title, items }) => (
    <div className="py-2">
      {title && (
        <h3 className="px-3 py-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r border-white/10 z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]`}
      >
        <div className="p-3 space-y-2">
          {/* Main Navigation */}
          <SidebarSection items={mainItems} />

          {/* Divider */}
          <div className="border-t border-white/10 my-3" />

          {/* Library Section */}
          {isAuthenticated && (
            <>
              <SidebarSection title="Library" items={libraryItems} />
              <div className="border-t border-white/10 my-3" />
            </>
          )}

          {/* Explore Section */}
          <SidebarSection title="Explore" items={exploreItems} />

          {/* Divider */}
          <div className="border-t border-white/10 my-3" />

          {/* More Section */}
          <SidebarSection title="More from NebulaStream" items={moreItems} />

          {/* User Info */}
          {isAuthenticated && user && (
            <>
              <div className="border-t border-white/10 my-3" />
              <div className="px-3 py-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-3 py-4 text-xs text-zinc-500 space-y-2">
            <div className="space-x-2">
              <a href="#" className="hover:text-zinc-300">About</a>
              <a href="#" className="hover:text-zinc-300">Press</a>
              <a href="#" className="hover:text-zinc-300">Copyright</a>
            </div>
            <div className="space-x-2">
              <a href="#" className="hover:text-zinc-300">Contact us</a>
              <a href="#" className="hover:text-zinc-300">Creators</a>
              <a href="#" className="hover:text-zinc-300">Advertise</a>
            </div>
            <div className="space-x-2">
              <a href="#" className="hover:text-zinc-300">Developers</a>
              <a href="#" className="hover:text-zinc-300">Terms</a>
              <a href="#" className="hover:text-zinc-300">Privacy</a>
            </div>
            <p className="pt-2 text-zinc-600">© 2024 NebulaStream</p>
          </div>
        </div>
      </div>
    </>
  );
};