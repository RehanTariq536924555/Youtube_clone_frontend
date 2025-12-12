import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import './VideoManagement.css';

interface Video {
  id: string;
  title: string;
  viewsCount: number;
  isSuspended: boolean;
  suspensionReason?: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [page]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllVideos(page, 20);
      setVideos(data.videos);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendVideo = async (videoId: string) => {
    const reason = prompt('Enter suspension reason (optional):');
    
    try {
      await adminService.suspendVideo(videoId, reason || undefined);
      loadVideos();
    } catch (error) {
      console.error('Failed to suspend video:', error);
    }
  };

  const handleUnsuspendVideo = async (videoId: string) => {
    try {
      await adminService.unsuspendVideo(videoId);
      loadVideos();
    } catch (error) {
      console.error('Failed to unsuspend video:', error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await adminService.deleteVideo(videoId);
      loadVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  return (
    <div className="video-management">
      <h1>Video Management</h1>

      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : (
        <>
          <table className="videos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Creator</th>
                <th>Views</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className={video.isSuspended ? 'suspended-row' : ''}>
                  <td>{video.id}</td>
                  <td>
                    {video.title}
                    {video.isSuspended && (
                      <div className="suspension-badge">
                        🚫 Suspended
                        {video.suspensionReason && (
                          <span className="suspension-reason">: {video.suspensionReason}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{video.user?.name}</td>
                  <td>{video.viewsCount}</td>
                  <td>
                    {video.isSuspended ? (
                      <span className="status suspended">🚫 Suspended</span>
                    ) : (
                      <span className="status active">✓ Active</span>
                    )}
                  </td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    {video.isSuspended ? (
                      <button onClick={() => handleUnsuspendVideo(video.id)} className="btn-unsuspend">
                        Unsuspend
                      </button>
                    ) : (
                      <button onClick={() => handleSuspendVideo(video.id)} className="btn-suspend">
                        Suspend
                      </button>
                    )}
                    <button onClick={() => handleDeleteVideo(video.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
