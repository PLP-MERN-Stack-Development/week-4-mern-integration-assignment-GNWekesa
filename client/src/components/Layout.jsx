import Navbar from './Navbar';

function Layout({ children }) {
  const styles = {
    wrapper: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh'
    }
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
