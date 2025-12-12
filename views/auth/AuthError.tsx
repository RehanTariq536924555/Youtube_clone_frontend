import React from 'react';

export const AuthError: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const errorMessage = urlParams.get('message') || 'Authentication failed';

  const handleRetry = () => {
    window.location.href = '/auth';
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Authentication Error</h2>
          <p className="text-zinc-400">{decodeURIComponent(errorMessage)}</p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
            
            <button
              onClick={handleHome}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
          
          <div className="text-xs text-zinc-500 space-y-1">
            <p>If this problem persists, please check:</p>
            <ul className="text-left space-y-1 mt-2">
              <li>• Your internet connection</li>
              <li>• Browser cookies are enabled</li>
              <li>• Pop-ups are not blocked</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};