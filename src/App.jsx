import './global.css';
import { useState, useEffect } from 'react';

export default function App() {
  // Game states: start → confirmEdit → edit → battle → results
  const [gameState, setGameState] = useState('start');

  // Car data
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);

  // Tournament state
  const [currentRound, setCurrentRound] = useState([]);
  const [battles, setBattles] = useState([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState([]);
  const [winner, setWinner] = useState(null);

  // Dark mode defaults to true now
  const [darkMode, setDarkMode] = useState(true);

  // For expanded notes on a specific car card in edit mode
  const [expandedNoteCarId, setExpandedNoteCarId] = useState(null);
  const [editingNote, setEditingNote] = useState('');

  // Mock cars
  const mockCars = [
    { id: 1, name: 'Honda BR-V', description: 'Spacious compact SUV with family-friendly features.', notes: '', isCustom: false },
    { id: 2, name: 'Kia Carnival', description: 'Luxury MPV with bold design and premium interior.', notes: '', isCustom: false },
    { id: 3, name: 'Kia Sorento', description: 'Reliable mid-size SUV with hybrid option.', notes: '', isCustom: false },
    { id: 4, name: 'Toyota Sienna', description: 'Hybrid-powered minivan with advanced tech.', notes: '', isCustom: false },
    { id: 5, name: 'Oshan X7', description: 'Stylish crossover with modern tech and comfort.', notes: '', isCustom: false },
    { id: 6, name: 'Nissan Serena', description: 'Smooth-driving commuter van with sliding doors.', notes: '', isCustom: false },
    { id: 7, name: 'Toyota Prius Alpha', description: 'Eco-friendly hatchback with hybrid efficiency.', notes: '', isCustom: false },
    { id: 8, name: 'Chery Tiggo 8 Pro', description: 'Premium SUV with aggressive styling and smart tech.', notes: '', isCustom: false }
  ];

  useEffect(() => {
    const savedSelected = JSON.parse(localStorage.getItem('selectedCars')) || [...mockCars];
    setSelectedCars(savedSelected);
  }, []);

  const formatCarName = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const padToNextPowerOfTwo = (carList) => {
    const nextPower = Math.pow(2, Math.ceil(Math.log2(carList.length)));
    const padding = Array.from({ length: nextPower - carList.length }).map((_, i) => ({
      id: `bye-${i}`,
      name: 'Bye',
      description: 'Automatically advances to the next round.',
      notes: '',
      isBye: true
    }));
    return [...carList, ...padding];
  };

  const generateBattles = (roundCars) => {
    const newBattles = [];
    for (let i = 0; i < roundCars.length; i += 2) {
      if (i + 1 < roundCars.length) {
        newBattles.push([roundCars[i], roundCars[i + 1]]);
      } else {
        newBattles.push([roundCars[i]]);
      }
    }
    return newBattles;
  };

  const startTournament = () => {
    setGameState('confirmEdit');
  };

  const beginTournament = () => {
    if (selectedCars.length < 2) {
      alert("Please select at least 2 cars.");
      return;
    }
    const paddedCars = padToNextPowerOfTwo(selectedCars);
    const initialBattles = generateBattles(paddedCars);

    setCurrentRound(paddedCars);
    setBattles(initialBattles);
    setBattleIndex(0);
    setRoundWinners([]);
    setGameState('battle');
  };

  const selectWinner = (car) => {
    const updatedWinners = [...roundWinners, car];
    if (updatedWinners.length < battles.length) {
      setRoundWinners(updatedWinners);
      setBattleIndex(battleIndex + 1);
    } else {
      const finalWinners = [...updatedWinners];
      if (finalWinners.length === 1) {
        setWinner(finalWinners[0]);
        setGameState('results');
      } else {
        const nextBattles = generateBattles(finalWinners);
        setCurrentRound(finalWinners);
        setBattles(nextBattles);
        setBattleIndex(0);
        setRoundWinners([]);
      }
    }
  };

  const resetGame = () => {
    const savedSelected = JSON.parse(localStorage.getItem('selectedCars'));
    if (savedSelected && savedSelected.length > 0) {
      setSelectedCars(savedSelected);
    } else {
      setSelectedCars([...mockCars]);
    }
    setCars(mockCars);
    setCurrentRound([]);
    setBattles([]);
    setRoundWinners([]);
    setWinner(null);
    setGameState('start');
  };

  const [newCar, setNewCar] = useState({ name: '', description: '', notes: '' });

  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;
    const id = Date.now();
    const newCarEntry = {
      id,
      ...newCar,
      isCustom: true
    };
    setSelectedCars(prev => [...prev, newCarEntry]);
    setCars(prev => [...prev, newCarEntry]);
    setNewCar({ name: '', description: '', notes: '' });
  };

  // Notes update (used in expanded notes screen)
  const updateNote = (id, note) => {
    const updated = selectedCars.map(car =>
      car.id === id ? { ...car, notes: note } : car
    );
    setSelectedCars(updated);
    localStorage.setItem('selectedCars', JSON.stringify(updated));
  };

  // Inline note update (for compatibility, not used in expanded mode)
  const updateNoteInline = (id, note) => {
    updateNote(id, note);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render Loading Screen
  const renderLoadingScreen = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid #7c3aed',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }}></div>
      <p>Loading tournament...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Start screen
  const renderStartScreen = () => (
    <div style={{
      padding: '2rem',
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      transition: 'background-color 0.3s, color 0.3s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #4f46e5, #9333ea)',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
      }}>Car Champion</h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '1rem 0', textAlign: 'center' }}>
        We've auto-selected all available cars. Would you like to edit the list before starting?
      </p>
      <button
        onClick={startTournament}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#6675ef',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1.125rem'
        }}
      >
        Start Tournament
      </button>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '0.75rem',
          borderRadius: '9999px',
          backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );

  // Confirm Edit Screen (make it not tall/centered, compact)
  const renderConfirmEditScreen = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      minHeight: 0, // remove full vh height
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      transition: 'background-color 0.3s, color 0.3s',
      padding: '2rem',
      margin: '2rem auto',
      width: '100%',
      maxWidth: 500,
      borderRadius: '0.5rem',
      boxShadow: darkMode
        ? '0 2px 8px rgba(0,0,0,0.3)'
        : '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Ready to Begin?
      </h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem', textAlign: 'center' }}>
        You've selected {selectedCars.length} cars. Would you like to add or remove any?
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setGameState('edit')}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Edit Cars
        </button>
        <button
          onClick={beginTournament}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Start Tournament
        </button>
      </div>
    </div>
  );

  // Edit Screen
  const renderEditScreen = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewCar({ ...newCar, [name]: value });
    };

    const handleSaveNote = (car) => {
      updateNote(car.id, editingNote);
      setExpandedNoteCarId(null);
      setEditingNote('');
    };

    return (
      <div style={{
        padding: '2rem',
        backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
        color: darkMode ? '#cbd5e0' : '#2d3748',
        transition: 'background-color 0.3s, color 0.3s'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>Customize Your Car List</h2>
        {/* Selected Cars */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Selected Cars</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            {selectedCars.map(car => (
              expandedNoteCarId === car.id ? (
                <div key={car.id} style={{
                  backgroundColor: darkMode ? '#2d3748' : 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  minWidth: '300px',
                  maxWidth: '400px',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: 0 }}>{formatCarName(car.name)}</h4>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{car.description}</p>
                  <textarea
                    placeholder="Add your notes..."
                    value={editingNote}
                    onChange={e => setEditingNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                      borderRadius: '0.375rem',
                      backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                      color: darkMode ? 'white' : 'black',
                      minHeight: 120,
                      marginTop: '0.5rem',
                      fontSize: '1.1rem',
                      resize: 'vertical'
                    }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => { setExpandedNoteCarId(null); setEditingNote(''); }}
                      style={{
                        backgroundColor: '#a0aec0',
                        color: '#2d3748',
                        border: 'none',
                        padding: '0.4rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveNote(car)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 1.1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                      }}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <div key={car.id} style={{
                  backgroundColor: darkMode ? '#2d3748' : 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  minWidth: '250px',
                  maxWidth: '400px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  transform: 'translateY(0)'
                }}
                  onClick={() => {
                    setExpandedNoteCarId(car.id);
                    setEditingNote(car.notes || '');
                  }}
                >
                  <h4 style={{ fontWeight: 'bold', marginBottom: 0 }}>{formatCarName(car.name)}</h4>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{car.description}</p>
                  <div
                    style={{
                      background: darkMode ? '#4a5568' : '#edf2f7',
                      borderRadius: '0.375rem',
                      color: darkMode ? '#eaeaea' : '#2d3748',
                      padding: '0.5rem',
                      minHeight: '38px',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ opacity: car.notes ? 1 : 0.6 }}>
                      {car.notes ? car.notes : "Click to add notes"}
                    </span>
                  </div>
                  {car.isCustom && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCars(selectedCars.filter(c => c.id !== car.id));
                        setCars(cars.filter(c => c.id !== car.id));
                      }}
                      style={{
                        marginTop: '0.5rem',
                        color: '#ef4444',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
        {/* Add New Car Form */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Car</h3>
          <div style={{
            backgroundColor: darkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <input
              type="text"
              name="name"
              placeholder="Car Name"
              value={newCar.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                borderRadius: '0.375rem',
                backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newCar.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                borderRadius: '0.375rem',
                backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <button
              onClick={handleAddCustomCar}
              disabled={!newCar.name.trim()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: !newCar.name.trim() ? 'not-allowed' : 'pointer',
                opacity: !newCar.name.trim() ? 0.5 : 1
              }}
            >
              Add Car
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={beginTournament}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Start Tournament
          </button>
        </div>
      </div>
    );
  };

  // ...rest of your battle/results screens and header remain unchanged

  const DarkModeToggle = () => (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        padding: '0.75rem',
        borderRadius: '9999px',
        backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
        cursor: 'pointer'
      }}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );

  return (
    <div style={{
        fontFamily: "'Righteous', sans-serif'",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* Header */}
      <header style={{
        backgroundColor: darkMode ? '#2d3748' : 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '0.25rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '40px',
        fontSize: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', marginRight: '0.25rem', paddingLeft: '0.5rem' }}>🚗</span>
          <h1 style={{
            fontWeight: 'bold',
            color: darkMode ? 'white' : 'black',
            fontSize: '1.1rem',
            margin: 0
          }}>Car Champion</h1>
        </div>
        <button
          onClick={resetGame}
          style={{
            marginRight : '0.5rem',
            backgroundColor: darkMode ? '#281940' : '#bbd4f0',
            color: darkMode ? '#cbd5e0' : '#2d3748',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: '0.2rem 0.8rem'
          }}
        >
          New Tournament
        </button>
      </header>
      {/* Main Content */}
      <main style={{ flex: 1, width: '100%' }}>
        {gameState === 'start' && renderStartScreen()}
        {gameState === 'confirmEdit' && renderConfirmEditScreen()}
        {gameState === 'edit' && renderEditScreen()}
        {gameState === 'loading' && renderLoadingScreen()}
        {gameState === 'battle' && renderBattleScreen()}
        {gameState === 'results' && renderResultsScreen()}
      </main>
      <DarkModeToggle />
    </div>
  );
}
