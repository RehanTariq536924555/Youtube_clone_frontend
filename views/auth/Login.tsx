import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

type AuthStep = 'email' | 'password' | 'loading';

export const Login: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleEmailNext = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    // YouTube-style email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError('Enter a valid email');
      return;
    }
    
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Use the same authentication method for both dev and production
      const result = await authService.authenticateWithCredentials(email, password);
      authService.storeAuth(result.user, result.token);
      login(result.user, result.token);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleEmailNext();
      } else if (step === 'password') {
        handlePasswordSubmit();
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Beautiful Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Logo and Brand - Compact */}
          <div className="text-center pt-6 pb-4 px-6">
            <div className="flex items-center justify-center mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome to <span className="text-red-600">NebulaStream</span>
            </h1>
            <p className="text-sm text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Content Area */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <div className="space-y-3">
                {/* Google Sign-In Button */}
                <button
                  onClick={() => authService.googleAuthRedirect()}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-gray-700 font-medium group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">Continue with Google</span>
                </button>

                {/* Info Text */}
                <p className="text-center text-xs text-gray-500 pt-1">
                  🔒 Secure authentication powered by Google
                </p>
              </div>
            )}

        {/* Password Step - Exactly like YouTube */}
        {step === 'password' && (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-900">{email}</span>
                </div>
              </div>
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base text-black"
                autoFocus
              />
              <p className="text-xs text-gray-600 mt-2">
                <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
              </p>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Show password
              </label>
              
              <button
                onClick={handlePasswordSubmit}
                disabled={!password || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? 'Signing in...' : 'Next'}
              </button>
            </div>
          </div>
        )}

          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-red-600 transition-colors">Help</a>
              <span>•</span>
              <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};