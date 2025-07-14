import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/posts/${id}/comments`, { author, text });
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, res.data.comment]
      }));
      setAuthor('');
      setText('');
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Loading post...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <hr />

      <h3>Comments ({post.comments?.length || 0})</h3>
      {post.comments?.map((c, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
          <strong>{c.author}</strong>: {c.text}
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <textarea
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '0.5rem' }}>Submit</button>
      </form>
    </div>
  );
}

export default PostDetails;
