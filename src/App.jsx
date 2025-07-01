import { useState, useEffect } from 'react';

export default function App() {
  const [gameState, setGameState] = useState('start');
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleResults, setBattleResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [winner, setWinner] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Form state for adding new car
  const [newCar, setNewCar] = useState({
    name: '',
    description: '',
    notes: '',
    image: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCars = JSON.parse(localStorage.getItem('cars')) || mockCars;
    const savedSelected = JSON.parse(localStorage.getItem('selectedCars')) || [...savedCars];

    setCars(savedCars);
    setSelectedCars(savedSelected);
  }, []);

  // Save selected cars and notes to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCars', JSON.stringify(selectedCars));
  }, [selectedCars]);

  // Mock car data
  const mockCars = [
    {
      id: 1,
      name: 'Tesla Model S',
      image: 'https://placehold.co/600x400?text=Tesla+Model+S',
      description: 'All-electric luxury sedan.',
      notes: '',
      isCustom: false
    },
    {
      id: 2,
      name: 'Porsche 911',
      image: ' https://placehold.co/600x400?text=Porsche+911',
      description: 'Iconic sports car.',
      notes: '',
      isCustom: false
    },
    {
      id: 3,
      name: 'Toyota Camry',
      image: ' https://placehold.co/600x400?text=Toyota+Camry',
      description: 'Reliable mid-size sedan.',
      notes: '',
      isCustom: false
    },
    {
      id: 4,
      name: 'Ford F-150',
      image: ' https://placehold.co/600x400?text=Ford+F-150',
      description: 'America\'s best-selling truck.',
      notes: '',
      isCustom: false
    },
    {
      id: 5,
      name: 'Subaru WRX STI',
      image: ' https://placehold.co/600x400?text=Subaru+WRX+STI',
      description: 'High-performance rally-inspired sedan.',
      notes: '',
      isCustom: false
    },
    {
      id: 6,
      name: 'BMW M3',
      image: ' https://placehold.co/600x400?text=BMW+M3',
      description: 'Premium sports sedan.',
      notes: '',
      isCustom: false
    },
    {
      id: 7,
      name: 'Honda Civic Type R',
      image: ' https://placehold.co/600x400?text=Honda+Civic+Type+R',
      description: 'Affordable hot hatch.',
      notes: '',
      isCustom: false
    },
    {
      id: 8,
      name: 'Mercedes-Benz S-Class',
      image: ' https://placehold.co/600x400?text=Mercedes-Benz+S-Class',
      description: 'Luxury flagship sedan.',
      notes: '',
      isCustom: false
    }
  ];

  // Format car name
  const formatCarName = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Start the tournament
  const startTournament = () => {
    setGameState('confirmEdit');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Pad selected cars with "Bye" if necessary
  const padToNextPowerOfTwo = (cars) => {
    const nextPower = Math.pow(2, Math.ceil(Math.log2(cars.length)));
    const padding = Array.from({ length: nextPower - cars.length }).map((_, i) => ({
      id: `bye-${i}`,
      name: 'Bye',
      image: ' https://placehold.co/600x400?text=Bye',
      description: 'Automatically advances.',
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
  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;

    const id = Date.now(); // unique ID
    const newCarEntry = {
      id,
      ...newCar,
      image: newCar.image || ` https://placehold.co/600x400?text=${encodeURIComponent(newCar.name)}`,
      isCustom: true
    };
    const updatedCars = [...cars, newCarEntry];
    setCars(updatedCars);
    setSelectedCars(prev => [...prev, newCarEntry]);
    setNewCar({
      name: '',
      description: '',
      notes: '',
      image: ''
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
    localStorage.clear();
    setSelectedCars([...mockCars]);
    setCars(mockCars);
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-300">Preparing the tournament...</p>
    </div>
  );

  // Start screen
  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Car Champion
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-2xl">
        We've auto-selected all available cars. Would you like to edit the list before starting?
      </p>
      <button
        onClick={startTournament}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-300 text-xl font-semibold"
      >
        Start Tournament
      </button>
    </div>
  );

  // Confirm Edit Screen
  const renderConfirmEditScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Ready to Begin?
      </h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
        You've selected {selectedCars.length} cars. Would you like to add or remove any cars?
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => setGameState('edit')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Edit Cars
        </button>
        <button
          onClick={beginTournament}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
      if (newCar.name.trim()) {
        handleAddCustomCar();
      }
    };

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Customize Your Car List
          </h2>

          {/* Selected Cars */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Selected Cars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCars.map(car => (
                <div key={car.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <img src={car.image} alt={car.name} className="w-full h-32 object-cover rounded mb-2" />
                  <h4 className="font-bold">{formatCarName(car.name)}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{car.description}</p>
                  <textarea
                    placeholder="Add your notes..."
                    value={car.notes || ''}
                    onChange={(e) => updateNote(car.id, e.target.value)}
                    className="w-full mt-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  {car.isCustom && (
                    <button
                      onClick={() => {
                        setSelectedCars(selectedCars.filter(c => c.id !== car.id));
                        setCars(cars.filter(c => c.id !== car.id));
                      }}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Car */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Add New Car</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <input
                type="text"
                name="name"
                placeholder="Car Name"
                value={newCar.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newCar.description}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL (optional)"
                value={newCar.image}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
              />
              <button
                onClick={handleAddCar}
                disabled={!newCar.name.trim()}
                className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${!newCar.name.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Add Car
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={beginTournament}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Start Tournament
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Battle screen
  const renderBattleScreen = () => {
    if (!currentBattle) return renderLoadingScreen();

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Round {Math.log2(selectedCars.length / currentRound.length) + 1}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left car */}
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => selectWinner(currentBattle[0])}
            >
              <img src={currentBattle[0].image} alt={currentBattle[0].name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{formatCarName(currentBattle[0].name)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{currentBattle[0].description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Your Notes:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentBattle[0].notes || 'No notes added.'}
                  </p>
                </div>
              </div>
            </div>

            {/* VS separator */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-400 dark:text-gray-500 mb-4">VS</div>
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select the car you think is better based on your preferences
                </p>
              </div>
            </div>

            {/* Right car */}
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => currentBattle[1] && selectWinner(currentBattle[1])}
            >
              <img
                src={currentBattle[1]?.image || ' https://placehold.co/600x400?text=Bye'}
                alt={currentBattle[1]?.name || 'Bye'}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">
                  {currentBattle[1] ? formatCarName(currentBattle[1].name) : 'Bye'}
                </h3>
                {currentBattle[1] && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{currentBattle[1].description}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Your Notes:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentBattle[1].notes || 'No notes added.'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Results screen
  const renderResultsScreen = () => {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Tournament Complete!
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              After a fierce competition, we've determined the best car.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mx-auto max-w-3xl">
            <img src={winner.image} alt={winner.name} className="w-full h-64 object-cover" />
            <div className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="text-yellow-400 text-4xl mr-2">🏆</div>
                <h3 className="text-3xl font-bold">{formatCarName(winner.name)}</h3>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{winner.description}</p>
              <div className="mb-8">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">Your Notes</h4>
                <p className="text-gray-600 dark:text-gray-400 text-center">{winner.notes || 'No notes added.'}</p>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-300"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dark Mode Toggle Component
  const DarkModeToggle = () => (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg z-10 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 6.343l-.707.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0112 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9h14M5 15h14M5 11h14M5 13h14M12 2L12 4M12 20v2M21 12h2M1 12h2M19 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Car Champion</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetGame}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                New Tournament
              </button>
              <DarkModeToggle />
            </div>
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
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © 2023 Car Champion. Data is stored locally using browser memory. No server needed.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
