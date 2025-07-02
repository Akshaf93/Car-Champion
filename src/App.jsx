export default function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a202c', // Dark gray background
      color: '#cbd5e0',            // Light gray text
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Car Champion
      </h1>
      <p style={{ marginTop: '1rem', fontSize: '1.25rem', color: '#e2e8f0' }}>
        Welcome to the car tournament!
      </p>
      <button style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#6675ef',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        Start Tournament
      </button>
    </div>
  );
}
