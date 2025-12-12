export interface User {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  handle: string;
  email?: string; // Added for auth
  banner?: string;
  description?: string;
  isVerified?: boolean; // For checkmarks
  googleId?: string; // Google OAuth ID
  isEmailVerified?: boolean; // Email verification status
  role?: string; // User role (admin, user, etc.)
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
  description: string;
  category: string;
  videoUrl?: string; // For dummy playback
}

export interface Short {
  id: string;
  title: string;
  videoUrl: string; // Placeholder for video source
  channelId: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  likes: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

export enum SidebarState {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Collapsed = 'COLLAPSED' // For mobile/tablet
}