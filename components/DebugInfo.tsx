import React from 'react';
import { useAuth } from '../context/AuthContext';

export const DebugInfo: React.FC<{ video?: any }> = ({ video }) => {
  const { user, isAuthenticated, token } = useAuth();

  return (
    <div className="fixed top-0 left-0 bg-black/80 text-white p-4 text-xs z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      <div className="mb-2">
        <strong>Auth Status:</strong>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user ? user.name : 'None'}</div>
        <div>Token: {token ? 'Present' : 'Missing'}</div>
      </div>

      {video && (
        <div className="mb-2">
          <strong>Video Info:</strong>
          <div>ID: {video.id}</div>
          <div>Title: {video.title}</div>
          <div>Likes: {video.likesCount}</div>
          <div>Comments: {video.commentsCount}</div>
        </div>
      )}

      <div className="mb-2">
        <strong>Local Storage:</strong>
        <div>Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</div>
        <div>User: {localStorage.getItem('user_data') ? 'Present' : 'Missing'}</div>
      </div>
    </div>
  );
};