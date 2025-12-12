import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { downloadService } from '../services/downloadService';

interface DownloadButtonProps {
  videoId: string;
  videoTitle: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  videoId,
  videoTitle,
  variant = 'button',
  size = 'md',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadService.downloadVideo(videoId, videoTitle);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error: any) {
      console.error('Download failed:', error);
      alert(error.message || 'Failed to download video');
    } finally {
      setIsDownloading(false);
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  if (variant === 'button') {
    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          downloaded
            ? 'bg-green-600 text-white'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        } ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isDownloading ? (
          <>
            <Loader2 size={iconSize} className="animate-spin" />
            <span>Downloading...</span>
          </>
        ) : downloaded ? (
          <>
            <Check size={iconSize} />
            <span>Downloaded</span>
          </>
        ) : (
          <>
            <Download size={iconSize} />
            <span>Download</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      title={downloaded ? 'Downloaded' : 'Download video'}
      className={`p-2 rounded-full transition-colors ${
        downloaded
          ? 'bg-green-600 text-white'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      } ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isDownloading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : downloaded ? (
        <Check size={iconSize} />
      ) : (
        <Download size={iconSize} />
      )}
    </button>
  );
};
