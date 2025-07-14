import { useEffect, useState } from 'react';
import api from '../api/api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  // Fetch posts
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      page,
      search,
      category
    }).toString();

    api.get(`/posts?${query}`)
      .then(res => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search, category]);

  const styles = {
    container: { padding: '1rem' },
    input: { marginRight: '1rem', padding: '0.5rem' },
    select: { marginRight: '1rem', padding: '0.5rem' },
    postCard: {
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: '#fff'
    },
    postTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    pagination: { display: 'flex', gap: '0.5rem', marginTop: '1rem' }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {/* Search and Filter */}
      <div>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Post List */}
      {posts.length === 0 ? <p>No posts found.</p> : posts.map(post => (
        <div key={post._id} style={styles.postCard}>
          {post.image && (
            <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }} />
          )}
          <h2 style={styles.postTitle}>{post.title}</h2>
          <p>{post.content.slice(0, 100)}...</p>
        </div>
      ))}

      {/* Pagination Controls */}
      <div style={styles.pagination}>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>◀ Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Next ▶</button>
      </div>
    </div>
  );
}

export default PostList;
