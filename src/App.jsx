import { useState, useEffect } from "react";
import TicTacToeGame from "./games/TicTacToeGame";
import NumberTargetGame from "./games/NumberTargetGame";
import ConnectFourGame from "./games/ConnectFourGame";
import MemoryMatchGame from "./games/MemoryMatchGame";
import RockPaperScissorsGame from "./games/RockPaperScissorsGame";
import ReversiGame from "./games/ReversiGame";

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
  },
  {
    id: "memory-match",
    icon: "▣",
    title: "Memory Match",
    color: "#b58cff"
  },
  {
    id: "rock-paper-scissors",
    icon: "✊",
    title: "Rock Paper Scissors",
    color: "#88d0ff"
  },
  {
    id: "reversi",
    icon: "◍",
    title: "Reversi",
    color: "#9ee493"
  }
];

function App() {
  const [activeGame, setActiveGame] = useState("tictactoe");
  const [theme, setTheme] = useState("dark");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

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
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            <span className="theme-toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>
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
          <div className={`game-showcase-content ${activeGame}`}>
            {activeGame === "tictactoe" && <TicTacToeGame />}
            {activeGame === "number-target" && <NumberTargetGame />}
            {activeGame === "connect-four" && <ConnectFourGame />}
            {activeGame === "memory-match" && <MemoryMatchGame />}
            {activeGame === "rock-paper-scissors" && <RockPaperScissorsGame />}
            {activeGame === "reversi" && <ReversiGame />}
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <span className="feature-icon">🧠</span>
            <span className="feature-text">Advanced AI</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Multiple Difficulties</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Strategic Gameplay</span>
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
