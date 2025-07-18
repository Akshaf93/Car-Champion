import './global.css';
import { useState, useEffect } from 'react';

export default function App() {
  // Game states: start → confirmEdit → edit → bracket → battle → results
  const [gameState, setGameState] = useState('start');

  // Dark mode defaults to true now
  const [darkMode, setDarkMode] = useState(true);

  // Tournament state
  const [currentRound, setCurrentRound] = useState([]);
  const [battles, setBattles] = useState([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState([]);
  const [winner, setWinner] = useState(null);

  // Note modal state
  const [expandedNoteCarId, setExpandedNoteCarId] = useState(null);
  const [editingNote, setEditingNote] = useState('');

  // Add car state
  const [newCar, setNewCar] = useState({ name: '', description: '', notes: '', imageUrl: '' });

  // Persisted custom cars from localStorage or default to mockCars
  const mockCars = [
    { id: 1, name: 'Honda BR-V', description: 'Spacious compact SUV with family-friendly features.', notes: '', isCustom: false, imageUrl: '' },
    { id: 2, name: 'Kia Carnival', description: 'Luxury MPV with bold design and premium interior.', notes: '', isCustom: false, imageUrl: '' },
    { id: 3, name: 'Kia Sorento', description: 'Reliable mid-size SUV with hybrid option.', notes: '', isCustom: false, imageUrl: '' },
    { id: 4, name: 'Toyota Sienna', description: 'Hybrid-powered minivan with advanced tech.', notes: '', isCustom: false, imageUrl: '' },
    { id: 5, name: 'Oshan X7', description: 'Stylish crossover with modern tech and comfort.', notes: '', isCustom: false, imageUrl: '' },
    { id: 6, name: 'Nissan Serena', description: 'Smooth-driving commuter van with sliding doors.', notes: '', isCustom: false, imageUrl: '' },
    { id: 7, name: 'Toyota Prius Alpha', description: 'Eco-friendly hatchback with hybrid efficiency.', notes: '', isCustom: false, imageUrl: '' },
    { id: 8, name: 'Chery Tiggo 8 Pro', description: 'Premium SUV with aggressive styling and smart tech.', notes: '', isCustom: false, imageUrl: '' }
  ];

  const [selectedCars, setSelectedCars] = useState(() => {
    const stored = localStorage.getItem('selectedCars');
    return stored ? JSON.parse(stored) : [...mockCars];
  });

  const [mockCarsRemoved, setMockCarsRemoved] = useState(0);

  const [editingCar, setEditingCar] = useState({ name: '', description: '' });


  useEffect(() => {
    localStorage.setItem('selectedCars', JSON.stringify(selectedCars));
  }, [selectedCars]);

  const formatCarName = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const padToNextPowerOfTwo = (carList) => {
    const nextPower = Math.pow(2, Math.ceil(Math.log2(carList.length)));
    const padding = Array.from({ length: nextPower - carList.length }).map((_, i) => ({
      id: `bye-${i}`,
      name: 'Bye',
      description: 'Automatically advances to the next round.',
      notes: '',
      isBye: true,
      imageUrl: ''
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
    setCurrentRound([]);
    setBattles([]);
    setRoundWinners([]);
    setWinner(null);
    setGameState('start');
  };

  const resetToDefaultCars = () => {
    setSelectedCars([...mockCars]);
    localStorage.removeItem('selectedCars');
  };

  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;
    const id = Date.now();
    const newCarEntry = {
      id,
      ...newCar,
      isCustom: true
    };
    setSelectedCars(prev => [...prev, newCarEntry]);
    setNewCar({ name: '', description: '', notes: '', imageUrl: '' });
  };

  const openNoteModal = (car) => {
    setExpandedNoteCarId(car.id);
    setEditingNote(car.notes || '');
    setEditingCar({
      name: car.name,
      description: car.description
    });
  };


  const closeNoteModal = () => {
    setExpandedNoteCarId(null);
    setEditingNote('');
    setEditingCar({ name: '', description: '' });
  };

  const handleSaveNote = (car) => {
  updateCarDetails(car.id, editingNote, editingCar.name, editingCar.description);
  closeNoteModal();
};
  
  const updateCarDetails = (id, note, name, description) => {
  const updated = selectedCars.map(car =>
    car.id === id ? { ...car, notes: note, name, description } : car
  );
  setSelectedCars(updated);
};

  const updateNote = (id, note) => {
    const updated = selectedCars.map(car =>
      car.id === id ? { ...car, notes: note } : car
      );
    setSelectedCars(updated);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Render Loading Screen
  const renderLoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  }}>
    <p style={{ fontSize: '1.25rem' }}>Loading tournament...</p>
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
 const renderEditScreen = () => (
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
            <div
              key={car.id}
              style={{
                backgroundColor: darkMode ? '#2d3748' : 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                minWidth: '250px',
                maxWidth: '400px',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onClick={() => openNoteModal(car)}
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
                  fontSize: '1rem',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <span style={{ opacity: car.notes ? 1 : 0.6 }}>
                  {car.notes ? car.notes : "Click to add notes"}
                </span>
              </div>
                {(car.isCustom || (!car.isCustom && mockCarsRemoved < 4)) ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!car.isCustom) setMockCarsRemoved(prev => prev + 1);
                    setSelectedCars(prev => prev.filter(c => c.id !== car.id));
                  }}
                  style={{
                    marginTop: '0.5rem',
                    color: '#ef4444',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                  title={car.isCustom ? 'Remove custom car' : 'Remove default car (up to 4 allowed)'}
                >
                  Remove
                </button>
              ) : (
                <div style={{ marginTop: '0.5rem', color: '#718096', fontSize: '0.85rem' }}>
                  ❌ Limit reached
                </div>
              )}
            </div>
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
            onChange={e => setNewCar({ ...newCar, name: e.target.value })}
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
            onChange={e => setNewCar({ ...newCar, description: e.target.value })}
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

      {/* Full-screen note modal */}
      {expandedNoteCarId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: darkMode ? '#2d3748' : 'white',
            color: darkMode ? '#cbd5e0' : '#2d3748',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: 500,
            width: '90vw',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Space Mono', monospace"
          }}>
            <input
            type="text"
            value={editingCar.name}
            onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })}
            placeholder="Car Name"
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              padding: '0.5rem',
              width: '100%',
              border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              background: darkMode ? '#4a5568' : '#edf2f7',
              color: darkMode ? 'white' : 'black'
            }}
          />
          
          <textarea
            value={editingCar.description}
            onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
            placeholder="Car Description"
            rows={2}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              width: '100%',
              fontSize: '1rem',
              border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              background: darkMode ? '#4a5568' : '#edf2f7',
              color: darkMode ? 'white' : 'black'
            }}
          />

            <textarea
              wrap="off"
              style={{
                minHeight: 160,
                padding: '1rem',
                fontSize: '1.1rem',
                width: '100%',
                border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                borderRadius: '0.5rem',
                background: darkMode ? '#4a5568' : '#edf2f7',
                color: darkMode ? 'white' : 'black',
                marginBottom: '1rem',
                resize: 'vertical',
                overflowX: 'auto',
                whiteSpace: 'pre',
                fontFamily: "'Space Mono', monospace"
              }}
              value={editingNote}
              onChange={e => setEditingNote(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={closeNoteModal}
                style={{
                  background: '#a0aec0',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNote(selectedCars.find(c => c.id === expandedNoteCarId))}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer'
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // Battle screen
  const renderBattleScreen = () => {
  const [left, right] = battles[battleIndex] || [];

  if (!left) return <p>No cars to compare.</p>;

  const cardStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#2d3748' : '#ffffff',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: 'fit-content',
    maxWidth: '100%',
    marginBottom: '1rem',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };
    
  const wrapperStyle = {
    height: '100vh', // fills full viewport height
    overflowY: 'auto', // only this scrolls
    padding: '4rem 2rem',
    backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
    color: darkMode ? '#e2e8f0' : '#2d3748',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
  };

  const battleAreaStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // vertical center of the shorter card
    gap: '2rem',
    flexWrap: 'wrap', // good for mobile responsiveness
  };

  return (
  <div style={wrapperStyle}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
      Round {Math.round(Math.log2(selectedCars.length / currentRound.length)) + 1}
    </h2>

    <div style={battleAreaStyle}>
      {/* Left Card */}
      <div
        style={cardStyle}
        onClick={() => selectWinner(left)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatCarName(left.name)}</h3>
        <p style={{ margin: '0.5rem 0' }}>{left.description}</p>
        <h4>Your Notes:</h4>
        <p style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}>
          {left.notes || 'No notes added.'}
        </p>
      </div>

      {/* VS Separator */}
      <div style={{ fontSize: '2rem', fontWeight: 'bold', userSelect: 'none' }}>VS</div>

      {/* Right Card */}
      <div
        style={cardStyle}
        onClick={() => selectWinner(right)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatCarName(right.name)}</h3>
        <p style={{ margin: '0.5rem 0' }}>{right.description}</p>
        <h4>Your Notes:</h4>
        <p style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}>
          {right.notes || 'No notes added.'}
        </p>
      </div>
    </div>
  </div>
);
};
    // Results screen
  const renderResultsScreen = () => {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
        color: darkMode ? '#cbd5e0' : '#2d3748',
        transition: 'background-color 0.3s, color 0.3s'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>Tournament Complete!</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            After a fierce competition, we've determined the best car.
          </p>
        </div>

        <div
          style={{
            backgroundColor: darkMode ? '#2d3748' : 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            textAlign: 'center',
            transition: 'all 0.3s',
            transform: 'translateY(0)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {formatCarName(winner?.name || 'Unknown')}
          </h3>
          <p style={{ marginBottom: '2rem' }}>
            {winner?.description || 'No car was selected as champion.'}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
              <p style={{ fontStyle: 'italic', fontFamily: "'Space Mono', monospace" }}>
              <span style={{ whiteSpace: 'pre-line' }}>
                {winner?.notes || 'No notes added.'}
              </span>
            </p>
          </div>
          <button
            onClick={resetGame}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6675ef',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

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
        fontFamily: "'Righteous', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
        color: darkMode ? '#cbd5e0' : '#2d3748',
        transition: 'background-color 0.3s, color 0.3s',
        overflowY: 'auto'
      }}>
      {/* Header */}
      <header style={{
      backgroundColor: darkMode ? '#2d3748' : 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '48px',
      fontSize: '1rem'
    }}>
      {/* Left: Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            marginLeft: '1rem',
            color: darkMode ? 'white' : '#2d3748' // ← important: set text color
          }}
        >
          <img src="/trophy.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h1 style={{
            fontFamily: "'Righteous', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            Car Champion
          </h1>
        </a>
      </div>
    
      {/* Right: Button */}
      <button
        onClick={resetGame}
        style={{
          marginRight: '0.5rem',
          backgroundColor: darkMode ? '#281940' : '#bbd4f0',
          color: darkMode ? '#cbd5e0' : '#2d3748',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          padding: '0.2rem 0.8rem',
          borderRadius: '4px'
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
