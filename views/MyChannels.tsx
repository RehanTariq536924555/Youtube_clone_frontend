import React, { useState, useEffect } from 'react';
import { channelService, Channel } from '../services/channelService';
import { useNavigate } from 'react-router-dom';
import './MyChannels.css';

const MyChannels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', handle: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setLoading(true);
      const data = await channelService.getMyChannels();
      setChannels(data);
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!formData.name.trim()) {
      setError('Channel name is required');
      return;
    }
    if (formData.name.trim().length < 3) {
      setError('Channel name must be at least 3 characters');
      return;
    }
    if (formData.name.length > 50) {
      setError('Channel name must be less than 50 characters');
      return;
    }

    // Validate handle
    if (!formData.handle.trim()) {
      setError('Channel handle is required');
      return;
    }
    if (formData.handle.trim().length < 3) {
      setError('Handle must be at least 3 characters');
      return;
    }
    if (formData.handle.length > 30) {
      setError('Handle must be less than 30 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.handle)) {
      setError('Handle can only contain letters, numbers, underscores, and hyphens (no spaces)');
      return;
    }

    // Validate description
    if (formData.description && formData.description.length > 1000) {
      setError('Description must be less than 1000 characters');
      return;
    }

    try {
      await channelService.createChannel({
        name: formData.name.trim(),
        handle: formData.handle.trim(),
        description: formData.description?.trim() || undefined
      });
      setShowCreateModal(false);
      setFormData({ name: '', handle: '', description: '' });
      loadChannels();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else if (typeof errorMessage === 'string') {
        setError(errorMessage);
      } else {
        setError('Failed to create channel. Please check your input and try again.');
      }
      console.error('Channel creation error:', error.response?.data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;

    try {
      await channelService.deleteChannel(id);
      loadChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  return (
    <div className="my-channels">
      <div className="header">
        <h1>My Channels</h1>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          Create Channel
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading channels...</div>
      ) : channels.length === 0 ? (
        <div className="empty-state">
          <h2>No channels yet</h2>
          <p>Create your first channel to start uploading videos</p>
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>
            Create Channel
          </button>
        </div>
      ) : (
        <div className="channels-grid">
          {channels.map((channel) => (
            <div key={channel.id} className="channel-card">
              {channel.isSuspended && (
                <div className="suspended-badge">Suspended</div>
              )}
              <div className="channel-avatar">
                {channel.avatar ? (
                  <img src={channel.avatar} alt={channel.name} />
                ) : (
                  <div className="avatar-placeholder">{channel.name[0]}</div>
                )}
              </div>
              <h3>{channel.name}</h3>
              <p className="handle">@{channel.handle}</p>
              {channel.description && (
                <p className="description">{channel.description}</p>
              )}
              <div className="stats">
                <div className="stat">
                  <span className="value">{channel.subscribersCount}</span>
                  <span className="label">Subscribers</span>
                </div>
                <div className="stat">
                  <span className="value">{channel.videosCount}</span>
                  <span className="label">Videos</span>
                </div>
                <div className="stat">
                  <span className="value">{channel.totalViews}</span>
                  <span className="label">Views</span>
                </div>
              </div>
              <div className="actions">
                <button onClick={() => navigate(`/channel/${channel.id}`)}>
                  View
                </button>
                {!channel.isSuspended && (
                  <>
                    <button onClick={() => navigate(`/channel/${channel.id}/edit`)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(channel.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Channel</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Channel Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter channel name"
                  maxLength={50}
                  minLength={3}
                />
                <small>3-50 characters</small>
              </div>
              <div className="form-group">
                <label>Handle * (e.g., mychannel)</label>
                <div className="handle-input">
                  <span>@</span>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => {
                      // Remove spaces and special characters as user types
                      const sanitized = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                      setFormData({ ...formData, handle: sanitized });
                    }}
                    placeholder="channelhandle"
                    maxLength={30}
                    minLength={3}
                  />
                </div>
                <small>3-30 characters. Only letters, numbers, underscores, and hyphens (no spaces)</small>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell viewers about your channel"
                  rows={4}
                  maxLength={1000}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChannels;
