import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import './Analytics.css';

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('7d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics">
      <h1>Analytics</h1>

      <div className="period-selector">
        <button
          className={period === '7d' ? 'active' : ''}
          onClick={() => setPeriod('7d')}
        >
          Last 7 Days
        </button>
        <button
          className={period === '30d' ? 'active' : ''}
          onClick={() => setPeriod('30d')}
        >
          Last 30 Days
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>New Users</h3>
            <div className="big-number">{analytics?.newUsers || 0}</div>
            <p>in the last {period === '7d' ? '7' : '30'} days</p>
          </div>

          <div className="analytics-card">
            <h3>New Videos</h3>
            <div className="big-number">{analytics?.newVideos || 0}</div>
            <p>in the last {period === '7d' ? '7' : '30'} days</p>
          </div>
        </div>
      )}
    </div>
  );
};
