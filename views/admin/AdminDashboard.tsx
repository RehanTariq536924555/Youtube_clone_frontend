import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import './AdminDashboard.css';

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalComments: number;
  totalViews: number;
  totalChannels: number;
  activeChannels: number;
  recentUsers: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome to the NebulaStream Admin Panel</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
            <span className="stat-change">+{stats?.recentUsers || 0} this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎥</div>
          <div className="stat-info">
            <h3>{stats?.totalVideos || 0}</h3>
            <p>Total Videos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats?.totalComments || 0}</h3>
            <p>Total Comments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats?.totalViews || 0}</h3>
            <p>Total Views</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📺</div>
          <div className="stat-info">
            <h3>{stats?.totalChannels || 0}</h3>
            <p>Total Channels</p>
            <span className="stat-change">{stats?.activeChannels || 0} active</span>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h3>📋 Platform Status</h3>
          <div className="status-item">
            <span className="status-label">System Status:</span>
            <span className="status-value online">● Online</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database:</span>
            <span className="status-value online">● Connected</span>
          </div>
          <div className="status-item">
            <span className="status-label">Storage:</span>
            <span className="status-value online">● Available</span>
          </div>
        </div>

        <div className="info-card">
          <h3>🎯 Quick Stats</h3>
          <div className="status-item">
            <span className="status-label">Active Users:</span>
            <span className="status-value">{stats?.recentUsers || 0}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Avg. Views/Video:</span>
            <span className="status-value">
              {stats?.totalVideos ? Math.round((stats?.totalViews || 0) / stats.totalVideos) : 0}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Engagement Rate:</span>
            <span className="status-value">
              {stats?.totalVideos ? Math.round(((stats?.totalComments || 0) / stats.totalVideos) * 100) / 100 : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
