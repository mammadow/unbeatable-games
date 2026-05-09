export const TUTORIAL_SCRIPTS = {
  tictactoe: {
    title: "Tic Tac Toe Tutorial",
    steps: [
      {
        text: "Always start with the center square. It's part of 4 out of 8 winning lines — more than any other position.",
        move: 4,
        aiMove: 0,
      },
      {
        text: "The AI took the top-left corner. Take the opposite corner (bottom-right) to create diagonal threats.",
        move: 8,
        aiMove: 2,
      },
      {
        text: "The AI blocked your diagonal. Take the bottom-left corner to set up a fork — two threats at once.",
        move: 6,
        aiMove: 3,
      },
      {
        text: "The AI had to block the left column. Now play the middle-right to force another block.",
        move: 5,
        aiMove: 7,
      },
      {
        text: "The AI blocked again. Take the last spot. Against perfect Minimax AI, a draw is the best possible result!",
        move: 1,
        aiMove: null,
      },
    ],
  },

  "number-target": {
    title: "Number Target Tutorial",
    steps: [
      {
        text: "The AI opened with 1 (total: 1). The secret: always aim for multiples of 11. Add 10 to reach 11!",
        preAiMove: 1,
        move: 10,
        aiMove: 5,
      },
      {
        text: "Total is 16. The AI added 5, so you add 6 (because 5 + 6 = 11). This brings you to 22 — the next multiple of 11.",
        move: 6,
        aiMove: 7,
      },
      {
        text: "Total is 29. The AI added 7, so you add 4 (7 + 4 = 11) to reach 33. See the pattern?",
        move: 4,
        aiMove: 3,
      },
      {
        text: "Total is 36. The AI added 3, you add 8 (3 + 8 = 11) to reach 44. You're locking in control!",
        move: 8,
        aiMove: 9,
      },
      {
        text: "Total is 53. The AI added 9, you add 2 (9 + 2 = 11) to reach 55. The AI can't escape this pattern.",
        move: 2,
        aiMove: 6,
      },
      {
        text: "Total is 61. The AI added 6, you add 5 (6 + 5 = 11) to reach 66. Almost there!",
        move: 5,
        aiMove: 8,
      },
      {
        text: "Total is 74. The AI added 8, you add 3 (8 + 3 = 11) to reach 77. Two more rounds!",
        move: 3,
        aiMove: 4,
      },
      {
        text: "Total is 81. The AI added 4, you add 7 (4 + 7 = 11) to reach 88. One final round.",
        move: 7,
        aiMove: 6,
      },
      {
        text: "Total is 94. Add 6 to reach exactly 100 — you win! The key: whatever the AI adds (X), you add (11 - X).",
        move: 6,
        aiMove: null,
      },
    ],
  },

  "connect-four": {
    title: "Connect Four Tutorial",
    steps: [
      {
        text: "Always start with the center column. It's part of the most possible four-in-a-row combinations.",
        move: 3,
        aiMove: 4,
      },
      {
        text: "The AI played to the right. Play column 2 (left of center) to start building a horizontal line.",
        move: 2,
        aiMove: 5,
      },
      {
        text: "The AI is expanding right. Play column 1 — you now have three in a row on the bottom (columns 1, 2, 3)!",
        move: 1,
        aiMove: 6,
      },
      {
        text: "The AI couldn't block both sides! Play column 0 to connect four across the bottom. You win!",
        move: 0,
        aiMove: null,
      },
    ],
  },

  "memory-match": {
    title: "Memory Match Tutorial",
    fixedCards: ["★", "♦", "✦", "♥", "⬟", "▲", "◈", "⬡", "⬡", "◈", "▲", "⬟", "♥", "✦", "♦", "★"],
    steps: [
      {
        text: "Start by exploring! Flip cards 1 and 2 to discover what's there. Even if they don't match, remember their symbols for later.",
        move: [0, 1],
        aiMove: [7, 8],
      },
      {
        text: "The AI found a match (both ⬡)! Now flip cards 3 and 4 to keep learning the board. Each flip builds your mental map.",
        move: [2, 3],
        aiMove: [9, 10],
      },
      {
        text: "Neither pair matched — but now you know where those symbols are. Flip cards 5 and 6 to reveal more.",
        move: [4, 5],
        aiMove: [11, 12],
      },
      {
        text: "Now use your memory! Card 14 (row 4, col 3) and card 2 (row 1, col 3) are both ✦. Match them!",
        move: [13, 2],
        aiMove: [14, 1],
      },
      {
        text: "Great recall! Now cards 16 and 1 are both ★. Matching pairs from memory is how you beat the AI!",
        move: [15, 0],
        aiMove: null,
      },
    ],
  },

  rps: {
    title: "Rock Paper Scissors Tutorial",
    steps: [
      {
        text: "Round 1: The AI plays randomly for the first 3 rounds. Start with Rock — a solid, aggressive opener.",
        move: "rock",
        aiMove: "scissors",
      },
      {
        text: "You won! Now play Paper. Varying your moves is critical — repetition is what the AI exploits.",
        move: "paper",
        aiMove: "paper",
      },
      {
        text: "A draw. Play Scissors to complete the cycle. After this round, the AI starts analyzing your patterns!",
        move: "scissors",
        aiMove: "rock",
      },
      {
        text: "The AI won with Rock. It's now tracking your moves. It expects you to vary — play Rock again to surprise it.",
        move: "rock",
        aiMove: "rock",
      },
      {
        text: "A draw! The AI predicted Paper since you've used Rock twice. The key: be unpredictable. The AI counters your most frequent move.",
        move: "paper",
        aiMove: "scissors",
      },
    ],
  },

  reversi: {
    title: "Reversi Tutorial",
    steps: [
      {
        text: "Place your disc at the left of center. This flips the white disc and gives you three in a row. In early game, control the center!",
        move: [2, 1],
        aiMove: [1, 3],
      },
      {
        text: "The AI expanded upward. Play to the right side to flip back territory and spread your influence across the board.",
        move: [3, 4],
        aiMove: [4, 1],
      },
      {
        text: "The AI took a lower position. Recapture the middle by playing below — connected pieces are harder to outflank!",
        move: [4, 2],
        aiMove: null,
      },
    ],
  },
};
