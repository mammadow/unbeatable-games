import { describe, it, expect } from "vitest";
import {
  initializeGame,
  getValidMoves,
  makeMove,
  getGameStatus,
  checkWinner,
  findOptimalMove,
  getAIMove
} from "./numberTarget";

describe("number target logic", () => {
  it("initializes default game state", () => {
    const game = initializeGame();
    expect(game.currentSum).toBe(0);
    expect(game.target).toBe(100);
    expect(game.playerTurn).toBe(true);
  });

  it("returns valid moves near target", () => {
    expect(getValidMoves(95)).toEqual([1, 2, 3, 4, 5]);
  });

  it("updates sum and validates status", () => {
    const next = makeMove(90, 10);
    expect(next).toBe(100);
    expect(getGameStatus(next)).toBe("won");
    expect(checkWinner("player", next)).toBe("player");
  });

  it("finds immediate winning move", () => {
    expect(findOptimalMove(94)).toBe(6);
    expect(getAIMove(94, "hard")).toBe(6);
  });

  it("rejects invalid choices", () => {
    expect(() => makeMove(0, 0)).toThrow();
    expect(() => makeMove(0, 11)).toThrow();
  });
});
