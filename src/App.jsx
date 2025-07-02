import { useState, useEffect } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      minHeight: '100vh',
      minWidth: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        padding: '1rem 2rem',
        backgroundColor: 'transparent',
        boxShadow: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: '1.5rem',
            marginRight: '0.5rem',
            color: darkMode ? '#facc15' : '#d946ef'
          }}>🚗</span>
          <h1 style={{
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: darkMode ? 'white' : 'black'
          }}>Car Champion</h1>
        </div>
        <button
          onClick={() => alert("New Tournament")}
          style={{
            backgroundColor: 'transparent',
            color: darkMode ? '#cbd5e0' : '#2d3748',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          New Tournament
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>Welcome to Car Champion</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Select cars and start the tournament.
        </p>
        <button
          onClick={() => alert("Start clicked")}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6675ef',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.125rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s',
            ':hover': { transform: 'scale(1.02)' }
          }}
        >
          Start Tournament
        </button>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        textAlign: 'center',
        backgroundColor: 'transparent',
        width: '100%'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: darkMode ? '#a0aec0' : '#718096'
        }}>© 2023 Car Champion. All cars are for demonstration only.</p>
      </footer>
    </div>
  );
}
