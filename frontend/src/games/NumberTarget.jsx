import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import GameTips from "../components/GameTips.jsx";
import { GAME_TIPS } from "../data/gameTipsData.js";
import { useTutorial } from "../hooks/useTutorial.js";
import TutorialOverlay from "../components/TutorialOverlay.jsx";

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
  const [showTips, setShowTips] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const tutorial = useTutorial("number-target");

  useEffect(() => {
    if (tutorial.active) return;
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

    if (tutorial.active) {
      if (n !== tutorial.highlightMove) return;
      const next = current + n;
      setLastAdd(n);
      setLastWho("player");
      setMoveKey(k => k + 1);
      setCurrent(next);
      if (next >= 100) { setResult("win"); tutorial.advance(); return; }
      if (tutorial.aiMove !== null) {
        setPlayerTurn(false);
        setTimeout(() => {
          const aiAdd = tutorial.aiMove;
          const aiNext = next + aiAdd;
          setLastAdd(aiAdd);
          setLastWho("ai");
          setMoveKey(k => k + 1);
          setCurrent(aiNext);
          if (aiNext >= 100) setResult("lose");
          else setPlayerTurn(true);
          tutorial.advance();
        }, 600);
      } else {
        tutorial.advance();
      }
      return;
    }

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

  function handleStartTutorial() {
    reset();
    tutorial.start();
    // AI goes first in this game — apply the preAiMove from step 0
    setTimeout(() => {
      const preMove = 1; // tutorial script's preAiMove for step 0
      setCurrent(preMove);
      setLastAdd(preMove);
      setLastWho("ai");
      setMoveKey(k => k + 1);
      setPlayerTurn(true);
    }, 500);
  }

  function handleExitTutorial() {
    tutorial.exit();
    reset();
  }

  useEffect(() => {
    if (result && !tutorial.active) {
      saveGame();
    }
  }, [result]);

  const progress = Math.min((current / 100) * 100, 100);

  const status = result
    ? result === "win" ? "You Win!" : "AI Wins!"
    : thinking ? "AI is calculating..." : playerTurn ? "Your turn — pick 1 to 10" : "AI's turn...";

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
          <h2 className="game-title" style={{ color: "var(--cyan)" }}>Number Target</h2>
          <button className="tips-toggle" onClick={() => setShowTips(t => !t)}>{showTips ? "✕" : "?"}</button>
          <button className="tutorial-toggle" onClick={tutorial.active ? handleExitTutorial : handleStartTutorial}>
            {tutorial.active ? "Exit Tutorial" : "Tutorial"}
          </button>
        </div>
        <GameTips {...GAME_TIPS["number-target"]} isOpen={showTips} />
        {tutorial.active && (
          <TutorialOverlay
            text={tutorial.text}
            stepIndex={tutorial.stepIndex}
            totalSteps={tutorial.totalSteps}
            isComplete={tutorial.isComplete}
            onExit={handleExitTutorial}
          />
        )}
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
                  className={[
                    "nt-pill",
                    disabled ? "nt-pill-disabled" : "nt-pill-active",
                    tutorial.active && tutorial.highlightMove === n && !disabled ? "tutorial-highlight" : "",
                  ].join(" ")}
                  onClick={() => handlePick(n)}
                  disabled={disabled}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {result && !tutorial.active && (
          <button className="reset-btn" onClick={reset} disabled={saving}>
            {saving ? "Saving..." : "Play Again"}
          </button>
        )}
        {user && <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-dim)" }}>Logged in as: {user.username}</p>}
      </main>
    </div>
  );
}
