import { Link } from 'react-router-dom';

function Navbar() {
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#1f2937',
      color: '#fff'
    },
    link: {
      color: '#fff',
      marginLeft: '1rem',
      textDecoration: 'none'
    }
  };

  return (
    <nav style={styles.nav}>
      <h1>My Blog</h1>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/create" style={styles.link}>New Post</Link>
      </div>
    </nav>
  );
}

export default Navbar;
