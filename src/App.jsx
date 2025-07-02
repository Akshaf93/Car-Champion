import { useState, useEffect } from 'react';

export default function App() {
  // --- State ---
  const [gameState, setGameState] = useState('start');
  const [selectedCars, setSelectedCars] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [battles, setBattles] = useState([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState([]);
  const [winner, setWinner] = useState(null);
  const [newCar, setNewCar] = useState({ name: '', description: '', notes: '' });

  // --- Demo Cars ---
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

  // --- Load on Mount ---
  useEffect(() => {
    const savedSelected = JSON.parse(localStorage.getItem('selectedCars')) || [...mockCars];
    setSelectedCars(savedSelected);
  }, []);

  // --- Utility ---
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

  // --- Actions ---
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

  // --- Styles ---
  const gradient = 'linear-gradient(120deg, #6546e5 0%, #a347e8 50%, #ff5773 100%)';
  const cardBg = 'rgba(30, 16, 60, 0.90)';
  const lightCardBg = 'rgba(255,255,255,0.95)';
  const accent = '#ff5773';

  // --- Render ---
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: gradient,
      color: '#fff',
      fontFamily: 'Montserrat, Arial, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* HEADER */}
      <header style={{
        width: '100%',
        padding: '2rem 4vw 1rem 4vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
        position: 'relative',
        background: 'transparent'
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 900,
          fontSize: '2rem',
          letterSpacing: '0.08em'
        }}>
          <span style={{
            fontSize: '2.4rem',
            marginRight: '1rem'
          }}>🏆</span> CAR
        </span>
        <nav style={{
          display: 'flex',
          gap: '2.5rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          fontSize: '1.1rem'
        }}>
          <span style={{opacity: 0.85, cursor: 'pointer'}}>About</span>
          <span style={{opacity: 0.85, cursor: 'pointer'}}>Compare</span>
          <span style={{opacity: 0.85, cursor: 'pointer'}}>Sign Up</span>
        </nav>
      </header>

      {/* HERO / LANDING */}
      {gameState === 'start' && (
        <main style={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4vw',
          position: 'relative'
        }}>
          <div style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            marginTop: '2.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '0 2px 24px #4921a3cc'
          }}>
            CAR<br/>CHAMPION
          </div>
          <div style={{
            fontSize: 'clamp(1.1rem, 2vw, 2rem)',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '2.5rem',
            textShadow: '0 2px 8px #4921a3cc'
          }}>
            Compare cars to find the best one to buy
          </div>
          <button
            onClick={startTournament}
            style={{
              marginTop: '2vw',
              padding: '1.2em 3em',
              fontSize: '2rem',
              fontWeight: 800,
              borderRadius: '2.5em',
              border: 'none',
              background: 'linear-gradient(90deg, #ff7b6c 0%, #ffb86c 100%)',
              color: '#fff',
              boxShadow: '0 8px 32px #4921a399, 0 2px 8px #ffb86c77',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={e => {e.currentTarget.style.transform='scale(1.05)';}}
            onMouseOut={e => {e.currentTarget.style.transform='scale(1)';}}
          >
            NEW TOURNAMENT
          </button>
        </main>
      )}

      {/* CONFIRM EDIT */}
      {gameState === 'confirmEdit' && (
        <main style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '70vh', justifyContent: 'center'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.06em', marginBottom: '1rem'}}>Ready to Begin?</h2>
          <p style={{fontSize: '1.25rem', marginBottom: '2rem'}}>You've selected {selectedCars.length} cars. Would you like to add or remove any?</p>
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <button
              onClick={() => setGameState('edit')}
              style={{
                padding: '1em 2em',
                borderRadius: '2em',
                background: 'linear-gradient(90deg, #6546e5, #a347e8)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #4921a377'
              }}
            >Edit Cars</button>
            <button
              onClick={beginTournament}
              style={{
                padding: '1em 2em',
                borderRadius: '2em',
                background: 'linear-gradient(90deg, #ff7b6c 0%, #ffb86c 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #4921a377'
              }}
            >Start Tournament</button>
          </div>
        </main>
      )}

      {/* EDIT SCREEN */}
      {gameState === 'edit' && (
        <main style={{
          minHeight: '70vh',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>Customize Your Car List</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center'
          }}>
            {selectedCars.map(car => (
              <div key={car.id} style={{
                background: cardBg,
                borderRadius: '1rem',
                boxShadow: '0 6px 24px #4921a355',
                padding: '1.5rem',
                minWidth: '230px',
                maxWidth: '340px',
                color: '#fff',
                fontSize: '1.08rem',
                position: 'relative'
              }}>
                <h4 style={{ fontWeight: 'bold', margin: 0 }}>{formatCarName(car.name)}</h4>
                <p style={{ margin: '0.75rem 0' }}>{car.description}</p>
                <textarea
                  placeholder="Add your notes..."
                  value={car.notes || ''}
                  onChange={(e) => updateNote(car.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: '#3a2770',
                    color: 'white',
                    resize: 'none',
                    minHeight: '60px',
                    marginBottom: '1rem',
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
                      right: '1.5rem', top: '1.2rem'
                    }}
                  >✕</button>
                )}
              </div>
            ))}
          </div>
          <div style={{ margin: '2.5rem 0 1.5rem 0', width: '100%', maxWidth: 400 }}>
            <input
              type="text"
              name="name"
              placeholder="Car Name"
              value={newCar.name}
              onChange={e => setNewCar({...newCar, name: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#f7f0ff',
                color: '#2d1850'
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
                padding: '0.75rem',
                marginBottom: '0.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#f7f0ff',
                color: '#2d1850'
              }}
            />
            <button
              onClick={handleAddCustomCar}
              disabled={!newCar.name.trim()}
              style={{
                padding: '0.7em 2.2em',
                borderRadius: '2em',
                border: 'none',
                background: 'linear-gradient(90deg, #ff7b6c 0%, #ffb86c 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: !newCar.name.trim() ? 'not-allowed' : 'pointer',
                opacity: !newCar.name.trim() ? 0.5 : 1,
                marginTop: 6
              }}
            >Add Car</button>
          </div>
          <button
            onClick={beginTournament}
            style={{
              marginTop: 20,
              padding: '1em 2.5em',
              borderRadius: '2.5em',
              background: 'linear-gradient(90deg, #ff7b6c 0%, #ffb86c 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.2rem',
              border: 'none',
              boxShadow: '0 2px 8px #4921a377',
              letterSpacing: '0.08em',
              cursor: 'pointer'
            }}
          >START TOURNAMENT</button>
        </main>
      )}

      {/* TOURNAMENT BATTLE SCREEN */}
      {gameState === 'battle' && (
        <main style={{
          minHeight: '70vh',
          padding: '2rem 1rem 1rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 2rem 0' }}>
            Round {Math.round(Math.log2(mockCars.length / currentRound.length)) + 1}
          </div>
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {(battles[battleIndex] || []).map((car, i) => (
              <div
                key={car.id}
                style={{
                  background: cardBg,
                  borderRadius: '1.5rem',
                  boxShadow: '0 6px 24px #4921a355',
                  padding: '1.8rem',
                  minWidth: '230px',
                  maxWidth: '330px',
                  color: '#fff',
                  fontSize: '1.12rem',
                  cursor: 'pointer',
                  transition: 'transform 0.25s',
                  textAlign: 'center'
                }}
                onClick={() => selectWinner(car)}
                onMouseOver={e => {e.currentTarget.style.transform='scale(1.03)';}}
                onMouseOut={e => {e.currentTarget.style.transform='scale(1)';}}
              >
                <div style={{fontWeight: 700, fontSize: '1.35rem', marginBottom: 6}}>{formatCarName(car.name)}</div>
                <div style={{marginBottom: 12}}>{car.description}</div>
                <div style={{fontStyle: 'italic', opacity: 0.85}}>{car.notes || 'No notes.'}</div>
              </div>
            ))}
          </div>
          {battles[battleIndex] && battles[battleIndex].length === 2 &&
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              margin: '2vw 0',
              color: accent,
              animation: 'pulse 1.5s infinite'
            }}>VS</div>
          }
        </main>
      )}

      {/* RESULTS / WINNER */}
      {gameState === 'results' && (
        <main style={{
          minHeight: '70vh',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            marginBottom: '1.2rem',
            textShadow: '0 2px 18px #4921a3cc'
          }}>
            🏆 Winner: {formatCarName(winner?.name || 'Unknown')}
          </div>
          <div style={{
            background: cardBg,
            borderRadius: '1.5rem',
            boxShadow: '0 6px 24px #4921a355',
            padding: '2.5rem 2rem',
            minWidth: '260px',
            maxWidth: '420px',
            color: '#fff',
            fontSize: '1.14rem',
            marginBottom: '2rem'
          }}>
            <div style={{marginBottom: 12}}>{winner?.description || ''}</div>
            <div style={{fontStyle: 'italic', opacity: 0.85}}>
              {winner?.notes ? <>Your notes: {winner.notes}</> : 'No notes for this car.'}
            </div>
          </div>
          <button
            onClick={resetGame}
            style={{
              marginTop: 10,
              padding: '1.2em 3em',
              fontSize: '2rem',
              fontWeight: 800,
              borderRadius: '2.5em',
              border: 'none',
              background: 'linear-gradient(90deg, #ff7b6c 0%, #ffb86c 100%)',
              color: '#fff',
              boxShadow: '0 8px 32px #4921a399, 0 2px 8px #ffb86c77',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={e => {e.currentTarget.style.transform='scale(1.05)';}}
            onMouseOut={e => {e.currentTarget.style.transform='scale(1)';}}
          >
            NEW TOURNAMENT
          </button>
        </main>
      )}

      {/* FOOTER */}
      <footer style={{
        width: '100%',
        padding: '1rem 0',
        textAlign: 'center',
        opacity: 0.8,
        background: 'transparent',
        color: '#e7e5f5',
        fontWeight: 500,
        letterSpacing: '0.06em'
      }}>
        © {new Date().getFullYear()} Car Champion. All cars are for demonstration only.
      </footer>
    </div>
  );
}
