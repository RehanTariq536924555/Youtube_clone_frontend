import React from 'react';

interface YouTubeAuthLayoutProps {
  children: React.ReactNode;
}

export const YouTubeAuthLayout: React.FC<YouTubeAuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* YouTube-style header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center mr-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-xl font-normal text-gray-700">NebulaStream</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* YouTube-style footer */}
      <footer className="border-t border-gray-200 px-6 py-4 mt-auto">
        <div className="flex justify-center space-x-6 text-xs text-gray-500">
          <select className="bg-transparent border-none text-gray-500 text-xs">
            <option>English (US)</option>
            <option>Español</option>
            <option>Français</option>
            <option>Deutsch</option>
          </select>
        </div>
        <div className="flex justify-center space-x-6 text-xs text-gray-500 mt-2">
          <a href="#" className="hover:text-gray-700">Help</a>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
        </div>
      </footer>
    </div>
  );
};