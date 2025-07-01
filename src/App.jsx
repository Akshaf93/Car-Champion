import { useState } from 'react';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'select', 'battle', 'results'
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleResults, setBattleResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [winner, setWinner] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Mock car data
  const mockCars = [
    {
      id: 1,
      name: 'Tesla Model S',
      description: 'All-electric luxury sedan with cutting-edge technology and exceptional performance.',
      notes: '',
      isCustom: false
    },
    {
      id: 2,
      name: 'Porsche 911',
      description: 'Iconic sports car with timeless design and thrilling driving dynamics.',
      notes: '',
      isCustom: false
    },
    {
      id: 3,
      name: 'Toyota Camry',
      description: 'Reliable mid-size sedan with proven dependability and comfortable ride.',
      notes: '',
      isCustom: false
    },
    {
      id: 4,
      name: 'Ford F-150',
      description: 'America\'s best-selling truck with impressive towing capacity and versatility.',
      notes: '',
      isCustom: false
    },
    {
      id: 5,
      name: 'Subaru WRX STI',
      description: 'High-performance all-wheel drive sports sedan with rally racing heritage.',
      notes: '',
      isCustom: false
    },
    {
      id: 6,
      name: 'BMW M3',
      description: 'Premium sports sedan with precise handling and powerful engine performance.',
      notes: '',
      isCustom: false
    },
    {
      id: 7,
      name: 'Honda Civic Type R',
      description: 'Affordable hot hatch with track-ready performance and sharp handling.',
      notes: '',
      isCustom: false
    },
    {
      id: 8,
      name: 'Mercedes-Benz S-Class',
      description: 'Luxury flagship sedan with opulent interior and advanced technology features.',
      notes: '',
      isCustom: false
    },
  ];

  useEffect(() => {
    setCars(mockCars);
  }, []);

  // Start the tournament
  const startTournament = () => {
    setSelectedCars([...mockCars]);
    setGameState('confirmEdit');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Format car name
  const formatCarName = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Pad selected cars with "Bye" if necessary
  const padToNextPowerOfTwo = (cars) => {
    const nextPower = Math.pow(2, Math.ceil(Math.log2(cars.length)));
    const padding = Array.from({ length: nextPower - cars.length }).map((_, i) => ({
      id: `bye-${i}`,
      name: 'Bye',
      description: 'Automatically advances to the next round.',
      notes: '',
      isBye: true
    }));
    return [...cars, ...padding];
  };

  // Begin the tournament
  const beginTournament = () => {
    const paddedCars = padToNextPowerOfTwo(selectedCars);
    setCurrentRound(paddedCars);
    setGameState('loading');
  };

  // Start the next battle
  const startNextBattle = () => {
    if (currentRound.length > 1) {
      const nextBattles = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        if (i + 1 < currentRound.length) {
          nextBattles.push([currentRound[i], currentRound[i + 1]]);
        } else {
          nextBattles.push([currentRound[i]]);
        }
      }

      setCurrentStep(0);
      setCurrentBattle(nextBattles[0]);
      setGameState('battle');
    } else {
      setWinner(currentRound[0]);
      setGameState('results');
    }
  };

  // Effect to trigger battle after setting currentRound
  useEffect(() => {
    if (gameState === 'loading' && currentRound.length > 0) {
      setTimeout(() => {
        startNextBattle();
      }, 500);
    }
  }, [gameState, currentRound]);

  // Handle car selection
  const toggleCarSelection = (car) => {
    const isSelected = selectedCars.some(c => c.id === car.id);
    if (isSelected) {
      setSelectedCars(prev => prev.filter(c => c.id !== car.id));
    } else {
      setSelectedCars(prev => [...prev, car]);
    }
  };

  // Add custom car
  const [newCar, setNewCar] = useState({
    name: '',
    description: '',
    notes: ''
  });

  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;

    const id = Date.now(); // unique ID
    const newCarEntry = {
      id,
      ...newCar,
      isCustom: true
    };
    const updatedCars = [...cars, newCarEntry];
    setCars(updatedCars);
    setSelectedCars(prev => [...prev, newCarEntry]);
    setNewCar({
      name: '',
      description: '',
      notes: ''
    });
  };

  // Update car notes
  const updateNote = (id, note) => {
    const updated = selectedCars.map(car =>
      car.id === id ? { ...car, notes: note } : car
    );
    setSelectedCars(updated);
  };

  // Reset game
  const resetGame = () => {
    setSelectedCars([]);
    setCurrentRound([]);
    setCurrentBattle(null);
    setBattleResults([]);
    setCurrentStep(0);
    setWinner(null);
    setGameState('start');
  };

  // Handle selecting a winner
  const selectWinner = (car) => {
    const results = [...battleResults];
    results.push(car);
    setBattleResults(results);

    if (currentStep + 1 < Math.ceil(currentRound.length / 2)) {
      setCurrentStep(currentStep + 1);
      setCurrentBattle([
        currentRound[currentStep * 2 + 2],
        currentRound[currentStep * 2 + 3]
      ]);
    } else {
      setCurrentRound(results);
      setBattleResults([]);
      startNextBattle();
    }
  };

  // Render loading screen
  const renderLoadingScreen = () => (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <div style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #7c3aed',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p style={{ marginTop: '16px', fontSize: '1rem' }}>Preparing the tournament...</p>
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
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #4f46e5, #9333ea)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}>
        Car Champion
      </h1>
      <p style={{
        fontSize: '1.25rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        We've auto-selected all available cars. Would you like to edit the list before starting?
      </p>
      <button
        onClick={startTournament}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#6675ef',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1.125rem',
          cursor: 'pointer'
        }}
      >
        Start Tournament
      </button>
    </div>
  );

  // Confirm Edit Screen
  const renderConfirmEditScreen = () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: darkMode ? '#1a202c' : '#f7fafc',
      color: darkMode ? '#cbd5e0' : '#2d3748',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        Ready to Begin?
      </h2>
      <p style={{
        fontSize: '1.25rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        You've selected {selectedCars.length} cars. Would you like to add or remove any cars?
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
        description: newCar.description || 'No description provided.',
        notes: '',
        isCustom: true
      };
      const updatedCars = [...cars, newCarEntry];
      setCars(updatedCars);
      setSelectedCars(prev => [...prev, newCarEntry]);
      setNewCar({
        name: '',
        description: '',
        notes: ''
      });
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
        }}>
          Customize Your Car List
        </h2>

        {/* Selected Cars */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Selected Cars
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {selectedCars.map(car => (
              <div key={car.id} style={{
                backgroundColor: darkMode ? '#2d3748' : 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '400px'
              }}>
                <h4 style={{ fontWeight: 'bold' }}>{formatCarName(car.name)}</h4>
                <p style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>
                  {car.description}
                </p>
                <textarea
                  placeholder="Add your notes..."
                  value={car.notes || ''}
                  onChange={(e) => updateNote(car.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                    borderRadius: '0.375rem',
                    marginTop: '0.5rem',
                    backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                    color: darkMode ? 'white' : 'black'
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

        {/* Add New Car */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Add New Car
          </h3>
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
                borderRadius: '0.375rem',
                border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
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
                borderRadius: '0.375rem',
                border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0',
                backgroundColor: darkMode ? '#4a5568' : '#edf2f7',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <button
              onClick={handleAddCar}
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
              backgroundColor: '#6675ef',
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
    if (!currentBattle) return renderLoadingScreen();

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
          Round {Math.log2(selectedCars.length / currentRound.length) + 1}
        </h2>

        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', alignItems: 'center' }}>
          {/* Left car */}
          <div
            onClick={() => selectWinner(currentBattle[0])}
            style={{
              cursor: 'pointer',
              backgroundColor: darkMode ? '#2d3748' : 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              flex: '1',
              minWidth: '300px',
              maxWidth: '600px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatCarName(currentBattle[0].name)}
            </h3>
            <p style={{ fontSize: '1rem', margin: '1rem 0' }}>
              {currentBattle[0].description}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
              <p style={{ fontStyle: 'italic' }}>
                {currentBattle[0].notes || 'No notes added.'}
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
              <p>Select the car you think is better based on your preferences</p>
            </div>
          </div>

          {/* Right car */}
          <div
            onClick={() => currentBattle[1] && selectWinner(currentBattle[1])}
            style={{
              cursor: currentBattle[1] ? 'pointer' : 'default',
              backgroundColor: darkMode ? '#2d3748' : 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              flex: '1',
              minWidth: '300px',
              maxWidth: '600px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {currentBattle[1] ? formatCarName(currentBattle[1].name) : 'Bye'}
            </h3>
            {currentBattle[1] && (
              <>
                <p style={{ fontSize: '1rem', margin: '1rem 0' }}>
                  {currentBattle[1].description}
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
                  <p style={{ fontStyle: 'italic' }}>
                    {currentBattle[1].notes || 'No notes added.'}
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Tournament Complete!
          </h2>
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
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {formatCarName(winner.name)}
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            {winner.description}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Notes:</h4>
            <p style={{ fontStyle: 'italic' }}>
              {winner.notes || 'No notes added.'}
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
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: darkMode ? '#2d3748' : 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🚗</span>
          <h1 style={{ fontWeight: 'bold' }}>Car Champion</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: 'transparent',
              color: darkMode ? '#cbd5e0' : '#2d3748',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            New Tournament
          </button>
          <DarkModeToggle />
        </div>
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

      {/* Footer */}
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
    </div>
  );
}
