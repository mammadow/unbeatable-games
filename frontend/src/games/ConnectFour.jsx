import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import GameTips from "../components/GameTips.jsx";
import { GAME_TIPS } from "../data/gameTipsData.js";
import { useTutorial } from "../hooks/useTutorial.js";
import TutorialOverlay from "../components/TutorialOverlay.jsx";

const ROWS = 6;
const COLS = 7;
const MOVE_ORDER = [3, 2, 4, 1, 5, 0, 6];

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function dropDisc(board, col, player) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      const nb = board.map(r => [...r]);
      nb[row][col] = player;
      return { board: nb, row };
    }
  }
  return null;
}

function checkWin(board, player) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 3 < COLS && [0,1,2,3].every(i => board[r][c+i] === player)) return true;
      if (r + 3 < ROWS && [0,1,2,3].every(i => board[r+i][c] === player)) return true;
      if (r + 3 < ROWS && c + 3 < COLS && [0,1,2,3].every(i => board[r+i][c+i] === player)) return true;
      if (r - 3 >= 0 && c + 3 < COLS && [0,1,2,3].every(i => board[r-i][c+i] === player)) return true;
    }
  }
  return false;
}

function isFull(board) {
  return board[0].every(c => c !== null);
}

function scoreWindow(win, ai, opp) {
  const ac = win.filter(c => c === ai).length;
  const oc = win.filter(c => c === opp).length;
  const empty = win.filter(c => c === null).length;
  if (ac === 4) return 100;
  if (ac === 3 && empty === 1) return 5;
  if (ac === 2 && empty === 2) return 2;
  if (oc === 3 && empty === 1) return -4;
  return 0;
}

function evaluate(board) {
  const ai = "R", opp = "Y";
  let score = 0;
  score += board.map(r => r[3]).filter(c => c === ai).length * 3;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], ai, opp);
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], ai, opp);
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], ai, opp);
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]], ai, opp);
  return score;
}

function getValidCols(board) {
  return MOVE_ORDER.filter(c => !board[0][c]);
}

function minimax(board, depth, alpha, beta, maximizing) {
  if (checkWin(board, "R")) return { score: 1000 + depth };
  if (checkWin(board, "Y")) return { score: -(1000 + depth) };
  if (isFull(board) || depth === 0) return { score: evaluate(board) };
  const valid = getValidCols(board);
  let best = { score: maximizing ? -Infinity : Infinity, col: valid[0] };
  for (const col of valid) {
    const drop = dropDisc(board, col, maximizing ? "R" : "Y");
    if (!drop) continue;
    const val = minimax(drop.board, depth - 1, alpha, beta, !maximizing);
    if (maximizing ? val.score > best.score : val.score < best.score) {
      best = { score: val.score, col };
    }
    if (maximizing) alpha = Math.max(alpha, best.score);
    else beta = Math.min(beta, best.score);
    if (beta <= alpha) break;
  }
  return best;
}

function getBestCol(board) {
  const result = minimax(board, 6, -Infinity, Infinity, true);
  return result.col ?? getValidCols(board)[0];
}

