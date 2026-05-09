import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import GameTips from "../components/GameTips.jsx";
import { GAME_TIPS } from "../data/gameTipsData.js";
import { useTutorial } from "../hooks/useTutorial.js";
import TutorialOverlay from "../components/TutorialOverlay.jsx";

const SIZE = 6;
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

const W = [
  [100,-20, 10, 10,-20,100],
  [-20,-50,  1,  1,-50,-20],
  [ 10,  1,  5,  5,  1, 10],
  [ 10,  1,  5,  5,  1, 10],
  [-20,-50,  1,  1,-50,-20],
  [100,-20, 10, 10,-20,100],
];

function initBoard() {
  const b = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const m = SIZE / 2;
  b[m-1][m-1] = "W"; b[m-1][m] = "B";
  b[m][m-1]   = "B"; b[m][m]   = "W";
  return b;
}

function getFlips(board, r, c, player) {
  if (board[r][c]) return [];
  const opp = player === "B" ? "W" : "B";
  const flips = [];
  for (const [dr, dc] of DIRS) {
    const line = [];
    let nr = r + dr, nc = c + dc;
    while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opp) {
      line.push([nr, nc]); nr += dr; nc += dc;
    }
    if (line.length > 0 && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) {
      flips.push(...line);
    }
  }
  return flips;
}

function getValidMoves(board, player) {
  const moves = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (getFlips(board, r, c, player).length > 0)
        moves.push([r, c]);
  return moves;
}

function applyMove(board, r, c, player) {
  const nb = board.map(row => [...row]);
  nb[r][c] = player;
  for (const [fr, fc] of getFlips(nb, r, c, player)) nb[fr][fc] = player;
  return nb;
}

function countPieces(board) {
  let B = 0, W = 0;
  for (const row of board) for (const cell of row) {
    if (cell === "B") B++; else if (cell === "W") W++;
  }
  return { B, W };
}

function evaluate(board) {
  let score = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === "W") score += W[r][c];
      else if (board[r][c] === "B") score -= W[r][c];
    }
  score += getValidMoves(board, "W").length * 3;
  score -= getValidMoves(board, "B").length * 3;
  return score;
}

