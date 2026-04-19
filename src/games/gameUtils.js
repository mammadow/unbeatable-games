// Common utility functions for all games

/**
 * Introduces difficulty by making AI weaker
 * Easy: random choice
 * Medium: 50% chance of random, 50% optimal
 * Hard: always optimal
 */
export function applyDifficulty(optimalMove, allMoves, difficulty) {
  if (difficulty === "easy") {
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }

  if (difficulty === "medium") {
    return Math.random() < 0.5 ? optimalMove : allMoves[Math.floor(Math.random() * allMoves.length)];
  }

  // hard
  return optimalMove;
}

/**
 * Creates a delay for AI moves to feel more natural
 */
export function getAIDelay(difficulty) {
  if (difficulty === "easy") return 300;
  if (difficulty === "medium") return 600;
  return 1000; // hard - slower for dramatic effect
}

/**
 * Delay promise helper
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
