import React, { useEffect, useState } from 'react';
import './Settings.css';

interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '',
    site_tagline: '',
    site_description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/settings');
      const data = await response.json();
      setSettings({
        site_name: data.site_name || 'NebulaStream',
        site_tagline: data.site_tagline || 'Your Video Streaming Platform',
        site_description: data.site_description || 'Watch, upload, and share videos with the world',
      });
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:4000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setMessage('✅ Settings updated successfully! Refresh the page to see changes.');
      
      // Update document title immediately
      document.title = settings.site_name;
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
      
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      site_name: 'NebulaStream',
      site_tagline: 'Your Video Streaming Platform',
      site_description: 'Watch, upload, and share videos with the world',
    });
    setMessage('');
    setError('');
  };

  if (loading) {
    return <div className="admin-loading">Loading settings...</div>;
  }

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Site Settings</h1>
        <p className="settings-subtitle">Customize your website name and branding</p>
      </div>

      {message && (
        <div className="settings-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="settings-message error">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-card">
          <h2>🏷️ Branding</h2>
          
          <div className="form-group">
            <label htmlFor="site_name">
              Website Name
              <span className="label-hint">This will appear throughout the site</span>
            </label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              placeholder="NebulaStream"
              required
              maxLength={50}
            />
            <div className="char-count">{settings.site_name.length}/50</div>
          </div>

          <div className="form-group">
            <label htmlFor="site_tagline">
              Tagline
              <span className="label-hint">Short description of your platform</span>
            </label>
            <input
              type="text"
              id="site_tagline"
              name="site_tagline"
              value={settings.site_tagline}
              onChange={handleChange}
              placeholder="Your Video Streaming Platform"
              maxLength={100}
            />
            <div className="char-count">{settings.site_tagline.length}/100</div>
          </div>

          <div className="form-group">
            <label htmlFor="site_description">
              Description
              <span className="label-hint">Detailed description for SEO</span>
            </label>
            <textarea
              id="site_description"
              name="site_description"
              value={settings.site_description}
              onChange={handleChange}
              placeholder="Watch, upload, and share videos with the world"
              rows={4}
              maxLength={200}
            />
            <div className="char-count">{settings.site_description.length}/200</div>
          </div>
        </div>

        <div className="settings-preview">
          <h3>👁️ Preview</h3>
          <div className="preview-box">
            <div className="preview-title">{settings.site_name || 'NebulaStream'}</div>
            <div className="preview-tagline">{settings.site_tagline || 'Your Video Streaming Platform'}</div>
            <div className="preview-description">{settings.site_description || 'Watch, upload, and share videos with the world'}</div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" onClick={handleReset} className="btn-reset" disabled={saving}>
            Reset to Default
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>

      <div className="settings-info">
        <h3>ℹ️ Information</h3>
        <ul>
          <li>Changes will be reflected across the entire website</li>
          <li>The website name appears in the navbar, page titles, and branding</li>
          <li>Users may need to refresh their browser to see changes</li>
          <li>Keep the name short and memorable for best results</li>
        </ul>
      </div>
    </div>
  );
};
