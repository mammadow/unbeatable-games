import { describe, it, expect } from "vitest";
import {
  initializeBoard,
  getValidColumns,
  dropDisc,
  getGameStatus,
  isGameOver,
  getAIMove
} from "./connectFour";

describe("connect four logic", () => {
  it("initializes 6x7 empty board", () => {
    const board = initializeBoard();
    expect(board).toHaveLength(42);
    expect(board.every(cell => cell === null)).toBe(true);
  });

  it("drops disc to the bottom-most row", () => {
    const board = initializeBoard();
    const next = dropDisc(board, 0, "player");
    expect(next[35]).toBe("player");
  });

  it("detects horizontal win for player", () => {
    let board = initializeBoard();
    board = dropDisc(board, 0, "player");
    board = dropDisc(board, 1, "player");
    board = dropDisc(board, 2, "player");
    board = dropDisc(board, 3, "player");

    expect(getGameStatus(board)).toBe("won");
    expect(isGameOver(board)).toBe(true);
  });

  it("returns only valid columns when one is full", () => {
    let board = initializeBoard();
    for (let i = 0; i < 6; i++) {
      board = dropDisc(board, 0, i % 2 === 0 ? "player" : "ai");
    }

    const valid = getValidColumns(board);
    expect(valid.includes(0)).toBe(false);
    expect(valid.length).toBe(6);
  });

  it("hard AI returns a playable column", () => {
    const board = initializeBoard();
    const move = getAIMove(board, "hard");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(6);
  });
});
