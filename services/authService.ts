import { User } from '../types';
import { AUTH_CONFIG } from '../config/auth';

const API_BASE_URL = AUTH_CONFIG.API_BASE_URL;

// API Helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }));

      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:4000');
    }
    throw error;
  }
};

export const authService = {
  // Get API URL
  getApiUrl: () => API_BASE_URL,

  // Google OAuth Authentication (Redirect Flow - like YouTube)
  googleAuthRedirect: () => {
    // Store current location for redirect after auth
    sessionStorage.setItem('auth_redirect_url', window.location.pathname);
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Check if we're in development mode
  isDevelopment: () => {
    return window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('dev');
  },

  // YouTube-style Google Sign-In with One Tap
  initializeGoogleOneTap: (callback: (response: any) => void) => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
        callback: callback,
        auto_select: true, // Auto-select if user has only one account
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: true, // Use FedCM API for better UX
      });

      // Show One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap prompt not displayed');
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap prompt skipped');
        }
      });
    }
  },

  // Mock Google Auth for development/testing (YouTube-style)
  googleAuthMock: async (email?: string, name?: string): Promise<{ user: User; token: string }> => {
    const userEmail = email || 'demo@example.com';
    const userName = name || 'Demo User';

    try {
      const response = await apiCall('/auth/google/mock', {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          picture: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userName)}`
        }),
      });

      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        handle: `@${response.user.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
        avatar: response.user.picture || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(response.user.name)}`,
        subscribers: '0',
        googleId: response.user.googleId,
        isEmailVerified: response.user.isEmailVerified,
        role: response.user.role || 'user'
      };

      return {
        user,
        token: response.access_token,
      };
    } catch (error) {
      throw new Error(`Mock authentication failed: ${error.message}`);
    }
  },

  // Handle callback from Google OAuth redirect
  handleGoogleCallback: (token: string, userString: string): { user: User; token: string } => {
    try {
      const userData = JSON.parse(decodeURIComponent(userString));

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        handle: `@${userData.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
        avatar: userData.picture || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userData.name)}`,
        subscribers: '0',
        googleId: userData.googleId,
        isEmailVerified: userData.isEmailVerified
      };

      return { user, token };
    } catch (error) {
      throw new Error('Failed to parse authentication data');
    }
  },

  // Validate token with backend
  validateToken: async (token: string): Promise<User | null> => {
    try {
      const response = await apiCall('/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.user) {
        return {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          handle: `@${response.user.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
          avatar: response.user.picture || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(response.user.name)}`,
          subscribers: '0',
          googleId: response.user.googleId,
          isEmailVerified: response.user.isEmailVerified,
          role: response.user.role || 'user'
        };
      }
      return null;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('locked_google_id');
    localStorage.removeItem('locked_email');
    sessionStorage.removeItem('auth_redirect_url');
    
    // Clear Google session to prevent auto-login with wrong account
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    window.location.href = '/auth';
  },

  // Get stored auth data
  getStoredAuth: (): { user: User; token: string } | null => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        return { user, token };
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored auth:', error);
      return null;
    }
  },

  // Store auth data with account lock
  storeAuth: (user: User, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    // Lock to this specific account
    if (user.googleId) {
      localStorage.setItem('locked_google_id', user.googleId);
    }
    if (user.email) {
      localStorage.setItem('locked_email', user.email);
    }
  },

  // Check if account is locked to prevent switching
  isAccountLocked: (): { googleId?: string; email?: string } | null => {
    const lockedGoogleId = localStorage.getItem('locked_google_id');
    const lockedEmail = localStorage.getItem('locked_email');
    
    if (lockedGoogleId || lockedEmail) {
      return {
        googleId: lockedGoogleId || undefined,
        email: lockedEmail || undefined
      };
    }
    return null;
  },

  // Verify account matches locked account
  verifyAccountMatch: (user: User): boolean => {
    const locked = authService.isAccountLocked();
    if (!locked) return true;

    // Check if this is the same account
    if (locked.googleId && user.googleId !== locked.googleId) {
      console.warn('Account mismatch detected - different Google account');
      return false;
    }
    if (locked.email && user.email !== locked.email) {
      console.warn('Account mismatch detected - different email');
      return false;
    }
    return true;
  },

  // YouTube-style: Authenticate with email and password
  authenticateWithCredentials: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // In development mode, simulate real authentication with predefined users
    if (authService.isDevelopment()) {
      return authService.mockYouTubeAuth(email, password);
    }

    // Production mode: Real authentication
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.user && response.access_token) {
        const user: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          handle: `@${response.user.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
          avatar: response.user.picture || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(response.user.name)}`,
          subscribers: '0',
          googleId: response.user.googleId,
          isEmailVerified: response.user.isEmailVerified,
          role: response.user.role || 'user'
        };

        return {
          user,
          token: response.access_token,
        };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  },

  // Mock YouTube-style authentication with realistic validation
  mockYouTubeAuth: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate network delay (like real authentication)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Predefined demo users (like YouTube would have)
    const demoUsers = [
      {
        email: 'demo@nebulastream.com',
        password: 'demo123',
        name: 'Demo User',
        id: 'demo-user-1',
        role: 'user'
      },
      {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        id: 'test-user-1',
        role: 'user'
      },
      {
        email: 'user@gmail.com',
        password: 'password',
        name: 'John Doe',
        id: 'john-doe-1',
        role: 'user'
      },
      {
        email: 'admin@nebulastream.com',
        password: 'admin123',
        name: 'Admin User',
        id: 'admin-user-1',
        role: 'admin'
      }
    ];

    // Find matching user
    const matchedUser = demoUsers.find(user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
    );

    if (matchedUser) {
      // Create authenticated user from demo account
      const user: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        handle: `@${matchedUser.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
        avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(matchedUser.name)}`,
        subscribers: '0',
        isEmailVerified: true,
        role: matchedUser.role || 'user'
      };

      const token = `mock-jwt-${Date.now()}-${matchedUser.id}`;
      return { user, token };
    }

    // FLEXIBLE MODE: Allow any email with simple passwords for easy testing
    if (password === 'demo' || password === 'test' || password === '123' || password === 'password') {
      const userName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';

      const user: User = {
        id: `user-${Date.now()}`,
        name: userName,
        email: email,
        handle: `@${userName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`,
        avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userName)}`,
        subscribers: '0',
        isEmailVerified: true
      };

      const token = `mock-jwt-${Date.now()}-${user.id}`;
      return { user, token };
    }

    // Invalid credentials
    throw new Error('Wrong email or password. Please try again.');
  },

  // Create Channel (simplified for Google OAuth users)
  createChannel: async (data: {
    userId: string,
    name: string,
    handle: string,
    description: string,
    avatar: File | null,
    banner: File | null
  }) => {
    // In a real app, you'd upload files to your backend
    const avatarUrl = data.avatar ? URL.createObjectURL(data.avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`;
    const bannerUrl = data.banner ? URL.createObjectURL(data.banner) : 'https://picsum.photos/1200/300';

    const updatedUser: User = {
      id: data.userId,
      name: data.name,
      email: 'user@example.com', // This would come from stored user data
      subscribers: '0',
      handle: data.handle,
      description: data.description,
      avatar: avatarUrl,
      banner: bannerUrl
    };

    return { user: updatedUser };
  },
};