function minimax(board, depth, alpha, beta, maximizing) {
  const player = maximizing ? "W" : "B";
  const moves = getValidMoves(board, player);
  if (depth === 0 || moves.length === 0) return evaluate(board);
  if (maximizing) {
    let best = -Infinity;
    for (const [r, c] of moves) {
      best = Math.max(best, minimax(applyMove(board, r, c, "W"), depth-1, alpha, beta, false));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const [r, c] of moves) {
      best = Math.min(best, minimax(applyMove(board, r, c, "B"), depth-1, alpha, beta, true));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(board) {
  const moves = getValidMoves(board, "W");
  let best = -Infinity, bestMove = moves[0];
  for (const [r, c] of moves) {
    const score = minimax(applyMove(board, r, c, "W"), 4, -Infinity, Infinity, false);
    if (score > best) { best = score; bestMove = [r, c]; }
  }
  return bestMove;
}

function checkGameOver(board) {
  const bMoves = getValidMoves(board, "B");
  const wMoves = getValidMoves(board, "W");
  if (bMoves.length === 0 && wMoves.length === 0) {
    const { B, W: Wc } = countPieces(board);
    return B > Wc ? "win" : Wc > B ? "lose" : "draw";
  }
  return null;
}

export default function Reversi({ onBack }) {
  const { user } = useAuth();
  const [board, setBoard] = useState(initBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const tutorial = useTutorial("reversi");

  const validMoveKeys = playerTurn && !result && !thinking
    ? getValidMoves(board, "B").map(([r, c]) => `${r}-${c}`)
    : [];

  useEffect(() => {
    if (tutorial.active) return;
    if (playerTurn || result || thinking) return;
    const aiMoves = getValidMoves(board, "W");
    if (aiMoves.length === 0) {
      const over = checkGameOver(board);
      if (over) { setResult(over); return; }
      setPlayerTurn(true);
      return;
    }
    setThinking(true);
    const t = setTimeout(() => {
      const [r, c] = getBestMove(board);
      const nb = applyMove(board, r, c, "W");
      setBoard(nb);
      const over = checkGameOver(nb);
      if (over) { setResult(over); setThinking(false); return; }
      if (getValidMoves(nb, "B").length === 0) {
        setPlayerTurn(false);
      } else {
        setPlayerTurn(true);
      }
      setThinking(false);
    }, 450);
    return () => clearTimeout(t);
  }, [playerTurn, board, result]);

  useEffect(() => {
    if (!result || !user || saving || tutorial.active) return;
    setSaving(true);
    const { B, W: Wc } = countPieces(board);
    const dur = Math.round((Date.now() - startTime) / 1000);
    api.recordGame("reversi", result === "win" ? "win" : result === "draw" ? "draw" : "loss", dur, B, Wc)
      .catch(console.error)
      .finally(() => setSaving(false));
  }, [result]);

  function handleCellClick(r, c) {
    if (!playerTurn || result || thinking) return;

    if (tutorial.active) {
      const hm = tutorial.highlightMove;
      if (!hm || hm[0] !== r || hm[1] !== c) return;
      if (getFlips(board, r, c, "B").length === 0) return;
      const nb = applyMove(board, r, c, "B");
      setBoard(nb);
      const over = checkGameOver(nb);
      if (over) { setResult(over); tutorial.advance(); return; }
      if (tutorial.aiMove !== null) {
        setPlayerTurn(false);
        setTimeout(() => {
          const [ar, ac] = tutorial.aiMove;
          const nb2 = applyMove(nb, ar, ac, "W");
          setBoard(nb2);
          const over2 = checkGameOver(nb2);
          if (over2) { setResult(over2); }
          else setPlayerTurn(true);
          tutorial.advance();
        }, 500);
      } else {
        tutorial.advance();
      }
      return;
    }

    if (getFlips(board, r, c, "B").length === 0) return;
    const nb = applyMove(board, r, c, "B");
    setBoard(nb);
    const over = checkGameOver(nb);
    if (over) { setResult(over); return; }
    if (getValidMoves(nb, "W").length === 0) {
      setPlayerTurn(true);
    } else {
      setPlayerTurn(false);
    }
  }

  function reset() {
    setBoard(initBoard());
    setPlayerTurn(true);
    setThinking(false);
    setResult(null);
    setHoverCell(null);
  }

  function handleStartTutorial() { reset(); tutorial.start(); }
  function handleExitTutorial() { tutorial.exit(); reset(); }

  const { B, W: Wc } = countPieces(board);

  const statusText = result
    ? result === "win" ? `You Win!  (${B} – ${Wc})`
      : result === "draw" ? "It's a Draw!"
      : `AI Wins!  (${Wc} – ${B})`
    : thinking ? "AI is thinking..."
    : playerTurn
      ? validMoveKeys.length > 0 ? "Your turn  (Black)" : "No moves — AI plays again"
      : "AI's turn  (White)";

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
          <h2 className="game-title" style={{ color: "#22d3ee" }}>Reversi</h2>
          <button className="tips-toggle" onClick={() => setShowTips(t => !t)}>{showTips ? "✕" : "?"}</button>
          <button className="tutorial-toggle" onClick={tutorial.active ? handleExitTutorial : handleStartTutorial}>
            {tutorial.active ? "Exit Tutorial" : "Tutorial"}
          </button>
        </div>
        <GameTips {...GAME_TIPS.reversi} isOpen={showTips} />
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

        <div className="rev-score-row">
          <div className="rev-score-chip rev-black-chip">Black (You) — {B}</div>
          <div className="rev-score-chip rev-white-chip">White (AI) — {Wc}</div>
        </div>

        <div className="rev-board" onMouseLeave={() => setHoverCell(null)}>
          {board.map((row, r) =>
            row.map((disc, c) => {
              const key = `${r}-${c}`;
              const isValid = validMoveKeys.includes(key);
              const isHover = hoverCell === key && isValid;
              const isHighlight = tutorial.active && tutorial.highlightMove &&
                tutorial.highlightMove[0] === r && tutorial.highlightMove[1] === c;
              return (
                <div
                  key={key}
                  className={`rev-cell ${isValid ? "rev-valid" : ""} ${isHover ? "rev-hover" : ""} ${isHighlight ? "tutorial-highlight" : ""}`}
                  onMouseEnter={() => setHoverCell(key)}
                  onClick={() => handleCellClick(r, c)}
                >
                  {disc ? (
                    <span className={`rev-disc ${disc === "B" ? "rev-black" : "rev-white"}`} />
                  ) : isHover ? (
                    <span className="rev-disc rev-ghost" />
                  ) : isValid ? (
                    <span className="rev-dot" />
                  ) : null}
                </div>
              );
            })
          )}
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
