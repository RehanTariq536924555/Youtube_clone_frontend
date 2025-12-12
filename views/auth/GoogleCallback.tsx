import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Loader2 } from 'lucide-react';

export const GoogleCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // For HashRouter, query params are after the hash: /#/auth/callback?token=...
        // We need to parse from window.location.hash instead of window.location.search
        let urlParams: URLSearchParams;
        
        if (window.location.hash.includes('?')) {
          // Extract query string from hash
          const hashParts = window.location.hash.split('?');
          urlParams = new URLSearchParams(hashParts[1]);
        } else {
          // Fallback to regular search (for non-hash router)
          urlParams = new URLSearchParams(window.location.search);
        }
        
        const token = urlParams.get('token');
        const userString = urlParams.get('user');
        const errorMessage = urlParams.get('message');

        console.log('Callback URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);
        console.log('Token:', token);
        console.log('User string:', userString);
        console.log('Error message:', errorMessage);

        if (errorMessage) {
          setError(decodeURIComponent(errorMessage));
          setStatus('error');
          return;
        }

        if (!token || !userString) {
          const debugInfo = `
            Full URL: ${window.location.href}
            Hash: ${window.location.hash}
            Search: ${window.location.search}
            Token: ${token ? 'present' : 'missing'}
            User: ${userString ? 'present' : 'missing'}
          `;
          console.error('Missing auth data:', debugInfo);
          setError(`Missing authentication data. Token: ${token ? 'present' : 'missing'}, User: ${userString ? 'present' : 'missing'}`);
          setStatus('error');
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userString));
        
        // Create user object for the app
        const user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          handle: `@${userData.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: userData.picture || `https://ui-avatars.com/api/?background=random&name=${userData.name}`,
          subscribers: '0',
          googleId: userData.googleId,
          isEmailVerified: userData.isEmailVerified
        };

        console.log('Logging in user:', user);
        console.log('Token:', token);

        // Check if account is locked to a different user
        const locked = authService.isAccountLocked();
        if (locked) {
          const isCorrectAccount = authService.verifyAccountMatch(user);
          if (!isCorrectAccount) {
            setError('You are trying to login with a different Google account. Please logout first or use the same account.');
            setStatus('error');
            return;
          }
        }

        // Store auth data first
        authService.storeAuth(user, token);
        
        // Then update context
        login(user, token);
        
        setStatus('success');
        
        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          console.log('Redirecting to home...');
          navigate('/', { replace: true });
        }, 500);

      } catch (err: any) {
        console.error('Google callback error:', err);
        setError(err.message || 'Failed to process authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [login, navigate]);

  const handleRetry = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full text-center space-y-6">
        {status === 'processing' && (
          <>
            <Loader2 className="animate-spin mx-auto text-blue-500" size={48} />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
              <p className="text-zinc-400">Please wait while we set up your account</p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Welcome to NebulaStream!</h2>
              <p className="text-zinc-400">You've been successfully signed in</p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Authentication Failed</h2>
              <p className="text-zinc-400">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};