import React, { useEffect, useState } from 'react';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');

      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      // Validate token with backend
      const response = await fetch('http://localhost:4000/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token invalid, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.user.role !== 'admin') {
        // Not an admin
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsLoading(false);
        return;
      }

      setAdminUser(data.user);
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!adminUser) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-zinc-800 text-white p-2 rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <h2>Admin Panel</h2>
          <p className="admin-user-info">{adminUser.name}</p>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📊 Dashboard
          </Link>
          <Link to="/admin/users" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            👥 Users
          </Link>
          <Link to="/admin/videos" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            🎥 Videos
          </Link>
          <Link to="/admin/comments" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            💬 Comments
          </Link>
          <Link to="/admin/channels" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📺 Channels
          </Link>
          <Link to="/admin/analytics" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            📈 Analytics
          </Link>
          <Link to="/admin/settings" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            ⚙️ Settings
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            🚪 Logout
          </button>
          <Link to="/" className="nav-item back" onClick={() => setIsMobileMenuOpen(false)}>
            ← Back to Site
          </Link>
        </nav>
      </aside>
      <main className="admin-content">
        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
