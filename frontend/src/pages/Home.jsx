import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import PostFormModal from '../components/PostFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

const PAGE_SIZE = 10;

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const fetchPosts = useCallback(async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/posts', {
        params: { page, limit: PAGE_SIZE, search: searchTerm || undefined },
      });
      setPosts(res.data.data.posts);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term) => {
    setSearch(term);
    fetchPosts(1, term);
  };

  const handleClear = () => {
    setSearch('');
    fetchPosts(1, '');
  };

  const goToPage = (page) => fetchPosts(page, search);

  const handleUpdate = async (form) => {
    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      tags: form.tags,
    };
    await api.put(`/posts/${editingPost.id}`, payload);
    await fetchPosts(pagination.page, search);
  };

  const handleDelete = async () => {
    await api.delete(`/posts/${deletingPost.id}`);
    setDeletingPost(null);
    await fetchPosts(pagination.page, search);
  };

  return (
    <div className="page">
      <div className="page-hero">
        <h1>📰 Welcome to BlogApp</h1>
        <p>Read and share amazing stories from our community</p>
      </div>

      <SearchBar initialValue={search} onSearch={handleSearch} onClear={handleClear} />

      {error && <div className="form-error page-error">{error}</div>}

      {loading ? (
        <p className="empty-state-text">Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No posts found</h3>
          <p>Try a different search, or check back later.</p>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={isAuthenticated && post.author?.id === user?.id}
              onEdit={setEditingPost}
              onDelete={setDeletingPost}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            ← Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {editingPost && (
        <PostFormModal post={editingPost} onClose={() => setEditingPost(null)} onSubmit={handleUpdate} />
      )}

      {deletingPost && (
        <ConfirmDialog
          title="Delete post"
          message={`Are you sure you want to delete "${deletingPost.title}"? This cannot be undone.`}
          onCancel={() => setDeletingPost(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
