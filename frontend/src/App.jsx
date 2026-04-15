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
    desc: "Classic 3×3 grid. The AI plays perfectly — a draw is the best you can do.",
  },
  {
    id: "number-target",
    icon: "∑",
    title: "Number Target",
    color: "#00D4FF",
    algo: "Game Theory (Nim)",
    desc: "Take turns adding 1–10. First to reach 100 wins. The math is against you.",
  },
  {
    id: "connect-four",
    icon: "◉",
    title: "Connect Four",
    color: "#FF3838",
    algo: "Minimax depth-6",
    desc: "Drop discs and connect four in a row. The AI looks 6 moves ahead.",
  },
  {
    id: "memory-match",
    icon: "🃏",
    title: "Memory Match",
    color: "#9B59FF",
    algo: "Perfect Memory",
    desc: "Flip cards and find pairs. The AI never forgets a single card it has seen.",
  },
  {
    id: "rps",
    icon: "✊",
    title: "Rock Paper Scissors",
    color: "#FF9900",
    algo: "Pattern Detection",
    desc: "Best of 7. The AI studies your move history and counters your patterns.",
  },
  {
    id: "reversi",
    icon: "⬤",
    title: "Reversi",
    color: "#00FF87",
    algo: "Minimax + Position",
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
          <p className="subtitle">Udulmaz alqoritmlərlə gücləndirilmiş mini oyunlar</p>
        </section>

        <div className="home-grid">
          {GAMES.map((g) => (
            <button
              key={g.id}
              className="home-card"
              style={{ "--accent": g.color }}
              onClick={() => setScreen(g.id)}
            >
              <div className="home-card-banner">
                <span className="home-card-icon">{g.icon}</span>
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

        <div className="features">
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
        </div>
      </main>

      <footer className="footer">
        <span>Capstone Project • 2026</span>
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
