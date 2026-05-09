import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthScreen from "./screens/AuthScreen";
import TicTacToe from "./games/TicTacToe";
import NumberTarget from "./games/NumberTarget";
import ConnectFour from "./games/ConnectFour";
import MemoryMatch from "./games/MemoryMatch";
import RockPaperScissors from "./games/RockPaperScissors";
import Reversi from "./games/Reversi";

const GAMES = [
  {
    id: "tictactoe",
    icon: "✕",
    title: "Tic Tac Toe",
    color: "#FFD700",
    algo: "Minimax + Alpha-Beta",
    difficulty: "Unbeatable",
    desc: "Classic 3×3 grid. The AI plays perfectly — a draw is the best you can do.",
  },
  {
    id: "number-target",
    icon: "∑",
    title: "Number Target",
    color: "#00D4FF",
    algo: "Game Theory (Nim)",
    difficulty: "Unbeatable",
    desc: "Take turns adding 1–10. First to reach 100 wins. The math is against you.",
  },
  {
    id: "connect-four",
    icon: "◉",
    title: "Connect Four",
    color: "#FF3838",
    algo: "Minimax depth-6",
    difficulty: "Expert",
    desc: "Drop discs and connect four in a row. The AI looks 6 moves ahead.",
  },
  {
    id: "memory-match",
    icon: "🃏",
    title: "Memory Match",
    color: "#9B59FF",
    algo: "Perfect Memory",
    difficulty: "Perfect Memory",
    desc: "Flip cards and find pairs. The AI never forgets a single card it has seen.",
  },
  {
    id: "rps",
    icon: "✊",
    title: "Rock Paper Scissors",
    color: "#FF9900",
    algo: "Pattern Detection",
    difficulty: "Adaptive",
    desc: "Best of 7. The AI studies your move history and counters your patterns.",
  },
  {
    id: "reversi",
    icon: "⬤",
    title: "Reversi",
    color: "#00FF87",
    algo: "Minimax + Position",
    difficulty: "Expert",
    desc: "Flip your opponent's discs on a 6×6 board. AI values corners above all else.",
  },
];

const COMPONENTS = {
  tictactoe: TicTacToe,
  "number-target": NumberTarget,
  "connect-four": ConnectFour,
  "memory-match": MemoryMatch,
  rps: RockPaperScissors,
  reversi: Reversi,
};

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [screen, setScreen] = useState("home");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  if (loading) {
    return (
      <div className="app" style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "24px", color: "var(--text-dim)" }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthenticated={() => {}} />;
  }

  if (screen !== "home") {
    const Game = COMPONENTS[screen];
    return <Game onBack={() => setScreen("home")} />;
  }

  return (
    <div
      className="app"
      onMouseMove={(e) =>
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      }
    >
      <div
        className="glow-bg"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,215,0,0.06) 0%, transparent 50%)`,
        }}
      />
      <div className="particles">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 4.17) % 100}%`,
              animationDelay: `${(i * 0.6) % 8}s`,
              animationDuration: `${10 + (i % 8)}s`,
            }}
          />
        ))}
      </div>

      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Unbeatable</span>
        </div>
        <div className="header-user">
          <span className="header-greeting">
            Welcome, <strong>{user.username}</strong>
          </span>
          <button className="header-logout" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            6 Games Live
          </div>
          <h1 className="title">
            <span className="title-line">Play Against</span>
            <span className="title-line accent">Perfect AI</span>
          </h1>
          <p className="subtitle">Challenge unbeatable algorithms across 6 classic games</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">6</span>
              <span className="hero-stat-label">Games</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">4</span>
              <span className="hero-stat-label">AI Algorithms</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Fair Play</span>
            </div>
          </div>

          <button className="hero-cta" onClick={() => {
            document.getElementById("game-grid")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Start Playing
          </button>
        </section>

        <div className="home-grid" id="game-grid">
          {GAMES.map((g) => (
            <button
              key={g.id}
              className="home-card"
              style={{ "--accent": g.color }}
              onClick={() => setScreen(g.id)}
            >
              <div className="home-card-banner">
                <span className="home-card-icon">{g.icon}</span>
                <span className="home-card-difficulty" style={{ borderColor: g.color, color: g.color }}>{g.difficulty}</span>
              </div>
              <div className="home-card-body">
                <span className="home-card-title">{g.title}</span>
                <span className="home-card-algo">{g.algo}</span>
                <p className="home-card-desc">{g.desc}</p>
                <span className="home-card-play">Play Now →</span>
              </div>
              <span className="home-card-glow" />
            </button>
          ))}
        </div>

        <section className="features-section">
          <h2 className="features-heading">Why Play Against AI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-card-icon">🧠</span>
              <span className="feature-card-title">Minimax AI</span>
              <p className="feature-card-desc">Algorithms that calculate the mathematically optimal move</p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">⚡</span>
              <span className="feature-card-title">Instant Response</span>
              <p className="feature-card-desc">Zero delay — every move computed in real-time</p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">🎯</span>
              <span className="feature-card-title">Optimal Strategy</span>
              <p className="feature-card-desc">Learn perfect play by competing against perfection</p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">📊</span>
              <span className="feature-card-title">Track Progress</span>
              <p className="feature-card-desc">Your game history and stats are saved automatically</p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2 className="features-heading">How It Works</h2>
          <div className="how-steps">
            <div className="how-step">
              <span className="how-step-num">1</span>
              <span className="how-step-title">Pick a Game</span>
              <p className="how-step-desc">Choose from 6 classic strategy games above</p>
            </div>
            <div className="how-step-line" />
            <div className="how-step">
              <span className="how-step-num">2</span>
              <span className="how-step-title">Challenge the AI</span>
              <p className="how-step-desc">Each game uses a different unbeatable algorithm</p>
            </div>
            <div className="how-step-line" />
            <div className="how-step">
              <span className="how-step-num">3</span>
              <span className="how-step-title">Learn & Improve</span>
              <p className="how-step-desc">Study the AI's moves and sharpen your strategy</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Capstone Project • 2026</span>
        <span className="footer-tech">Built with React + Vite</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
