import { useState, useEffect } from 'react';

export default function App() {
  // Game states: start → confirmEdit → edit → battle → results
  const [gameState, setGameState] = useState('start');

  // Car data
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);

  // Tournament state
  const [currentRound, setCurrentRound] = useState([]);     // Cars in current round
  const [battles, setBattles] = useState([]);              // Battles array for current round
  const [battleIndex, setBattleIndex] = useState(0);        // Which battle we're on
  const [roundWinners, setRoundWinners] = useState([]);    // Winners of current round
  const [winner, setWinner] = useState(null);

  // Dark mode defaults to true now
  const [darkMode, setDarkMode] = useState(true);

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

  // Load saved selections
  useEffect(() => {
    const savedSelected = JSON.parse(localStorage.getItem('selectedCars')) || [...mockCars];
    setSelectedCars(savedSelected);
  }, []);

  // Format car names
  const formatCarName = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Pad to next power of two
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

  // Generate battles
  const generateBattles = (roundCars) => {
    const newBattles = [];
    for (let i = 0; i < roundCars.length; i += 2) {
      if (i + 1 < roundCars.length) {
        newBattles.push([roundCars[i], roundCars[i + 1]]);
      } else {
        newBattles.push([roundCars[i]]); // Odd one out
      }
    }
    return newBattles;
  };

  // Start tournament flow
  const startTournament = () => {
    setGameState('confirmEdit');
  };

  // Confirm edit -> begin tournament
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

  // Select winner of current battle
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

  // Reset game
  const resetGame = () => {
    localStorage.clear();
    setSelectedCars([...mockCars]);
    setCars(mockCars);
    setCurrentRound([]);
    setBattles([]);
    setRoundWinners([]);
    setWinner(null);
    setGameState('start');
  };

  // Add custom car
  const [newCar, setNewCar] = useState({ name: '', description: '', notes: '' });

  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;

    const id = Date.now(); // unique ID
    const newCarEntry = {
      id,
      ...newCar,
      isCustom: true
    };
    setSelectedCars(prev => [...prev, newCarEntry]);
    setCars(prev => [...prev, newCarEntry]);
    setNewCar({ name: '', description: '', notes: '' });
  };

  // Update note
  const updateNote = (id, note) => {
    const updated = selectedCars.map(car =>
      car.id === id ? { ...car, notes: note } : car
    );
    setSelectedCars(updated);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle car selection in edit screen
  const toggleCarSelection = (car) => {
    const isSelected = selectedCars.some(c => c.id === car.id);
    if (isSelected) {
      setSelectedCars(prev => prev.filter(c => c.id !== car.id));
    } else {
      setSelectedCars(prev => [...prev, car]);
    }
  };

  // Render Loading Screen
  const renderLoadingScreen = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
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
  // Start screen
const renderStartScreen = () => (
  <div style={{
    minHeight: '100vh',
    padding: '2rem', // Reduced padding
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
      textAlign: 'center', // Centered title
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

  // Confirm Edit Screen
  const renderConfirmEditScreen = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      transition: 'background-color 0.3s, color 0.3s',
      padding: '2rem'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Ready to Begin?
      </h2>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
        You've selected {selectedCars.length} cars. Would you like to add or remove any?
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setGameState('edit')}
          style={{
            padding: '0.75rem 1.5rem',
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

  // Edit Screen
  const renderEditScreen = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewCar({ ...newCar, [name]: value });
    };

    const handleAddCar = () => {
      if (!newCar.name.trim()) return;

      const id = Date.now(); // unique ID
      const newCarEntry = {
        id,
        ...newCar,
        isCustom: true
      };
      setSelectedCars(prev => [...prev, newCarEntry]);
      setCars(prev => [...prev, newCarEntry]);
      setNewCar({ name: '', description: '', notes: '' });
    };

    return (
      <div style={{
        minHeight: '100vh',
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
              <div key={car.id} style={{
                backgroundColor: darkMode ? '#2d3748' : 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                minWidth: '250px',
                maxWidth: '400px',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: 'translateY(0)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <h4 style={{ fontWeight: 'bold' }}>{formatCarName(car.name)}</h4>
                <p style={{ margin: '0.5rem 0' }}>{car.description}</p>
                <textarea
                  placeholder="Add your notes..."
                  value={car.notes || ''}
                  onChange={(e) => updateNote(car.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                    borderRadius: '0.375rem',
                    backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                    color: darkMode ? 'white' : 'black',
                    marginTop: '0.5rem'
                  }}
                />
                {car.isCustom && (
                  <button
                    onClick={() => {
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

  // Battle screen
  const renderBattleScreen = () => {
    const [left, right] = battles[battleIndex] || [];

    if (!left) {
      console.warn("No left car found", { battleIndex, battles });
      return <p>No cars to compare.</p>;
    }

    return (
      <div style={{
        minHeight: '100vh',
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
        }}>
          Round {Math.round(Math.log2(selectedCars.length / currentRound.length)) + 1}
        </h2>

        <div style={{
          display: 'flex',
          gap: '2rem',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Left car */}
          <div
            onClick={() => selectWinner(left)}
            style={{
              cursor: 'pointer',
              backgroundColor: darkMode ? '#2d3748' : 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minWidth: '300px',
              maxWidth: '600px',
              textAlign: 'center',
              transition: 'all 0.3s',
              transform: 'translateY(0)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatCarName(left.name)}
            </h3>
            <p style={{ margin: '1rem 0' }}>
              {left.description}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
              <p style={{ fontStyle: 'italic' }}>
                {left.notes || 'No notes added.'}
              </p>
            </div>
          </div>

          {/* VS separator */}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>VS</div>
            <div style={{
              backgroundColor: darkMode ? '#2d3748' : '#edf2f7',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <p>Select the better car based on your preferences</p>
            </div>
          </div>

          {/* Right car */}
          <div
            onClick={() => right && selectWinner(right)}
            style={{
              cursor: right ? 'pointer' : 'default',
              backgroundColor: darkMode ? '#2d3748' : 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minWidth: '300px',
              maxWidth: '600px',
              textAlign: 'center',
              transition: 'all 0.3s',
              transform: 'translateY(0)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            onMouseOver={(e) => {
              if (right) {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (right) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {right ? formatCarName(right.name) : 'Bye'}
            </h3>
            {right && (
              <>
                <p style={{ margin: '1rem 0' }}>
                  {right.description}
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
                  <p style={{ fontStyle: 'italic' }}>
                    {right.notes || 'No notes added.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Results screen
  const renderResultsScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
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

        <div style={{
          backgroundColor: darkMode ? '#2d3748' : 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.3s',
          transform: 'translateY(0)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
            <p style={{ fontStyle: 'italic' }}>
              {winner?.notes || 'No notes added.'}
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

  // Dark Mode Toggle Component
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
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        width: '100%',
        backgroundColor: darkMode ? '#2d3748' : 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🚗</span>
          <h1 style={{
            fontWeight: 'bold',
            color: darkMode ? 'white' : 'black'
          }}>Car Champion</h1>
        </div>
        <button
          onClick={resetGame}
          style={{
            backgroundColor: darkMode ? '#281940' : '#bbd4f0',
            color: darkMode ? '#cbd5e0' : '#2d3748',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          New Tournament
        </button>
      </header>

      {/* Main Content */}
      <main>
        {gameState === 'start' && renderStartScreen()}
        {gameState === 'confirmEdit' && renderConfirmEditScreen()}
        {gameState === 'edit' && renderEditScreen()}
        {gameState === 'loading' && renderLoadingScreen()}
        {gameState === 'battle' && renderBattleScreen()}
        {gameState === 'results' && renderResultsScreen()}
      </main>

      <footer style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        textAlign: 'center',
        backgroundColor: darkMode ? '#2d3748' : '#edf2f7'
      }}>
        <p style={{ fontSize: '0.875rem', color: darkMode ? '#a0aec0' : '#718096' }}>
          © 2023 Car Champion. All cars are for demonstration purposes only.
        </p>
      </footer>

      <DarkModeToggle />
    </div>
  );
}
