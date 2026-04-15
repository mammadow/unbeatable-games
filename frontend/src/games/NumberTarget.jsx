import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

function getAIMove(current) {
  for (let add = 1; add <= 10; add++) {
    const next = current + add;
    if (next === 100) return add;
    if (next < 100 && (100 - next) % 11 === 0) return add;
  }
  return 1;
}

export default function NumberTarget({ onBack }) {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [result, setResult] = useState(null);
  const [lastAdd, setLastAdd] = useState(null);
  const [lastWho, setLastWho] = useState(null);
  const [moveKey, setMoveKey] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (playerTurn || result) return;
    setThinking(true);
    const t = setTimeout(() => {
      const add = getAIMove(current);
      const next = current + add;
      setLastAdd(add);
      setLastWho("ai");
      setMoveKey(k => k + 1);
      setCurrent(next);
      setThinking(false);
      if (next >= 100) setResult("lose");
      else setPlayerTurn(true);
    }, 750);
    return () => clearTimeout(t);
  }, [playerTurn, current, result]);

  function handlePick(n) {
    if (!playerTurn || result || thinking || current + n > 100) return;
    const next = current + n;
    setLastAdd(n);
    setLastWho("player");
    setMoveKey(k => k + 1);
    setCurrent(next);
    if (next >= 100) setResult("win");
    else setPlayerTurn(false);
  }

  async function saveGame() {
    if (!user || !result || saving) return;
    setSaving(true);
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      await api.recordGame("number-target", result === "win" ? "win" : "loss", duration, result === "win" ? 1 : 0, result === "lose" ? 1 : 0);
    } catch (err) {
      console.error("Failed to save game:", err);
    }
    setSaving(false);
  }

  function reset() {
    setCurrent(0);
    setPlayerTurn(false);
    setResult(null);
    setLastAdd(null);
    setLastWho(null);
    setMoveKey(0);
    setThinking(false);
  }

  useEffect(() => {
    if (result) {
      saveGame();
    }
  }, [result]);

  const progress = Math.min((current / 100) * 100, 100);

  const status = result
    ? result === "win" ? "You Win! 🎉" : "AI Wins!"
    : thinking ? "AI is calculating..." : playerTurn ? "Your turn — pick 1 to 10" : "AI's turn...";

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Unbeatable</span>
        </div>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </header>
      <main className="main">
        <h2 className="game-title" style={{ color: "var(--cyan)" }}>Number Target</h2>
        <p className={`game-status ${result ? (result === "win" ? "status-win" : "status-lose") : ""}`}>
          {status}
        </p>

        <div className="nt-container">
          <div className="nt-number">
            <span className="nt-current">{current}</span>
            <span className="nt-slash">/100</span>
            {lastAdd !== null && (
              <span
                key={moveKey}
                className={`nt-add ${lastWho === "ai" ? "nt-add-ai" : "nt-add-player"}`}
              >
                +{lastAdd}
              </span>
            )}
          </div>

          <div className="nt-progress-bar">
            <div className="nt-progress-fill" style={{ width: `${progress}%` }} />
            <div
              className="nt-progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="nt-progress-labels">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>

          <div className="nt-pills">
            {[1,2,3,4,5,6,7,8,9,10].map(n => {
              const disabled = !playerTurn || !!result || thinking || current + n > 100;
              return (
                <button
                  key={n}
                  className={`nt-pill ${disabled ? "nt-pill-disabled" : "nt-pill-active"}`}
                  onClick={() => handlePick(n)}
                  disabled={disabled}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {result && (
          <button className="reset-btn" onClick={reset} disabled={saving}>
            {saving ? "Saving..." : "Play Again"}
          </button>
        )}
        {user && <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-dim)" }}>Logged in as: {user.username}</p>}
      </main>
    </div>
  );
}
