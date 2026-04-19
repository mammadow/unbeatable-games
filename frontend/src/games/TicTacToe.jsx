import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkResult(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function minimax(board, isMax, alpha, beta) {
  const r = checkResult(board);
  if (r) {
    if (r.winner === "O") return 10;
    if (r.winner === "X") return -10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getBestMove(board) {
  let best = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false, -Infinity, Infinity);
      board[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

export default function TicTacToe({ onBack }) {
  const { user } = useAuth();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [winLine, setWinLine] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (playerTurn || result) return;
    setThinking(true);
    const t = setTimeout(() => {
      const nb = [...board];
      const move = getBestMove(nb);
      if (move !== -1) {
        nb[move] = "O";
        setBoard(nb);
        const r = checkResult(nb);
        if (r) { setResult(r.winner); setWinLine(r.line); }
        else setPlayerTurn(true);
      }
      setThinking(false);
    }, 380);
    return () => clearTimeout(t);
  }, [playerTurn, board, result]);

  function handleClick(i) {
    if (!playerTurn || board[i] || result || thinking) return;
    const nb = [...board];
    nb[i] = "X";
    setBoard(nb);
    const r = checkResult(nb);
    if (r) { setResult(r.winner); setWinLine(r.line); }
    else setPlayerTurn(false);
  }

  async function saveGame() {
    if (!user || !result || saving) return;
    setSaving(true);
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      await api.recordGame("tictactoe", result === "X" ? "win" : result === "draw" ? "draw" : "loss", duration, result === "X" ? 1 : 0, result === "O" ? 1 : 0);
    } catch (err) {
      console.error("Failed to save game:", err);
    }
    setSaving(false);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setPlayerTurn(true);
    setResult(null);
    setWinLine([]);
    setThinking(false);
  }

  const status = result
    ? result === "draw" ? "It's a Draw!" : result === "X" ? "You Win! 🎉" : "AI Wins!"
    : thinking ? "AI is thinking..." : playerTurn ? "Your turn  (X)" : "AI's turn  (O)";

  useEffect(() => {
    if (result) {
      saveGame();
    }
  }, [result]);

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
        <h2 className="game-title" style={{ color: "var(--gold)" }}>Tic Tac Toe</h2>
        <p className={`game-status ${result ? (result === "X" ? "status-win" : result === "draw" ? "status-draw" : "status-lose") : ""}`}>
          {status}
        </p>
        <div className="ttt-board-play">
          {board.map((cell, i) => (
            <button
              key={i}
              className={[
                "ttt-cell-play",
                cell === "X" ? "x" : cell === "O" ? "o" : "",
                winLine.includes(i) ? "win" : "",
                !cell && playerTurn && !result && !thinking ? "clickable" : "",
              ].join(" ")}
              onClick={() => handleClick(i)}
            >
              {cell}
            </button>
          ))}
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
