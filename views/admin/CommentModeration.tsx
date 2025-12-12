import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import './CommentModeration.css';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
  video: {
    title: string;
  };
}

export const CommentModeration: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [page]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllComments(page, 20);
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await adminService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="comment-moderation">
      <h1>Comment Moderation</h1>

      {loading ? (
        <div className="loading">Loading comments...</div>
      ) : (
        <>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <span className="username">{comment.user?.name}</span>
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-video">
                  On video: {comment.video?.title}
                </div>
                <div className="comment-actions">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="btn-delete"
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            ))}
          </div>

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
