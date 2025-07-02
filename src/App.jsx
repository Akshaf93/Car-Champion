import { useState, useEffect } from 'react';

export default function App() {
  const [gameState, setGameState] = useState('start');
  const [selectedCars, setSelectedCars] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [battles, setBattles] = useState([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState([]);
  const [winner, setWinner] = useState(null);
  const [newCar, setNewCar] = useState({ name: '', description: '', notes: '' });

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

  const startTournament = () => setGameState('confirmEdit');
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
    localStorage.clear();
    setSelectedCars([...mockCars]);
    setCurrentRound([]);
    setBattles([]);
    setRoundWinners([]);
    setWinner(null);
    setGameState('start');
  };

  const updateNote = (id, note) => {
    const updated = selectedCars.map(car => car.id === id ? { ...car, notes: note } : car);
    setSelectedCars(updated);
  };

  const handleAddCustomCar = () => {
    if (!newCar.name.trim()) return;
    const id = Date.now();
    const newCarEntry = { id, ...newCar, isCustom: true };
    setSelectedCars(prev => [...prev, newCarEntry]);
    setNewCar({ name: '', description: '', notes: '' });
  };

  // Modern blue/indigo gradient for dark mode
  const gradient = 'linear-gradient(135deg, #181e31 0%, #222e50 40%, #3a3a6a 100%)';
  const cardBg = 'rgba(38, 45, 80, 0.95)';
  const accent = '#8ea5ff';
  const buttonGradient = 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)';

  const center = {
    minHeight: 'calc(100vh - 60px)',
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2vw',
    position: 'relative',
    textAlign: 'center',
  };

  // Small, modern button
  const modernButton = {
    marginTop: 24,
    padding: '0.55em 1.6em',
    fontSize: '1.05rem',
    fontWeight: 700,
    borderRadius: '1.7em',
    border: 'none',
    background: buttonGradient,
    color: '#fff',
    boxShadow: '0 2px 16px #232b4a66',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    transition: 'transform 0.13s, box-shadow 0.13s'
  };

  // Minimal logo, left-aligned, small
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '0.09em',
    color: '#b7cafc',
    gap: '0.5em'
  };

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: gradient,
      color: '#e4eaf2',
      fontFamily: 'Montserrat, Arial, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* HEADER */}
      <header style={{
        width: '100%',
        padding: '1.2rem 0 0.6rem 0',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: 'transparent'
      }}>
        <span style={{...logoStyle, marginLeft: 36}}>
          <span style={{fontSize: '1.4rem'}}>🏆</span>
          Car Champion
        </span>
      </header>

      {/* HERO / LANDING */}
      {gameState === 'start' && (
        <main style={center}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: 8,
            textAlign: 'center',
            lineHeight: 1.12,
            color: '#e4eaf2',
            textShadow: '0 2px 12px #202241'
          }}>
            Car Champion
          </div>
          <div style={{
            fontSize: '1.18rem',
            fontWeight: 400,
            textAlign: 'center',
            marginBottom: 20,
            color: '#b7cafc',
            textShadow: '0 1px 4px #161834'
          }}>
            Compare cars to find the best one to buy
          </div>
          <button
            onClick={startTournament}
            style={modernButton}
            onMouseOver={e => {e.currentTarget.style.transform='scale(1.07)';}}
            onMouseOut={e => {e.currentTarget.style.transform='scale(1)';}}
          >
            New Tournament
          </button>
        </main>
      )}

      {/* CONFIRM EDIT */}
      {gameState === 'confirmEdit' && (
        <main style={center}>
          <h2 style={{fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '1rem'}}>Ready to Begin?</h2>
          <p style={{fontSize: '1.07rem', marginBottom: 22, color: '#b7cafc'}}>You've selected {selectedCars.length} cars. Would you like to add or remove any?</p>
          <div style={{display: 'flex', gap: '1.15rem', justifyContent: 'center'}}>
            <button
              onClick={() => setGameState('edit')}
              style={{...modernButton, background: 'linear-gradient(90deg, #272c40, #3a3a6a 100%)'}}
            >Edit Cars</button>
            <button
              onClick={beginTournament}
              style={modernButton}
            >Start Tournament</button>
          </div>
        </main>
      )}

      {/* EDIT SCREEN */}
      {gameState === 'edit' && (
        <main style={center}>
          <div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.2rem', color: '#c1d1fa'}}>Customize Your Car List</h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              justifyContent: 'center'
            }}>
              {selectedCars.map(car => (
                <div key={car.id} style={{
                  background: cardBg,
                  borderRadius: '0.8rem',
                  boxShadow: '0 2px 16px #232b4a66',
                  padding: '1.3rem',
                  minWidth: '210px',
                  maxWidth: '300px',
                  color: '#fff',
                  fontSize: '1rem',
                  position: 'relative'
                }}>
                  <h4 style={{ fontWeight: 'bold', margin: 0 }}>{formatCarName(car.name)}</h4>
                  <p style={{ margin: '0.6rem 0' }}>{car.description}</p>
                  <textarea
                    placeholder="Add your notes..."
                    value={car.notes || ''}
                    onChange={(e) => updateNote(car.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      backgroundColor: '#2d3150',
                      color: 'white',
                      resize: 'none',
                      minHeight: '50px',
                      marginBottom: '0.7rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  {car.isCustom && (
                    <button
                      onClick={() => setSelectedCars(selectedCars.filter(c => c.id !== car.id))}
                      style={{
                        color: accent,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontWeight: 700,
                        position: 'absolute',
                        right: '1.2rem', top: '1.1rem'
                      }}
                    >✕</button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ margin: '2.1rem 0 1.1rem 0', width: '100%', maxWidth: 350 }}>
              <input
                type="text"
                name="name"
                placeholder="Car Name"
                value={newCar.name}
                onChange={e => setNewCar({...newCar, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  marginBottom: '0.4rem',
                  border: 'none',
                  borderRadius: '0.4rem',
                  background: '#262d50',
                  color: '#e4eaf2'
                }}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newCar.description}
                onChange={e => setNewCar({...newCar, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  marginBottom: '0.4rem',
                  border: 'none',
                  borderRadius: '0.4rem',
                  background: '#262d50',
                  color: '#e4eaf2'
                }}
              />
              <button
                onClick={handleAddCustomCar}
                disabled={!newCar.name.trim()}
                style={{
                  ...modernButton,
                  fontSize: '1rem',
                  opacity: !newCar.name.trim() ? 0.5 : 1,
                  cursor: !newCar.name.trim() ? 'not-allowed' : 'pointer',
                  marginTop: 8
                }}
              >Add Car</button>
            </div>
            <button
              onClick={beginTournament}
              style={modernButton}
            >Start Tournament</button>
          </div>
        </main>
      )}

      {/* TOURNAMENT BATTLE SCREEN */}
      {gameState === 'battle' && (
        <main style={center}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1.4rem 0', color: '#b7cafc' }}>
              Round {Math.round(Math.log2(mockCars.length / currentRound.length)) + 1}
            </div>
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {(battles[battleIndex] || []).map((car, i) => (
                <div
                  key={car.id}
                  style={{
                    background: cardBg,
                    borderRadius: '1rem',
                    boxShadow: '0 2px 16px #232b4a66',
                    padding: '1.2rem',
                    minWidth: '180px',
                    maxWidth: '280px',
                    color: '#fff',
                    fontSize: '1.07rem',
                    cursor: 'pointer',
                    transition: 'transform 0.18s',
                    textAlign: 'center'
                  }}
                  onClick={() => selectWinner(car)}
                  onMouseOver={e => {e.currentTarget.style.transform='scale(1.04)';}}
                  onMouseOut={e => {e.currentTarget.style.transform='scale(1)';}}
                >
                  <div style={{fontWeight: 700, fontSize: '1.14rem', marginBottom: 6}}>{formatCarName(car.name)}</div>
                  <div style={{marginBottom: 10}}>{car.description}</div>
                  <div style={{fontStyle: 'italic', opacity: 0.85}}>{car.notes || 'No notes.'}</div>
                </div>
              ))}
            </div>
            {battles[battleIndex] && battles[battleIndex].length === 2 &&
              <div style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                margin: '1.6vw 0',
                color: accent,
                animation: 'pulse 1.5s infinite'
              }}>VS</div>
            }
          </div>
        </main>
      )}

      {/* RESULTS / WINNER */}
      {gameState === 'results' && (
        <main style={center}>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '1.1rem',
              textShadow: '0 2px 10px #202241'
            }}>
              🏆 Winner: {formatCarName(winner?.name || 'Unknown')}
            </div>
            <div style={{
              background: cardBg,
              borderRadius: '1.3rem',
              boxShadow: '0 2px 16px #232b4a66',
              padding: '1.8rem 1.1rem',
              minWidth: '200px',
              maxWidth: '340px',
              color: '#fff',
              fontSize: '1.09rem',
              marginBottom: '1.6rem'
            }}>
              <div style={{marginBottom: 12}}>{winner?.description || ''}</div>
              <div style={{fontStyle: 'italic', opacity: 0.85}}>
                {winner?.notes ? <>Your notes: {winner.notes}</> : 'No notes for this car.'}
              </div>
            </div>
            <button
              onClick={resetGame}
              style={modernButton}
            >
              New Tournament
            </button>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer style={{
        width: '100%',
        padding: '1rem 0 0.5rem 0',
        textAlign: 'center',
        opacity: 0.7,
        background: 'transparent',
        color: '#b7cafc',
        fontWeight: 500,
        letterSpacing: '0.05em',
        fontSize: '0.98rem'
      }}>
        © {new Date().getFullYear()} Car Champion. All cars are for demonstration only.
      </footer>
    </div>
  );
}
