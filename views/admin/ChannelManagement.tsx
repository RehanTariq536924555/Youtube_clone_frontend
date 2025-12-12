import React, { useState, useEffect } from 'react';
import { adminChannelService } from '../../services/adminChannelService';
import './ChannelManagement.css';

interface Channel {
  id: string;
  name: string;
  handle: string;
  description?: string;
  subscribersCount: number;
  videosCount: number;
  totalViews: number;
  isSuspended: boolean;
  suspensionReason?: string;
  isActive: boolean;
  createdAt: string;
  user: { name: string; email: string };
}

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState({ totalChannels: 0, activeChannels: 0, suspendedChannels: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    loadChannels();
    loadStats();
  }, [page, search]);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading channels from admin API...');
      const data = await adminChannelService.getAllChannels(page, 20, search);
      console.log('Channels loaded:', data);
      setChannels(data.channels || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading channels:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load channels');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Loading channel stats...');
      const data = await adminChannelService.getChannelStats();
      console.log('Stats loaded:', data);
      setStats(data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSuspend = async () => {
    if (!selectedChannel || !suspendReason.trim()) return;
    
    try {
      await adminChannelService.suspendChannel(selectedChannel.id, suspendReason);
      setShowSuspendModal(false);
      setSuspendReason('');
      setSelectedChannel(null);
      loadChannels();
      loadStats();
    } catch (error) {
      console.error('Error suspending channel:', error);
    }
  };

  const handleUnsuspend = async (id: string) => {
    if (!confirm('Are you sure you want to unsuspend this channel?')) return;
    
    try {
      await adminChannelService.unsuspendChannel(id);
      loadChannels();
      loadStats();
    } catch (error) {
      console.error('Error unsuspending channel:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this channel? This action cannot be undone.')) return;
    
    try {
      await adminChannelService.deleteChannel(id);
      loadChannels();
      loadStats();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  return (
    <div className="channel-management">
      <h1>Channel Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Channels</h3>
          <p className="stat-value">{stats.totalChannels}</p>
        </div>
        <div className="stat-card">
          <h3>Active Channels</h3>
          <p className="stat-value">{stats.activeChannels}</p>
        </div>
        <div className="stat-card">
          <h3>Suspended Channels</h3>
          <p className="stat-value">{stats.suspendedChannels}</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search channels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading channels...</div>
      ) : error ? (
        <div className="error-message">
          <p>❌ Error: {error}</p>
          <button onClick={loadChannels}>Retry</button>
        </div>
      ) : channels.length === 0 ? (
        <div className="empty-state">
          <p>📺 No channels found</p>
          <p>Users haven't created any channels yet, or they don't match your search.</p>
          {search && <button onClick={() => setSearch('')}>Clear Search</button>}
        </div>
      ) : (
        <>
          <div className="channels-table">
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Handle</th>
                  <th>Owner</th>
                  <th>Videos</th>
                  <th>Subscribers</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel) => (
                  <tr key={channel.id}>
                    <td>{channel.name}</td>
                    <td>@{channel.handle}</td>
                    <td>{channel.user?.name || 'Unknown'}</td>
                    <td>{channel.videosCount}</td>
                    <td>{channel.subscribersCount}</td>
                    <td>{channel.totalViews}</td>
                    <td>
                      <span className={`status ${channel.isSuspended ? 'suspended' : 'active'}`}>
                        {channel.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="actions">
                      {channel.isSuspended ? (
                        <button
                          className="btn-unsuspend"
                          onClick={() => handleUnsuspend(channel.id)}
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          className="btn-suspend"
                          onClick={() => {
                            setSelectedChannel(channel);
                            setShowSuspendModal(true);
                          }}
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(channel.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showSuspendModal && (
        <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Suspend Channel</h2>
            <p>Channel: {selectedChannel?.name}</p>
            <textarea
              placeholder="Enter suspension reason..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setShowSuspendModal(false)}>Cancel</button>
              <button
                className="btn-suspend"
                onClick={handleSuspend}
                disabled={!suspendReason.trim()}
              >
                Suspend Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelManagement;
