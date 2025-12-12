import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChannelProvider } from './context/ChannelContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Home } from './views/Home';
import { Shorts } from './views/Shorts';
import { Trending } from './views/Trending';
import { Explore } from './views/Explore';
import { Channel } from './views/Channel';
import { Upload } from './views/Upload';
import { Studio } from './views/Studio';
import { Auth } from './views/Auth';
import { Videos } from './views/Videos';
import { MyVideos } from './views/MyVideos';
import MyChannels from './views/MyChannels';
import { VideoPlayer } from './views/VideoPlayer';
import { ResetPassword } from './views/auth/ResetPassword';
import { GoogleCallback } from './views/auth/GoogleCallback';
import { AuthError } from './views/auth/AuthError';
import SearchResults from './views/SearchResults';
import Subscriptions from './views/Subscriptions';
import { WatchLater } from './views/WatchLater';
import { Downloads } from './views/Downloads';
import { History } from './views/History';
import { LikedVideos } from './views/LikedVideos';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const isWatchPage = location.pathname.startsWith('/watch');
  const isStudioPage = location.pathname.startsWith('/studio');
  const isUploadPage = location.pathname.startsWith('/upload');
  const isVideoPlayerPage = location.pathname.startsWith('/video/');
  const isResetPasswordPage = location.pathname.startsWith('/reset');
  const isAuthCallbackPage = location.pathname.startsWith('/auth/callback');
  const isAuthErrorPage = location.pathname.startsWith('/auth/error');
  const isAdminPage = location.pathname.startsWith('/admin');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Admin pages bypass the regular layout
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Show auth page if user is not logged in (except for reset password, callback, and error pages)
  if (!user && !isResetPasswordPage && !isAuthCallbackPage && !isAuthErrorPage) {
    return <Auth />;
  }

  // Studio has its own layout structure handled entirely within the component
  if (isStudioPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-zinc-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex pt-16 h-[calc(100vh)] overflow-hidden">
        {/* Sidebar Logic:
            - Watch/Upload pages: Sidebar usually hidden or overlay, for simplicity we hide it or keep it separate.
            - Standard pages: Sidebar visible (responsive).
        */}
        {!isWatchPage && !isUploadPage && !isVideoPlayerPage && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${!isWatchPage && !isUploadPage && !isVideoPlayerPage
            ? (isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0')
            : ''
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ChannelProvider>
        <HashRouter>
          <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/my-videos" element={<MyVideos />} />
            <Route path="/my-channels" element={<MyChannels />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<GoogleCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<div className="p-8 text-center text-zinc-500">Library Implementation Placeholder</div>} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/music" element={<div className="p-8 text-center text-zinc-500">Music Implementation Placeholder</div>} />
            <Route path="/gaming" element={<div className="p-8 text-center text-zinc-500">Gaming Implementation Placeholder</div>} />
            <Route path="/sports" element={<div className="p-8 text-center text-zinc-500">Sports Implementation Placeholder</div>} />
            <Route path="/movies" element={<div className="p-8 text-center text-zinc-500">Movies Implementation Placeholder</div>} />
            <Route path="/live" element={<div className="p-8 text-center text-zinc-500">Live Implementation Placeholder</div>} />
            <Route path="/learning" element={<div className="p-8 text-center text-zinc-500">Learning Implementation Placeholder</div>} />
            <Route path="/fashion" element={<div className="p-8 text-center text-zinc-500">Fashion Implementation Placeholder</div>} />
            <Route path="/podcasts" element={<div className="p-8 text-center text-zinc-500">Podcasts Implementation Placeholder</div>} />
            <Route path="/settings" element={<div className="p-8 text-center text-zinc-500">Settings Implementation Placeholder</div>} />
            <Route path="/help" element={<div className="p-8 text-center text-zinc-500">Help Implementation Placeholder</div>} />
            <Route path="/feedback" element={<div className="p-8 text-center text-zinc-500">Feedback Implementation Placeholder</div>} />
            <Route path="/report" element={<div className="p-8 text-center text-zinc-500">Report Implementation Placeholder</div>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </Layout>
      </HashRouter>
      </ChannelProvider>
    </AuthProvider>
  );
};

// Admin Routes Component
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminLogin } from './views/admin/AdminLogin';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { UserManagement } from './views/admin/UserManagement';
import { VideoManagement } from './views/admin/VideoManagement';
import { CommentModeration } from './views/admin/CommentModeration';
import ChannelManagement from './views/admin/ChannelManagement';
import { Analytics } from './views/admin/Analytics';
import { Settings } from './views/admin/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="videos" element={<VideoManagement />} />
        <Route path="comments" element={<CommentModeration />} />
        <Route path="channels" element={<ChannelManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;