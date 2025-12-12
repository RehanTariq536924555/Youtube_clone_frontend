import { useState, useEffect } from 'react';

interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'NebulaStream',
  site_tagline: 'Your Video Streaming Platform',
  site_description: 'Watch, upload, and share videos with the world',
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/settings');
      const data = await response.json();
      setSettings({
        site_name: data.site_name || defaultSettings.site_name,
        site_tagline: data.site_tagline || defaultSettings.site_tagline,
        site_description: data.site_description || defaultSettings.site_description,
      });
      
      // Update document title
      document.title = data.site_name || defaultSettings.site_name;
    } catch (error) {
      console.error('Failed to load site settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event: any) => {
      setSettings(event.detail);
      document.title = event.detail.site_name;
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return { settings, loading, reload: loadSettings };
};
