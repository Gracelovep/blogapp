const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function PostCard({ post, isOwner, onEdit, onDelete, shortIdLabel }) {
  return (
    <article className="post-card">
      <div className="post-card-main">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span>✍️ {post.author?.name || 'Unknown author'}</span>
          <span>📅 {formatDate(post.createdAt)}</span>
          {shortIdLabel && <span className="post-id">{shortIdLabel}</span>}
        </div>
        <p className="post-excerpt">{post.excerpt || truncate(post.content)}</p>
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="post-card-actions">
          <button type="button" className="btn btn-small btn-secondary" onClick={() => onEdit(post)}>
            Edit
          </button>
          <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(post)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

function truncate(text, length = 160) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
