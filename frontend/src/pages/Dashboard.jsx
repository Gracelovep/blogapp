import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import PostFormModal from '../components/PostFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const fetchMyPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/posts/user/me');
      setPosts(res.data.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const visiblePosts = useMemo(() => {
    if (!search) return posts;
    const term = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        p.author?.name?.toLowerCase().includes(term)
    );
  }, [posts, search]);

  const handleCreate = async (form) => {
    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      tags: form.tags,
    };
    await api.post('/posts', payload);
    await fetchMyPosts();
  };

  const handleUpdate = async (form) => {
    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      tags: form.tags,
    };
    await api.put(`/posts/${editingPost.id}`, payload);
    await fetchMyPosts();
  };

  const handleDelete = async () => {
    await api.delete(`/posts/${deletingPost.id}`);
    setDeletingPost(null);
    await fetchMyPosts();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Dashboard</h1>
        <p>Manage the posts you've published.</p>
      </div>

      <SearchBar
        initialValue={search}
        onSearch={setSearch}
        onClear={() => setSearch('')}
        actionSlot={
          <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Post
          </button>
        }
      />

      {error && <div className="form-error page-error">{error}</div>}

      {loading ? (
        <p className="empty-state-text">Loading your posts…</p>
      ) : visiblePosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No posts found</h3>
          <p>Be the first to create a blog post!</p>
        </div>
      ) : (
        <div className="post-list">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner
              onEdit={setEditingPost}
              onDelete={setDeletingPost}
            />
          ))}
        </div>
      )}

      {showCreate && <PostFormModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}

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
