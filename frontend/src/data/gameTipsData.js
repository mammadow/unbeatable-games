export const GAME_TIPS = {
  tictactoe: {
    objective: "Get three X marks in a row (horizontal, vertical, or diagonal) before the AI does.",
    rules: [
      "You play as X, AI plays as O",
      "Players alternate placing marks on a 3x3 grid",
      "First to get 3 in a row wins; if the board fills up, it's a draw",
    ],
    tips: [
      "Always take the center square if it's available — it's part of the most winning lines",
      "If the AI takes the center, play a corner to maximize your chances",
      "A draw is the best possible outcome against this AI",
      "Watch for fork opportunities where you threaten two lines at once",
      "Block the AI's two-in-a-row before building your own",
    ],
    algorithm: {
      name: "Minimax with Alpha-Beta Pruning",
      description: "The AI explores every possible future game state as a tree of moves. It assumes both players play perfectly — maximizing its own score and minimizing yours. Alpha-Beta Pruning cuts off branches that can't affect the final decision, making the search much faster. On a 3x3 board, this achieves perfect play — the AI never loses.",
    },
  },
  "number-target": {
    objective: "Be the first player to reach exactly 100 by adding numbers each turn.",
    rules: [
      "The game starts at 0 and players take turns adding 1–10",
      "AI goes first, then you alternate",
      "The first player to reach exactly 100 wins",
    ],
    tips: [
      "The key numbers are multiples of 11: 11, 22, 33, 44, 55, 66, 77, 88",
      "If the AI adds X, you should add (11 - X) to stay on the pattern",
      "The player who reaches a multiple of 11 controls the game",
      "Since the AI goes first and takes position 1, it has the mathematical advantage",
      "Study the pattern: the AI's strategy is based on modular arithmetic",
    ],
    algorithm: {
      name: "Nim Game Theory (Modular Arithmetic)",
      description: "This is a variant of the classic Nim game. The AI uses modular arithmetic: it always moves to a position where (100 - total) is divisible by 11. From any such position, whatever you add (X), the AI adds (11 - X), maintaining control. Since both players add 1-10 and 1 + 10 = 11, the AI locks into a winning sequence by going first.",
    },
  },
  "connect-four": {
    objective: "Connect four of your discs in a row — horizontally, vertically, or diagonally.",
    rules: [
      "You play Yellow, AI plays Red",
      "Drop discs into any column — they fall to the lowest available row",
      "First to connect 4 in a row wins; if the board fills, it's a draw",
    ],
    tips: [
      "Control the center column — it gives access to the most possible four-in-a-row combinations",
      "Build threats on multiple lines simultaneously to create a forced win",
      "The AI looks 6 moves ahead — avoid obvious traps by thinking ahead yourself",
      "Diagonal threats are harder to spot — use them to your advantage",
      "Watch for 'double threats' where one move creates two ways to win",
    ],
    algorithm: {
      name: "Minimax with Positional Evaluation (Depth 6)",
      description: "The AI uses Minimax search looking 6 moves ahead. It evaluates board positions by scoring 'windows' of 4 cells — giving high value to near-complete lines and penalizing opponent threats. Center column discs get bonus points since they contribute to more combinations. Alpha-Beta Pruning eliminates irrelevant branches, and moves are ordered center-first for efficiency.",
    },
  },
  "memory-match": {
    objective: "Find more matching pairs than the AI by remembering card positions.",
    rules: [
      "16 cards (8 pairs) are shuffled face-down",
      "Flip two cards per turn — if they match, you score a point",
      "You and AI alternate turns; the player with more pairs wins",
    ],
    tips: [
      "The AI has perfect memory — it never forgets a card it has seen",
      "Pay close attention to what the AI flips — those cards are revealed to you too",
      "Try to remember positions in a pattern (rows, columns) rather than random spots",
      "If you're unsure, flip an unknown card first to learn new information",
      "Focus on matching pairs you've already seen rather than exploring new cards",
    ],
    algorithm: {
      name: "Perfect Memory Strategy",
      description: "The AI stores every card it has ever seen (both its own flips and yours) in a memory map. Each turn, it first checks if it knows two cards with the same symbol — if so, it matches them instantly. Otherwise, it flips unknown cards to discover new symbols. This simulates an opponent with flawless recall, making it extremely difficult to beat.",
    },
  },
  rps: {
    objective: "Win more rounds than the AI in a best-of-7 match.",
    rules: [
      "Rock beats Scissors, Scissors beats Paper, Paper beats Rock",
      "Play 7 rounds total — most wins takes the match",
      "Ties don't count as wins for either side",
    ],
    tips: [
      "The AI analyzes your move history and predicts your next move after 3 rounds",
      "Avoid repeating the same move — the AI will detect and counter your patterns",
      "Try to be genuinely random in your first 3 moves before the AI starts learning",
      "Mix up your strategy mid-game to throw off the AI's pattern detection",
      "The AI weights your recent moves more heavily — exploit this by switching strategies",
    ],
    algorithm: {
      name: "Frequency Analysis + Pattern Detection",
      description: "For the first 3 rounds, the AI picks randomly. After that, it tracks how often you play each move (rock/paper/scissors) across all rounds, with extra weight on your last 3 moves. It identifies your most frequently played move and counters it. For example, if you favor Rock, it plays Paper. Being truly random is the only way to avoid its predictions.",
    },
  },
  reversi: {
    objective: "Have more pieces on the board than the AI when no more moves can be made.",
    rules: [
      "You play Black, AI plays White on a 6x6 board",
      "Place a disc to outflank opponent's discs — they flip to your color",
      "If you can't make a valid move, your turn is skipped",
      "Game ends when neither player can move",
    ],
    tips: [
      "Corners are the most valuable squares — they can never be flipped once captured",
      "Avoid placing discs next to empty corners — it gives the AI corner access",
      "Mobility matters: having more available moves gives you strategic advantage",
      "In the early game, focus on controlling the center rather than capturing many pieces",
      "Edge pieces are strong because they can only be outflanked from one direction",
    ],
    algorithm: {
      name: "Minimax with Position Weights (Depth 4)",
      description: "The AI uses Minimax search with Alpha-Beta Pruning, looking 4 moves ahead. Each board position is scored using a weight matrix: corners are worth 100 points, edges 10, and squares adjacent to corners are penalized (-20 to -50) since they can give the opponent corner access. The AI also values mobility — having more valid moves available is worth bonus points.",
    },
  },
};
