import { useState, useEffect } from "react";

const games = [
  {
    id: "tictactoe",
    icon: "✕",
    title: "Tic Tac Toe",
    color: "#e2c060"
  },
  {
    id: "number-target",
    icon: "∑",
    title: "Number Target",
    color: "#7dd3c7"
  },
  {
    id: "connect-four",
    icon: "◉",
    title: "Connect Four",
    color: "#ef7768"
  }
];

function TicTacToeBoard({ interactive }) {
  const [cells, setCells] = useState(["X", "O", "X", "O", "X", "", "O", "", ""]);
  const [highlight, setHighlight] = useState([0, 4, 8]);

  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      const patterns = [
        { cells: ["X", "O", "X", "O", "X", "", "O", "", ""], win: [0, 4, 8] },
        { cells: ["O", "X", "O", "X", "X", "X", "", "O", ""], win: [3, 4, 5] },
        { cells: ["X", "", "O", "X", "O", "", "X", "O", ""], win: [0, 3, 6] },
      ];
      const random = patterns[Math.floor(Math.random() * patterns.length)];
      setCells(random.cells);
      setHighlight(random.win);
    }, 2500);
    return () => clearInterval(interval);
  }, [interactive]);

  return (
    <div className="game-board ttt-board">
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`ttt-cell ${highlight.includes(i) ? "win" : ""} ${cell === "X" ? "x" : cell === "O" ? "o" : ""}`}
        >
          {cell}
        </div>
      ))}
    </div>
  );
}

function NumberTargetBoard({ interactive }) {
  const [current, setCurrent] = useState(89);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      const add = Math.floor(Math.random() * 10) + 1;
      setAdding(add);
      setTimeout(() => {
        setCurrent(prev => {
          const next = prev + add;
          return next >= 100 ? Math.floor(Math.random() * 30) + 50 : next;
        });
        setAdding(null);
      }, 600);
    }, 2000);
    return () => clearInterval(interval);
  }, [interactive]);

  return (
    <div className="game-board number-board">
      <div className="number-display">
        <span className="current-num">{current}</span>
        <span className="target-num">/100</span>
        {adding && <span className="adding-num">+{adding}</span>}
      </div>
      <div className="number-pills">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <span key={n} className={`pill ${adding === n ? "active" : ""}`}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConnectFourBoard({ interactive }) {
  const [discs, setDiscs] = useState(() => {
    const initial = Array(42).fill(null);
    [35, 36, 37, 38, 28, 29, 30, 21, 22, 14].forEach((i, idx) => {
      initial[i] = idx % 2 === 0 ? "red" : "yellow";
    });
    return initial;
  });
  const [falling, setFalling] = useState(null);

  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      const emptyCols = [];
      for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
          if (!discs[row * 7 + col]) {
            emptyCols.push({ col, row, idx: row * 7 + col });
            break;
          }
        }
      }
      if (emptyCols.length > 0) {
        const target = emptyCols[Math.floor(Math.random() * emptyCols.length)];
        setFalling({ col: target.col, color: Math.random() > 0.5 ? "red" : "yellow" });
        setTimeout(() => {
          setDiscs(prev => {
            const next = [...prev];
            next[target.idx] = falling?.color || "red";
            return next;
          });
          setFalling(null);
        }, 500);
      } else {
        setDiscs(() => {
          const reset = Array(42).fill(null);
          [35, 36, 37].forEach((i, idx) => {
            reset[i] = idx % 2 === 0 ? "red" : "yellow";
          });
          return reset;
        });
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [interactive, discs, falling]);

  return (
    <div className="game-board c4-board">
      {falling && (
        <div
          className={`falling-disc ${falling.color}`}
          style={{ left: `${falling.col * 14.28}%` }}
        />
      )}
      {discs.map((disc, i) => (
        <div key={i} className="c4-slot">
          {disc && <span className={`c4-disc ${disc}`} />}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [activeGame, setActiveGame] = useState("tictactoe");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="app" onMouseMove={handleMouseMove}>
      <div
        className="glow-bg"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(226,192,96,0.15) 0%, transparent 50%)`
        }}
      />
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Unbeatable</span>
        </div>
        <nav className="nav">
          {games.map(g => (
            <button
              key={g.id}
              className={`nav-btn ${activeGame === g.id ? "active" : ""}`}
              onClick={() => setActiveGame(g.id)}
              style={{ "--accent": g.color }}
            >
              <span className="nav-icon">{g.icon}</span>
              <span className="nav-label">{g.title}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">
            <span className="title-line">Play Against</span>
            <span className="title-line accent">Perfect AI</span>
          </h1>
          <p className="subtitle">
            Udulmaz alqoritmlərlə gücləndirilmiş mini oyunlar
          </p>
        </section>

        <section className="game-showcase">
          <div className={`game-container ${activeGame}`}>
            {activeGame === "tictactoe" && <TicTacToeBoard interactive />}
            {activeGame === "number-target" && <NumberTargetBoard interactive />}
            {activeGame === "connect-four" && <ConnectFourBoard interactive />}
          </div>

          <div className="game-cards">
            {games.map(g => (
              <button
                key={g.id}
                className={`game-card ${activeGame === g.id ? "active" : ""}`}
                onClick={() => setActiveGame(g.id)}
                style={{ "--accent": g.color }}
              >
                <span className="card-icon">{g.icon}</span>
                <span className="card-title">{g.title}</span>
                <span className="card-glow" />
              </button>
            ))}
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <span className="feature-icon">🧠</span>
            <span className="feature-text">Minimax AI</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Instant Response</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Optimal Strategy</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Capstone Project • 2026</span>
      </footer>
    </div>
  );
}

export default App;
