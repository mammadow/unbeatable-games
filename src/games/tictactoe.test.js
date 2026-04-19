import { describe, it, expect } from "vitest";
import {
  initializeBoard,
  makePlayerMove,
  makeAIMove,
  getWinner,
  getGameStatus,
  getWinningLine,
  getAIMove
} from "./tictactoe";

describe("tictactoe logic", () => {
  it("initializes an empty board", () => {
    const board = initializeBoard();
    expect(board).toHaveLength(9);
    expect(board.every(cell => cell === null)).toBe(true);
  });

  it("detects winner and winning line", () => {
    const board = ["X", "X", "X", null, "O", null, "O", null, null];
    expect(getWinner(board)).toBe("X");
    expect(getWinningLine(board)).toEqual([0, 1, 2]);
    expect(getGameStatus(board)).toBe("won");
  });

  it("throws when trying to play occupied cell", () => {
    const board = ["X", null, null, null, null, null, null, null, null];
    expect(() => makePlayerMove(board, 0)).toThrow();
    expect(() => makeAIMove(board, 0)).toThrow();
  });

  it("hard AI takes immediate winning move", () => {
    const board = [
      "O", "O", null,
      "X", "X", null,
      null, null, null
    ];

    expect(getAIMove(board, "hard")).toBe(2);
  });
});
