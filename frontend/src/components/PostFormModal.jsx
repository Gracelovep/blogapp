import { useState } from 'react';
import Modal from './Modal';

// Used for both creating a new post and editing an existing one.
// Pass `post` to pre-fill the form in edit mode.
export default function PostFormModal({ post, onClose, onSubmit }) {
  const isEdit = Boolean(post);
  const [form, setForm] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    tags: (post?.tags || []).join(', '),
  });
  const [showMore, setShowMore] = useState(Boolean(post?.excerpt || post?.tags?.length));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Post' : 'Create New Post'} icon="✍️" onClose={onClose} width="560px">
      <form className="modal-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          name="title"
          type="text"
          placeholder="Enter post title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="post-content">Content</label>
        <textarea
          id="post-content"
          name="content"
          placeholder="Write your post content..."
          rows={8}
          value={form.content}
          onChange={handleChange}
          required
        />

        {showMore ? (
          <>
            <label htmlFor="post-excerpt">Short excerpt (optional)</label>
            <input
              id="post-excerpt"
              name="excerpt"
              type="text"
              placeholder="A one-line summary shown on the feed"
              value={form.excerpt}
              onChange={handleChange}
              maxLength={300}
            />

            <label htmlFor="post-tags">Tags (optional, comma separated)</label>
            <input
              id="post-tags"
              name="tags"
              type="text"
              placeholder="javascript, tutorial, career"
              value={form.tags}
              onChange={handleChange}
            />
          </>
        ) : (
          <button type="button" className="link-button subtle" onClick={() => setShowMore(true)}>
            + Add excerpt / tags (optional)
          </button>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Post'}
        </button>
      </form>
    </Modal>
  );
}
