import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Edit, Trash2 } from 'lucide-react';
import { commentService, Comment, CreateCommentData } from '../services/commentService';
import { likeService, LikeType, LikeableType } from '../services/likeService';

interface CommentSectionProps {
  videoId: string;
  currentUserId?: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onReply: (parentId: string) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, onReply, onEdit, onDelete }) => {
  const [userLike, setUserLike] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikesCount);

  // Debug log to see comment data
  console.log('Comment data:', comment);

  useEffect(() => {
    if (currentUserId) {
      likeService.getUserLike(comment.id, LikeableType.COMMENT)
        .then(setUserLike)
        .catch(() => setUserLike(null));
    }
  }, [comment.id, currentUserId]);

  const handleLike = async (type: LikeType) => {
    if (!currentUserId) return;

    try {
      const result = await likeService.toggleLike(comment.id, LikeableType.COMMENT, type);
      
      if (result.action === 'created') {
        setUserLike(result.like);
        if (type === LikeType.LIKE) {
          setLikesCount(prev => prev + 1);
        } else {
          setDislikesCount(prev => prev + 1);
        }
      } else if (result.action === 'removed') {
        setUserLike(null);
        if (type === LikeType.LIKE) {
          setLikesCount(prev => prev - 1);
        } else {
          setDislikesCount(prev => prev - 1);
        }
      } else if (result.action === 'updated') {
        setUserLike(result.like);
        if (userLike?.type === LikeType.LIKE) {
          setLikesCount(prev => prev - 1);
          setDislikesCount(prev => prev + 1);
        } else {
          setDislikesCount(prev => prev - 1);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="flex space-x-3 p-4 border-b border-zinc-800">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
        {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm text-zinc-100">{comment.user?.name || 'Unknown User'}</span>
          <span className="text-xs text-zinc-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-zinc-200 mb-2">{comment.content}</p>
        <div className="flex items-center space-x-4 text-xs text-zinc-400">
          <button
            onClick={() => handleLike(LikeType.LIKE)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 hover:bg-blue-900/20 ${
              userLike?.type === LikeType.LIKE ? 'text-blue-400 bg-blue-900/30' : 'hover:text-blue-400'
            }`}
          >
            <ThumbsUp size={14} />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={() => handleLike(LikeType.DISLIKE)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 hover:bg-red-900/20 ${
              userLike?.type === LikeType.DISLIKE ? 'text-red-400 bg-red-900/30' : 'hover:text-red-400'
            }`}
          >
            <ThumbsDown size={14} />
            <span>{dislikesCount}</span>
          </button>
          {currentUserId && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center space-x-1 px-2 py-1 rounded-full hover:text-purple-400 hover:bg-purple-900/20 transition-all duration-200"
            >
              <Reply size={14} />
              <span>Reply</span>
            </button>
          )}
          {currentUserId === comment.userId && (
            <>
              <button
                onClick={() => onEdit(comment)}
                className="flex items-center space-x-1 px-2 py-1 rounded-full hover:text-green-400 hover:bg-green-900/20 transition-all duration-200"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center space-x-1 px-2 py-1 rounded-full hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-4 space-y-3">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ videoId, currentUserId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getVideoComments(videoId);
      console.log('Loaded comments:', data); // Debug log
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    try {
      const commentData: CreateCommentData = {
        content: newComment.trim(),
        videoId,
        parentId: replyingTo || undefined,
      };

      await commentService.createComment(commentData);
      setNewComment('');
      setReplyingTo(null);
      loadComments(); // Reload comments
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !editingComment) return;

    try {
      await commentService.updateComment(editingComment.id, newComment.trim());
      setNewComment('');
      setEditingComment(null);
      loadComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const startReply = (parentId: string) => {
    setReplyingTo(parentId);
    setEditingComment(null);
    setNewComment('');
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setReplyingTo(null);
    setNewComment(comment.content);
  };

  const cancelAction = () => {
    setReplyingTo(null);
    setEditingComment(null);
    setNewComment('');
  };

  if (loading) {
    return <div className="p-4">Loading comments...</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-sm">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-lg font-semibold flex items-center text-zinc-100">
          <MessageCircle className="mr-2" size={20} />
          Comments ({comments.length})
        </h3>
      </div>

      {currentUserId && (
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={editingComment ? handleEditComment : handleSubmitComment}>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyingTo ? 'Write a reply...' : 
                    editingComment ? 'Edit your comment...' : 
                    'Add a comment...'
                  }
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl resize-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 hover:border-gray-300"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {replyingTo && 'Replying to comment'}
                    {editingComment && 'Editing comment'}
                  </div>
                  <div className="flex space-x-2">
                    {(replyingTo || editingComment) && (
                      <button
                        type="button"
                        onClick={cancelAction}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      {editingComment ? 'Update' : 'Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReply={startReply}
              onEdit={startEdit}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;