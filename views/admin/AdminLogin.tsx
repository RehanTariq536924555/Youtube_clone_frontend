import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }

      if (!data.access_token) {
        console.error('No access token in response:', data);
        throw new Error('No access token received');
      }

      // Check if user has admin role
      console.log('Checking admin role with token:', data.access_token.substring(0, 20) + '...');
      const userResponse = await fetch('http://localhost:4000/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      const userData = await userResponse.json();

      console.log('User data from /auth/me:', userData);
      console.log('User role:', userData.user?.role);

      if (!userData.user || userData.user.role !== 'admin') {
        console.error('Admin check failed:', {
          hasUser: !!userData.user,
          role: userData.user?.role,
          expected: 'admin'
        });
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Store admin session
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(userData.user));

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>🔐 Admin Panel</h1>
          <p>Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Demo Admin Credentials:</p>
          <code>admin@nebulastream.com</code>
          <p style={{ marginTop: '10px' }}>
            <a href="/" className="back-link">← Back to main site</a>
          </p>
        </div>
      </div>
    </div>
  );
};