export default function ConnectFour({ onBack }) {
  const { user } = useAuth();
  const [board, setBoard] = useState(createBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [hoverCol, setHoverCol] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const tutorial = useTutorial("connect-four");

  useEffect(() => {
    if (tutorial.active) return;
    if (playerTurn || result) return;
    setThinking(true);
    const t = setTimeout(() => {
      const col = getBestCol(board);
      const drop = dropDisc(board, col, "R");
      if (drop) {
        setBoard(drop.board);
        if (checkWin(drop.board, "R")) setResult("R");
        else if (isFull(drop.board)) setResult("draw");
        else setPlayerTurn(true);
      }
      setThinking(false);
    }, 450);
    return () => clearTimeout(t);
  }, [playerTurn, board, result]);

  function handleColClick(col) {
    if (!playerTurn || result || thinking || board[0][col]) return;

    if (tutorial.active) {
      if (col !== tutorial.highlightMove) return;
      const drop = dropDisc(board, col, "Y");
      if (!drop) return;
      setBoard(drop.board);
      if (checkWin(drop.board, "Y")) { setResult("Y"); tutorial.advance(); return; }
      if (isFull(drop.board)) { setResult("draw"); tutorial.advance(); return; }
      if (tutorial.aiMove !== null) {
        setPlayerTurn(false);
        setTimeout(() => {
          const aiDrop = dropDisc(drop.board, tutorial.aiMove, "R");
          if (aiDrop) {
            setBoard(aiDrop.board);
            if (checkWin(aiDrop.board, "R")) setResult("R");
            else if (isFull(aiDrop.board)) setResult("draw");
            else setPlayerTurn(true);
          }
          tutorial.advance();
        }, 500);
      } else {
        tutorial.advance();
      }
      return;
    }

    const drop = dropDisc(board, col, "Y");
    if (drop) {
      setBoard(drop.board);
      if (checkWin(drop.board, "Y")) setResult("Y");
      else if (isFull(drop.board)) setResult("draw");
      else setPlayerTurn(false);
    }
  }

  function reset() {
    setBoard(createBoard());
    setPlayerTurn(true);
    setResult(null);
    setThinking(false);
    setHoverCol(null);
  }

  function handleStartTutorial() { reset(); tutorial.start(); }
  function handleExitTutorial() { tutorial.exit(); reset(); }

  async function saveGame() {
    if (!user || !result || saving) return;
    setSaving(true);
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      await api.recordGame("connect-four", result === "Y" ? "win" : result === "draw" ? "draw" : "loss", duration, result === "Y" ? 1 : 0, result === "R" ? 1 : 0);
    } catch (err) {
      console.error("Failed to save game:", err);
    }
    setSaving(false);
  }

  useEffect(() => {
    if (result && !tutorial.active) saveGame();
  }, [result]);

  const status = result
    ? result === "draw" ? "It's a Draw!" : result === "Y" ? "You Win!" : "AI Wins!"
    : thinking ? "AI is thinking..." : playerTurn ? "Your turn  (Yellow)" : "AI's turn  (Red)";

  const canHover = playerTurn && !result && !thinking && !tutorial.active;

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
          <h2 className="game-title" style={{ color: "var(--red)" }}>Connect Four</h2>
          <button className="tips-toggle" onClick={() => setShowTips(t => !t)}>{showTips ? "✕" : "?"}</button>
          <button className="tutorial-toggle" onClick={tutorial.active ? handleExitTutorial : handleStartTutorial}>
            {tutorial.active ? "Exit Tutorial" : "Tutorial"}
          </button>
        </div>
        <GameTips {...GAME_TIPS["connect-four"]} isOpen={showTips} />
        {tutorial.active && (
          <TutorialOverlay
            text={tutorial.text}
            stepIndex={tutorial.stepIndex}
            totalSteps={tutorial.totalSteps}
            isComplete={tutorial.isComplete}
            onExit={handleExitTutorial}
          />
        )}
        <p className={`game-status ${result ? (result === "Y" ? "status-win" : result === "draw" ? "status-draw" : "status-lose") : ""}`}>
          {status}
        </p>

        <div className="c4-wrapper" onMouseLeave={() => setHoverCol(null)}>
          <div className="c4-indicator-row">
            {Array.from({ length: COLS }, (_, c) => (
              <div
                key={c}
                className={`c4-indicator-cell ${tutorial.active && tutorial.highlightMove === c && !board[0][c] ? "tutorial-highlight" : ""}`}
                onMouseEnter={() => canHover && setHoverCol(c)}
                onClick={() => handleColClick(c)}
              >
                {canHover && hoverCol === c && !board[0][c] && (
                  <span className="c4-ghost-disc" />
                )}
              </div>
            ))}
          </div>

          <div className="c4-board-play" onMouseLeave={() => setHoverCol(null)}>
            {board.map((row, r) =>
              row.map((disc, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`c4-slot-play ${canHover && hoverCol === c && !board[0][c] ? "col-hover" : ""}`}
                  onMouseEnter={() => canHover && setHoverCol(c)}
                  onClick={() => handleColClick(c)}
                >
                  {disc && (
                    <span className={`c4-disc-play ${disc === "R" ? "red" : "yellow"}`} />
                  )}
                </div>
              ))
            )}
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
