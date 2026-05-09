import { useState, useEffect, useRef } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import GameTips from "../components/GameTips.jsx";
import { GAME_TIPS } from "../data/gameTipsData.js";
import { useTutorial } from "../hooks/useTutorial.js";
import TutorialOverlay from "../components/TutorialOverlay.jsx";
import { TUTORIAL_SCRIPTS } from "../data/tutorialScripts.js";

const SYMBOLS = ["★", "♦", "✦", "♥", "⬟", "▲", "◈", "⬡"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCards() {
  return shuffle([...SYMBOLS, ...SYMBOLS].map((sym, i) => ({ id: i, sym })));
}

function makeTutorialCards() {
  const layout = TUTORIAL_SCRIPTS["memory-match"].fixedCards;
  return layout.map((sym, i) => ({ id: i, sym }));
}

export default function MemoryMatch({ onBack }) {
  const { user } = useAuth();
  const [cards, setCards] = useState(makeCards);
  const [matched, setMatched] = useState(new Set());
  const [selected, setSelected] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [result, setResult] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const tutorial = useTutorial("memory-match");

  const matchedRef = useRef(new Set());
  const aiMemory = useRef(new Map());

  useEffect(() => { matchedRef.current = matched; }, [matched]);

  useEffect(() => {
    if (matched.size === 16 && !result) {
      if (playerScore > aiScore) setResult("win");
      else if (aiScore > playerScore) setResult("lose");
      else setResult("draw");
    }
  }, [matched]);

  useEffect(() => {
    if (!result || !user || saving || tutorial.active) return;
    setSaving(true);
    const dur = Math.round((Date.now() - startTime) / 1000);
    api.recordGame("memory-match", result === "win" ? "win" : result === "draw" ? "draw" : "loss", dur, playerScore, aiScore)
      .catch(console.error)
      .finally(() => setSaving(false));
  }, [result]);

  function remember(id, cardList) {
    const sym = (cardList || cards).find(c => c.id === id)?.sym;
    if (sym !== undefined) aiMemory.current.set(id, sym);
  }

  function pickAIPair(currentMatched, cardList) {
    const mem = aiMemory.current;
    const unmatched = cardList.filter(c => !currentMatched.has(c.id));
    const seen = new Map();
    for (const c of unmatched) {
      if (!mem.has(c.id)) continue;
      const sym = mem.get(c.id);
      if (seen.has(sym)) return [seen.get(sym), c.id];
      seen.set(sym, c.id);
    }
    const unseen = unmatched.filter(c => !mem.has(c.id));
    if (unseen.length >= 2) return [unseen[0].id, unseen[1].id];
    if (unseen.length === 1) {
      const known = unmatched.filter(c => mem.has(c.id));
      return [unseen[0].id, known[0]?.id ?? unmatched[0].id];
    }
    return [unmatched[0].id, unmatched[1].id];
  }

  function doAITurn(currentCards) {
    const currentMatched = matchedRef.current;
    if (currentMatched.size >= 16) return;
    setAnimating(true);
    setAiPicks([]);
    const [firstId, secondId] = pickAIPair(currentMatched, currentCards);
    remember(firstId, currentCards);
    setTimeout(() => {
      setAiPicks([firstId]);
      setTimeout(() => {
        remember(secondId, currentCards);
        setAiPicks([firstId, secondId]);
        const symA = currentCards.find(c => c.id === firstId)?.sym;
        const symB = currentCards.find(c => c.id === secondId)?.sym;
        setTimeout(() => {
          if (symA === symB) {
            const newMatched = new Set([...matchedRef.current, firstId, secondId]);
            setMatched(newMatched);
            matchedRef.current = newMatched;
            setAiScore(s => s + 1);
          }
          setAiPicks([]);
          setAnimating(false);
          setPlayerTurn(true);
        }, 700);
      }, 650);
    }, 550);
  }

  function doTutorialAI(aiMove, currentCards) {
    if (!aiMove) return;
    const [firstId, secondId] = aiMove;
    setAnimating(true);
    setPlayerTurn(false);
    setTimeout(() => {
      setAiPicks([firstId]);
      setTimeout(() => {
        setAiPicks([firstId, secondId]);
        const symA = currentCards.find(c => c.id === firstId)?.sym;
        const symB = currentCards.find(c => c.id === secondId)?.sym;
        setTimeout(() => {
          if (symA === symB) {
            const newMatched = new Set([...matchedRef.current, firstId, secondId]);
            setMatched(newMatched);
            matchedRef.current = newMatched;
            setAiScore(s => s + 1);
          }
          setAiPicks([]);
          setAnimating(false);
          setPlayerTurn(true);
          tutorial.advance();
        }, 700);
      }, 650);
    }, 550);
  }

  function handleClick(id) {
    if (!playerTurn || animating || result) return;
    if (matched.has(id) || selected.includes(id) || selected.length >= 2) return;

    if (tutorial.active) {
      const expectedPair = tutorial.highlightMove;
      if (!expectedPair) return;
      const expectedId = expectedPair[selected.length];
      if (id !== expectedId) return;

      remember(id, cards);
      const newSelected = [...selected, id];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [a, b] = newSelected;
        const symA = cards.find(c => c.id === a)?.sym;
        const symB = cards.find(c => c.id === b)?.sym;
        setAnimating(true);
        setTimeout(() => {
          if (symA === symB) {
            const newMatched = new Set([...matchedRef.current, a, b]);
            setMatched(newMatched);
            matchedRef.current = newMatched;
            setPlayerScore(s => s + 1);
          }
          setSelected([]);
          setAnimating(false);
          // Now do tutorial AI turn
          const aiMove = tutorial.aiMove;
          if (aiMove) {
            doTutorialAI(aiMove, cards);
          } else {
            tutorial.advance();
          }
        }, 600);
      }
      return;
    }

    remember(id, cards);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [a, b] = newSelected;
      const symA = cards.find(c => c.id === a)?.sym;
      const symB = cards.find(c => c.id === b)?.sym;
      setAnimating(true);
      setTimeout(() => {
        if (symA === symB) {
          const newMatched = new Set([...matchedRef.current, a, b]);
          setMatched(newMatched);
          matchedRef.current = newMatched;
          setPlayerScore(s => s + 1);
        }
        setSelected([]);
        setPlayerTurn(false);
        setAnimating(false);
        setTimeout(() => doAITurn(cards), 400);
      }, symA === symB ? 400 : 900);
    }
  }

  function reset() {
    const newCards = makeCards();
    setCards(newCards);
    setMatched(new Set());
    setSelected([]);
    setAiPicks([]);
    setPlayerTurn(true);
    setAnimating(false);
    setPlayerScore(0);
    setAiScore(0);
    setResult(null);
    matchedRef.current = new Set();
    aiMemory.current = new Map();
  }

  function handleStartTutorial() {
    setCards(makeTutorialCards());
    setMatched(new Set());
    setSelected([]);
    setAiPicks([]);
    setPlayerTurn(true);
    setAnimating(false);
    setPlayerScore(0);
    setAiScore(0);
    setResult(null);
    matchedRef.current = new Set();
    aiMemory.current = new Map();
    tutorial.start();
  }

  function handleExitTutorial() {
    tutorial.exit();
    reset();
  }

  const isFaceUp = (id) =>
    matched.has(id) || selected.includes(id) || aiPicks.includes(id);

  const statusText = result
    ? result === "win" ? "You Win!"
      : result === "draw" ? "It's a Draw!"
      : "AI Wins!"
    : animating && !playerTurn
      ? "AI is choosing..."
      : playerTurn
        ? selected.length === 0 ? "Your turn — flip a card" : "Now flip another card"
        : "AI's turn...";

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
          <h2 className="game-title" style={{ color: "#a78bfa" }}>Memory Match</h2>
          <button className="tips-toggle" onClick={() => setShowTips(t => !t)}>{showTips ? "✕" : "?"}</button>
          <button className="tutorial-toggle" onClick={tutorial.active ? handleExitTutorial : handleStartTutorial}>
            {tutorial.active ? "Exit Tutorial" : "Tutorial"}
          </button>
        </div>
        <GameTips {...GAME_TIPS["memory-match"]} isOpen={showTips} />
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

        <div className="mm-scoreboard">
          <div className={`mm-score-box ${playerTurn && !result ? "mm-active" : ""}`}>
            <span className="mm-score-label">You</span>
            <span className="mm-score-num">{playerScore}</span>
          </div>
          <span className="mm-vs">vs</span>
          <div className={`mm-score-box ${!playerTurn && !result ? "mm-active" : ""}`}>
            <span className="mm-score-label">AI</span>
            <span className="mm-score-num">{aiScore}</span>
          </div>
        </div>

        <div className="mm-grid">
          {cards.map((card) => {
            const up = isFaceUp(card.id);
            const isMatched = matched.has(card.id);
            const isAI = aiPicks.includes(card.id);
            const isHighlight = tutorial.active && tutorial.highlightMove &&
              tutorial.highlightMove[selected.length] === card.id && !isMatched && !up;
            return (
              <button
                key={card.id}
                className={[
                  "mm-card",
                  up ? "mm-up" : "",
                  isMatched ? "mm-matched" : "",
                  isAI ? "mm-ai-pick" : "",
                  !up && playerTurn && !animating && !result ? "mm-clickable" : "",
                  isHighlight ? "tutorial-highlight" : "",
                ].join(" ")}
                onClick={() => handleClick(card.id)}
              >
                <span className="mm-front">{card.sym}</span>
                <span className="mm-back">?</span>
              </button>
            );
          })}
        </div>

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
