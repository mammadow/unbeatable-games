// Connect Four game logic with Alpha-Beta Minimax
// 7 columns × 6 rows
// Win: 4 in a row (horizontal, vertical, diagonal)

import { applyDifficulty } from "./gameUtils";

const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;
const PLAYER = "player";
const AI = "ai";
const EMPTY = null;

/**
 * Initialize empty board
 */
export function initializeBoard() {
  return Array(ROWS * COLS).fill(EMPTY);
}

/**
 * Get valid columns (where a disc can be dropped)
 */
export function getValidColumns(board) {
  const cols = [];
  for (let col = 0; col < COLS; col++) {
    if (board[col] === EMPTY) {
      cols.push(col);
    }
  }
  return cols;
}

/**
 * Drop a disc in a column
 * Returns new board or null if column is full
 */
export function dropDisc(board, col, player) {
  if (board[col] !== EMPTY) return null; // column full

  const newBoard = [...board];
  // Find the lowest empty row in this column
  for (let row = ROWS - 1; row >= 0; row--) {
    const idx = row * COLS + col;
    if (newBoard[idx] === EMPTY) {
      newBoard[idx] = player;
      return newBoard;
    }
  }
  return null;
}

/**
 * Check for winner
 */
function checkWinner(board, player) {
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      let match = true;
      for (let i = 0; i < WIN_LENGTH; i++) {
        if (board[idx + i] !== player) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  // Vertical
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      let match = true;
      for (let i = 0; i < WIN_LENGTH; i++) {
        if (board[idx + i * COLS] !== player) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  // Diagonal (top-left to bottom-right)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      let match = true;
      for (let i = 0; i < WIN_LENGTH; i++) {
        if (board[idx + i * COLS + i] !== player) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  // Diagonal (bottom-left to top-right)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      let match = true;
      for (let i = 0; i < WIN_LENGTH; i++) {
        if (board[idx - i * COLS + i] !== player) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  return false;
}

/**
 * Evaluate board position for AI
 * Higher score = better for AI
 */
function evaluateBoard(board) {
  let score = 0;

  // Check all possible 4-cell windows
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      score += evaluateWindow(
        [board[idx], board[idx + 1], board[idx + 2], board[idx + 3]]
      );
    }
  }

  // Vertical
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      score += evaluateWindow([
        board[idx],
        board[idx + COLS],
        board[idx + COLS * 2],
        board[idx + COLS * 3]
      ]);
    }
  }

  // Diagonal (top-left to bottom-right)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      score += evaluateWindow([
        board[idx],
        board[idx + COLS + 1],
        board[idx + (COLS + 1) * 2],
        board[idx + (COLS + 1) * 3]
      ]);
    }
  }

  // Diagonal (bottom-left to top-right)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const idx = row * COLS + col;
      score += evaluateWindow([
        board[idx],
        board[idx - COLS + 1],
        board[idx - (COLS - 1) * 2],
        board[idx - (COLS - 1) * 3]
      ]);
    }
  }

  // Prefer center columns
  for (let row = 0; row < ROWS; row++) {
    const idx = row * COLS + 3;
    if (board[idx] === AI) score += 3;
  }

  return score;
}

/**
 * Evaluate a window of 4 cells
 */
function evaluateWindow(window) {
  const aiCount = window.filter(c => c === AI).length;
  const playerCount = window.filter(c => c === PLAYER).length;
  const emptyCount = window.filter(c => c === EMPTY).length;

  if (aiCount === 4) return 1000;
  if (playerCount === 4) return -1000;

  if (aiCount === 3 && emptyCount === 1) return 100;
  if (playerCount === 3 && emptyCount === 1) return -100;

  if (aiCount === 2 && emptyCount === 2) return 10;
  if (playerCount === 2 && emptyCount === 2) return -10;

  if (aiCount === 1 && emptyCount === 3) return 1;
  if (playerCount === 1 && emptyCount === 3) return -1;

  return 0;
}

/**
 * Alpha-beta minimax with depth limit
 */
function minimax(board, depth, isMaximizing, alpha, beta, maxDepth) {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  if (checkWinner(board, AI)) return 10000 - (maxDepth - depth);
  if (checkWinner(board, PLAYER)) return -10000 + (maxDepth - depth);

  const validCols = getValidColumns(board);
  if (validCols.length === 0) return 0; // draw

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let col of validCols) {
      const newBoard = dropDisc(board, col, AI);
      const score = minimax(newBoard, depth - 1, false, alpha, beta, maxDepth);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break; // prune
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let col of validCols) {
      const newBoard = dropDisc(board, col, PLAYER);
      const score = minimax(newBoard, depth - 1, true, alpha, beta, maxDepth);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break; // prune
    }
    return minScore;
  }
}

/**
 * Find best move using alpha-beta minimax
 */
function findBestMove(board, difficulty) {
  const validCols = getValidColumns(board);
  if (validCols.length === 0) return null;

  // Adjust search depth based on difficulty
  const maxDepth = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;

  const moveScores = validCols.map(col => {
    const newBoard = dropDisc(board, col, AI);
    const score = minimax(newBoard, maxDepth, false, -Infinity, Infinity, maxDepth);
    return { col, score };
  });

  const bestMove = moveScores.reduce((best, move) =>
    move.score > best.score ? move : best
  );

  return bestMove.col;
}

/**
 * Get AI's move based on difficulty
 */
export function getAIMove(board, difficulty) {
  const validCols = getValidColumns(board);

  if (difficulty === "easy") {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  if (difficulty === "medium") {
    if (Math.random() < 0.6) {
      return findBestMove(board, "medium");
    }
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  return findBestMove(board, "hard");
}

/**
 * Check game status
 */
export function getGameStatus(board) {
  if (checkWinner(board, PLAYER)) return "won";
  if (checkWinner(board, AI)) return "lost";
  if (getValidColumns(board).length === 0) return "draw";
  return "playing";
}

/**
 * Check if game is over
 */
export function isGameOver(board) {
  return getGameStatus(board) !== "playing";
}
