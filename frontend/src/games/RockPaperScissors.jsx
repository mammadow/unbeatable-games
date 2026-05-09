import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import GameTips from "../components/GameTips.jsx";
import { GAME_TIPS } from "../data/gameTipsData.js";
import { useTutorial } from "../hooks/useTutorial.js";
import TutorialOverlay from "../components/TutorialOverlay.jsx";

const MOVES = ["rock", "paper", "scissors"];
const ICON = { rock: "✊", paper: "🖐", scissors: "✌️" };
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const COUNTER = { rock: "paper", paper: "scissors", scissors: "rock" };
const MAX_ROUNDS = 7;

function getAIPick(history) {
  if (history.length < 3) {
    return MOVES[Math.floor(Math.random() * 3)];
  }
  const freq = { rock: 0, paper: 0, scissors: 0 };
  history.forEach(h => freq[h.player]++);
  history.slice(-3).forEach(h => freq[h.player]++);
  const mostUsed = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  return COUNTER[mostUsed];
}

function getOutcome(player, ai) {
  if (player === ai) return "draw";
  return BEATS[player] === ai ? "win" : "lose";
}

export default function RockPaperScissors({ onBack }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [lastRound, setLastRound] = useState(null);
  const [result, setResult] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const tutorial = useTutorial("rps");

  const round = history.length;

  useEffect(() => {
    if (tutorial.active) return;
    if (round < MAX_ROUNDS) return;
    if (playerScore > aiScore) setResult("win");
    else if (aiScore > playerScore) setResult("lose");
    else setResult("draw");
  }, [history]);

  useEffect(() => {
    if (!result || !user || saving || tutorial.active) return;
    setSaving(true);
    const dur = Math.round((Date.now() - startTime) / 1000);
    api.recordGame("rps", result === "win" ? "win" : result === "draw" ? "draw" : "loss", dur, playerScore, aiScore)
      .catch(console.error)
      .finally(() => setSaving(false));
  }, [result]);

  function handlePick(move) {
    if (result || round >= MAX_ROUNDS) return;

    if (tutorial.active) {
      if (move !== tutorial.highlightMove) return;
      const aiPick = tutorial.aiMove;
      const outcome = getOutcome(move, aiPick);
      const round_ = { player: move, ai: aiPick, outcome };
      setLastRound(round_);
      setHistory(prev => [...prev, round_]);
      if (outcome === "win") setPlayerScore(s => s + 1);
      else if (outcome === "lose") setAiScore(s => s + 1);
      tutorial.advance();
      return;
    }

    const aiPick = getAIPick(history);
    const outcome = getOutcome(move, aiPick);
    const round_ = { player: move, ai: aiPick, outcome };
    setLastRound(round_);
    setHistory(prev => [...prev, round_]);
    if (outcome === "win") setPlayerScore(s => s + 1);
    else if (outcome === "lose") setAiScore(s => s + 1);
  }

  function reset() {
    setHistory([]);
    setPlayerScore(0);
    setAiScore(0);
    setLastRound(null);
    setResult(null);
  }

  function handleStartTutorial() { reset(); tutorial.start(); }
  function handleExitTutorial() { tutorial.exit(); reset(); }

  const roundLabel = round < MAX_ROUNDS
    ? `Round ${round + 1} / ${MAX_ROUNDS}`
    : `${MAX_ROUNDS} / ${MAX_ROUNDS}`;

  const statusText = result
    ? result === "win" ? "You Win!"
      : result === "draw" ? "It's a Draw!"
      : "AI Wins!"
    : lastRound
      ? lastRound.outcome === "win" ? "You won that round!"
        : lastRound.outcome === "draw" ? "Draw — pick again"
        : "AI won that round!"
      : "Pick your move";

  return (
    <div className={`app ${tutorial.active ? "tutorial-active" : ""}`}>
      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Unbeatable</span>
        </div>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </header>
      <main className="main">
        <div className="game-title-row">
          <h2 className="game-title" style={{ color: "#f97316" }}>Rock Paper Scissors</h2>
          <button className="tips-toggle" onClick={() => setShowTips(t => !t)}>{showTips ? "✕" : "?"}</button>
          <button className="tutorial-toggle" onClick={tutorial.active ? handleExitTutorial : handleStartTutorial}>
            {tutorial.active ? "Exit Tutorial" : "Tutorial"}
          </button>
        </div>
        <GameTips {...GAME_TIPS.rps} isOpen={showTips} />
        {tutorial.active && (
          <TutorialOverlay
            text={tutorial.text}
            stepIndex={tutorial.stepIndex}
            totalSteps={tutorial.totalSteps}
            isComplete={tutorial.isComplete}
            onExit={handleExitTutorial}
          />
        )}
        <p className={`game-status ${result ? (result === "win" ? "status-win" : result === "draw" ? "status-draw" : "status-lose") : ""}`}>
          {statusText}
        </p>

        <div className="rps-scoreboard">
          <div className="rps-score-col">
            <span className="rps-score-label">You</span>
            <span className="rps-score-num">{playerScore}</span>
          </div>
          <div className="rps-round-badge">{roundLabel}</div>
          <div className="rps-score-col">
            <span className="rps-score-label">AI</span>
            <span className="rps-score-num">{aiScore}</span>
          </div>
        </div>

        {lastRound && (
          <div className={`rps-last-round rps-outcome-${lastRound.outcome}`}>
            <div className="rps-side">
              <span className="rps-big-icon">{ICON[lastRound.player]}</span>
              <span className="rps-side-label">You</span>
            </div>
            <span className="rps-vs-text">vs</span>
            <div className="rps-side">
              <span className="rps-big-icon">{ICON[lastRound.ai]}</span>
              <span className="rps-side-label">AI</span>
            </div>
          </div>
        )}

        {!result && (
          <div className="rps-picks">
            {MOVES.map(move => (
              <button
                key={move}
                className={`rps-pick-btn ${tutorial.active && tutorial.highlightMove === move ? "tutorial-highlight" : ""}`}
                onClick={() => handlePick(move)}
              >
                <span className="rps-pick-icon">{ICON[move]}</span>
                <span className="rps-pick-label">{move[0].toUpperCase() + move.slice(1)}</span>
              </button>
            ))}
          </div>
        )}

        {round >= 3 && !result && !tutorial.active && (
          <p className="rps-ai-note">🧠 AI is learning your patterns...</p>
        )}

        {history.length > 0 && (
          <div className="rps-history">
            {history.map((r, i) => (
              <span
                key={i}
                className={`rps-dot rps-dot-${r.outcome}`}
                title={`Round ${i + 1}: ${r.player} vs ${r.ai} — ${r.outcome}`}
              />
            ))}
          </div>
        )}

        {result && !tutorial.active && (
          <button className="reset-btn" onClick={reset} disabled={saving}>
            {saving ? "Saving..." : "Play Again"}
          </button>
        )}
        {user && (
          <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-dim)" }}>
            Logged in as: {user.username}
          </p>
        )}
      </main>
    </div>
  );
}
