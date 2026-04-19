// Number Target game logic with Dynamic Programming strategy
// Goal: reach exactly 100 first
// Each turn: pick a number 1-10 and add to current sum

import { applyDifficulty } from "./gameUtils";

const TARGET = 100;
const MIN_CHOICE = 1;
const MAX_CHOICE = 10;

/**
 * The winning strategy for Number Target:
 * If (target - currentSum) % (MAX_CHOICE + 1) === 0, you're in a losing position
 * The opponent can always force you to lose by maintaining this invariant
 *
 * If you're in a winning position, add just enough so that after opponent's move,
 * the sum % 11 == 1 (which means target - sum = 11k for some k)
 */

/**
 * Check if a position is winning for the current player
 */
function isWinningPosition(currentSum, target = TARGET) {
  return (target - currentSum) % (MAX_CHOICE + 1) !== 0;
}

/**
 * Find the optimal move using DP strategy
 * Returns which number (1-10) to add
 */
export function findOptimalMove(currentSum, target = TARGET) {
  // If we can win immediately, do it
  for (let choice = MIN_CHOICE; choice <= MAX_CHOICE; choice++) {
    const newSum = currentSum + choice;
    if (newSum === target) {
      return choice;
    }
    if (newSum > target) break;
  }

  // Force opponent into losing position: make (target - newSum) % 11 === 0
  for (let choice = MIN_CHOICE; choice <= MAX_CHOICE; choice++) {
    const newSum = currentSum + choice;
    if ((target - newSum) % (MAX_CHOICE + 1) === 0) {
      return choice;
    }
  }

  // Fallback: just pick 1
  return MIN_CHOICE;
}

/**
 * Get AI's move based on difficulty
 */
export function getAIMove(currentSum, difficulty, target = TARGET) {
  const optimalMove = findOptimalMove(currentSum, target);
  const availableMoves = getValidMoves(currentSum, target);

  return applyDifficulty(optimalMove, availableMoves, difficulty);
}

/**
 * Get all valid moves from current position
 */
export function getValidMoves(currentSum, target = TARGET) {
  const moves = [];
  for (let i = MIN_CHOICE; i <= MAX_CHOICE; i++) {
    if (currentSum + i <= target) {
      moves.push(i);
    }
  }
  return moves.length > 0 ? moves : [MIN_CHOICE]; // ensure at least one move
}

/**
 * Apply player or AI move
 */
export function makeMove(currentSum, choice) {
  if (choice < MIN_CHOICE || choice > MAX_CHOICE) {
    throw new Error(`Choice must be between ${MIN_CHOICE} and ${MAX_CHOICE}`);
  }
  return currentSum + choice;
}

/**
 * Check game status
 */
export function getGameStatus(currentSum, target = TARGET) {
  if (currentSum === target) return "won";
  if (currentSum > target) return "invalid";
  return "playing";
}

/**
 * Check who won (for tracking)
 * Returns: 'player' | 'ai' | null
 */
export function checkWinner(lastMoveBy, sumAfterMove, target = TARGET) {
  if (sumAfterMove === target) {
    return lastMoveBy === "player" ? "player" : "ai";
  }
  return null;
}

/**
 * Initialize game
 */
export function initializeGame() {
  return {
    currentSum: 0,
    target: TARGET,
    playerTurn: true,
    gameOver: false,
    winner: null
  };
}
