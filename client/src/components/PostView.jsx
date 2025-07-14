import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  const styles = {
    container: {
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    content: {
      fontSize: '1rem',
      lineHeight: '1.6'
    }
  };

  if (error) return <p>Error loading post: {error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{post.title}</h1>
      <p style={styles.content}>{post.content}</p>
    </div>
  );
}

export default PostView;
