// Tic Tac Toe game logic with Minimax AI

import { applyDifficulty } from "./gameUtils";

const EMPTY = null;
const PLAYER = "X";
const AI = "O";

/**
 * Evaluate the board state
 * Returns: 1 if AI wins, -1 if player wins, 0 if draw
 */
function evaluateBoard(board) {
  const winner = getWinner(board);
  if (winner === AI) return 1;
  if (winner === PLAYER) return -1;
  return 0;
}

/**
 * Check for winner or draw
 */
export function getWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * Check if game is over
 */
export function isGameOver(board) {
  return getWinner(board) !== null || board.every(cell => cell !== EMPTY);
}

/**
 * Get all available moves
 */
function getAvailableMoves(board) {
  return board.map((cell, idx) => (cell === EMPTY ? idx : null)).filter(idx => idx !== null);
}

/**
 * Minimax algorithm to find best move
 */
function minimax(board, isMaximizing, depth = 0) {
  const terminal = getWinner(board);
  if (terminal !== null) {
    return terminal === AI ? 10 - depth : depth - 10;
  }

  if (board.every(cell => cell !== EMPTY)) {
    return 0; // draw
  }

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    // AI's turn
    let best = -Infinity;
    for (let move of moves) {
      const newBoard = [...board];
      newBoard[move] = AI;
      const score = minimax(newBoard, false, depth + 1);
      best = Math.max(best, score);
    }
    return best;
  } else {
    // Player's turn
    let best = Infinity;
    for (let move of moves) {
      const newBoard = [...board];
      newBoard[move] = PLAYER;
      const score = minimax(newBoard, true, depth + 1);
      best = Math.min(best, score);
    }
    return best;
  }
}

/**
 * Find the best move for AI using minimax
 */
function findBestMove(board) {
  const moves = getAvailableMoves(board);
  let best = -Infinity;
  let bestMove = moves[0];

  for (let move of moves) {
    const newBoard = [...board];
    newBoard[move] = AI;
    const score = minimax(newBoard, false);
    if (score > best) {
      best = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Get AI's next move based on difficulty
 */
export function getAIMove(board, difficulty) {
  const optimalMove = findBestMove(board);
  const availableMoves = getAvailableMoves(board);

  return applyDifficulty(optimalMove, availableMoves, difficulty);
}

/**
 * Apply player move to board
 */
export function makePlayerMove(board, index) {
  if (board[index] !== EMPTY) {
    throw new Error("Cell already occupied");
  }
  const newBoard = [...board];
  newBoard[index] = PLAYER;
  return newBoard;
}

/**
 * Apply AI move to board
 */
export function makeAIMove(board, move) {
  if (board[move] !== EMPTY) {
    throw new Error("Cell already occupied");
  }
  const newBoard = [...board];
  newBoard[move] = AI;
  return newBoard;
}

/**
 * Check game status
 */
export function getGameStatus(board) {
  const winner = getWinner(board);
  if (winner === PLAYER) return "won";
  if (winner === AI) return "lost";
  if (board.every(cell => cell !== EMPTY)) return "draw";
  return "playing";
}

/**
 * Get winning line (for highlighting)
 */
export function getWinningLine(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

/**
 * Create initial board
 */
export function initializeBoard() {
  return Array(9).fill(EMPTY);
}
