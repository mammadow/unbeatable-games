import { useState } from "react";
import GameInfo from "../components/GameInfo";
import { delay, getAIDelay } from "./gameUtils";

const SIZE = 6;
const PLAYER = "player";
const AI = "ai";
const EMPTY = null;

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

const POSITION_WEIGHTS = [
  [120, -20, 20, 20, -20, 120],
  [-20, -40, -5, -5, -40, -20],
  [20, -5, 15, 15, -5, 20],
  [20, -5, 15, 15, -5, 20],
  [-20, -40, -5, -5, -40, -20],
  [120, -20, 20, 20, -20, 120]
];

function indexFrom(row, col) {
  return row * SIZE + col;
}

function createBoard() {
  const board = Array(SIZE * SIZE).fill(EMPTY);
  board[indexFrom(2, 2)] = AI;
  board[indexFrom(2, 3)] = PLAYER;
  board[indexFrom(3, 2)] = PLAYER;
  board[indexFrom(3, 3)] = AI;
  return board;
}

function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function getOpponent(player) {
  return player === PLAYER ? AI : PLAYER;
}

function getFlips(board, row, col, player) {
  const startIndex = indexFrom(row, col);
  if (board[startIndex] !== EMPTY) {
    return [];
  }

  const opponent = getOpponent(player);
  const flips = [];

  DIRECTIONS.forEach(([rowDelta, colDelta]) => {
    let currentRow = row + rowDelta;
    let currentCol = col + colDelta;
    const line = [];

    while (inBounds(currentRow, currentCol)) {
      const currentIndex = indexFrom(currentRow, currentCol);
      const currentCell = board[currentIndex];

      if (currentCell === opponent) {
        line.push(currentIndex);
      } else if (currentCell === player) {
        if (line.length > 0) {
          flips.push(...line);
        }
        return;
      } else {
        return;
      }

      currentRow += rowDelta;
      currentCol += colDelta;
    }
  });

  return flips;
}

function getValidMoves(board, player) {
  const moves = [];

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const index = indexFrom(row, col);
      const flips = getFlips(board, row, col, player);

      if (flips.length > 0) {
        moves.push({ index, flips });
      }
    }
  }

  return moves;
}

function applyMove(board, move, player) {
  const nextBoard = [...board];
  nextBoard[move.index] = player;
  move.flips.forEach((flipIndex) => {
    nextBoard[flipIndex] = player;
  });
  return nextBoard;
}

function countPieces(board) {
  return board.reduce(
    (counts, cell) => {
      if (cell === PLAYER) {
        counts.player += 1;
      }
      if (cell === AI) {
        counts.ai += 1;
      }
      return counts;
    },
    { player: 0, ai: 0 }
  );
}

function evaluateBoard(board) {
  const counts = countPieces(board);
  let score = (counts.ai - counts.player) * 2;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const index = indexFrom(row, col);
      if (board[index] === AI) {
        score += POSITION_WEIGHTS[row][col];
      }
      if (board[index] === PLAYER) {
        score -= POSITION_WEIGHTS[row][col];
      }
    }
  }

  score += (getValidMoves(board, AI).length - getValidMoves(board, PLAYER).length) * 8;
  return score;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  const aiMoves = getValidMoves(board, AI);
  const playerMoves = getValidMoves(board, PLAYER);

  if (depth === 0 || (aiMoves.length === 0 && playerMoves.length === 0)) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    if (aiMoves.length === 0) {
      return minimax(board, depth - 1, false, alpha, beta);
    }

    let bestScore = -Infinity;
    for (const move of aiMoves) {
      const nextBoard = applyMove(board, move, AI);
      const score = minimax(nextBoard, depth - 1, false, alpha, beta);
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }

  if (playerMoves.length === 0) {
    return minimax(board, depth - 1, true, alpha, beta);
  }

  let bestScore = Infinity;
  for (const move of playerMoves) {
    const nextBoard = applyMove(board, move, PLAYER);
    const score = minimax(nextBoard, depth - 1, true, alpha, beta);
    bestScore = Math.min(bestScore, score);
    beta = Math.min(beta, bestScore);

    if (beta <= alpha) {
      break;
    }
  }

  return bestScore;
}

function chooseAiMove(board, difficulty) {
  const validMoves = getValidMoves(board, AI);
  if (validMoves.length === 0) {
    return null;
  }

  if (difficulty === "easy") {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  const depth = difficulty === "medium" ? 2 : 4;

  return validMoves.reduce(
    (bestMove, move) => {
      const nextBoard = applyMove(board, move, AI);
      const score = minimax(nextBoard, depth - 1, false, -Infinity, Infinity);
      if (score > bestMove.score) {
        return { ...move, score };
      }
      return bestMove;
    },
    { ...validMoves[0], score: -Infinity }
  );
}

function ReversiGame() {
  const [board, setBoard] = useState(createBoard());
  const [difficulty, setDifficulty] = useState("medium");
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [busy, setBusy] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [lastMove, setLastMove] = useState("Black goes first.");
  const [aiResponseMs, setAiResponseMs] = useState(null);

  const finishGame = (finalBoard) => {
    const counts = countPieces(finalBoard);

    if (counts.player > counts.ai) {
      setWinner("player");
    } else if (counts.ai > counts.player) {
      setWinner("ai");
    } else {
      setWinner("draw");
    }

    setGameOver(true);
    setBusy(false);
    setAiThinking(false);
  };

  const handleRestart = () => {
    setBoard(createBoard());
    setCurrentPlayer(PLAYER);
    setGameOver(false);
    setWinner(null);
    setBusy(false);
    setAiThinking(false);
    setShowInfo(false);
    setLastMove("Black goes first.");
    setAiResponseMs(null);
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    handleRestart();
  };

  const playAiTurns = async (startBoard) => {
    let workingBoard = startBoard;
    setCurrentPlayer(AI);
    setBusy(true);
    setAiThinking(true);

    while (true) {
      const aiMoves = getValidMoves(workingBoard, AI);
      const playerMoves = getValidMoves(workingBoard, PLAYER);

      if (aiMoves.length === 0 && playerMoves.length === 0) {
        finishGame(workingBoard);
        return;
      }

      if (aiMoves.length === 0) {
        setCurrentPlayer(PLAYER);
        setBusy(false);
        setAiThinking(false);
        return;
      }

      await delay(getAIDelay(difficulty));

      const aiStart = performance.now();
      const aiMove = chooseAiMove(workingBoard, difficulty);
      const aiEnd = performance.now();
      setAiResponseMs(Math.round(aiEnd - aiStart));

      if (!aiMove) {
        setCurrentPlayer(PLAYER);
        setBusy(false);
        setAiThinking(false);
        return;
      }

      workingBoard = applyMove(workingBoard, aiMove, AI);
      setBoard(workingBoard);
      setLastMove(`AI played ${String.fromCharCode(65 + (aiMove.index % SIZE))}${Math.floor(aiMove.index / SIZE) + 1} and flipped ${aiMove.flips.length} discs.`);

      const nextPlayerMoves = getValidMoves(workingBoard, PLAYER);
      const nextAiMoves = getValidMoves(workingBoard, AI);

      if (nextPlayerMoves.length === 0 && nextAiMoves.length === 0) {
        finishGame(workingBoard);
        return;
      }

      if (nextPlayerMoves.length === 0) {
        continue;
      }

      setCurrentPlayer(PLAYER);
      setBusy(false);
      setAiThinking(false);
      return;
    }
  };

  const handleCellClick = async (index) => {
    if (busy || aiThinking || gameOver || currentPlayer !== PLAYER) {
      return;
    }

    const validMoves = getValidMoves(board, PLAYER);
    const selectedMove = validMoves.find((move) => move.index === index);

    if (!selectedMove) {
      return;
    }

    const boardAfterPlayer = applyMove(board, selectedMove, PLAYER);
    setBoard(boardAfterPlayer);
    setLastMove(
      `You played ${String.fromCharCode(65 + (index % SIZE))}${Math.floor(index / SIZE) + 1} and flipped ${selectedMove.flips.length} discs.`
    );

    const nextPlayerMoves = getValidMoves(boardAfterPlayer, PLAYER);
    const nextAiMoves = getValidMoves(boardAfterPlayer, AI);

    if (nextPlayerMoves.length === 0 && nextAiMoves.length === 0) {
      finishGame(boardAfterPlayer);
      return;
    }

    if (nextAiMoves.length === 0) {
      setCurrentPlayer(PLAYER);
      setLastMove("AI has no move, you play again.");
      return;
    }

    await playAiTurns(boardAfterPlayer);
  };

  const validMoves = currentPlayer === PLAYER ? getValidMoves(board, PLAYER) : [];
  const counts = countPieces(board);

  const statusText = gameOver
    ? winner === "player"
      ? "You control the board."
      : winner === "ai"
        ? "AI controls the board."
        : "The board is tied."
    : aiThinking
      ? "AI is searching for the strongest flip..."
      : currentPlayer === PLAYER
        ? "Your turn. Capture as many discs as possible."
        : "AI turn."
  ;

  return (
    <div className="game-wrapper reversi-wrapper">
      <div className="game-controls">
        <div className="difficulty-selector">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(event) => handleDifficultyChange(event.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="info-btn" onClick={() => setShowInfo((value) => !value)} title="Show rules">
          ℹ️
        </button>
      </div>

      {showInfo && (
        <GameInfo
          title="Reversi"
          objective="Finish the board with more discs than the AI by trapping and flipping its pieces."
          rules={[
            "Black moves first",
            "A move must flip at least one opponent disc",
            "If a player has no legal move, the turn passes",
            "The game ends when neither side can move"
          ]}
          tips={{
            easy: "Focus on legal moves and try to keep corners open for yourself.",
            medium: "Control the edges and avoid giving away corners.",
            hard: "Corners and stable edges matter most against the AI."
          }}
        />
      )}

      <div className="game-status">
        <div className={`status-message ${gameOver ? winner : "playing"}`}>
          {statusText}
        </div>
      </div>

      {aiResponseMs !== null && (
        <div className={`ai-metric ${aiResponseMs < 500 ? "good" : "slow"}`}>
          AI response: {aiResponseMs}ms {aiResponseMs < 500 ? "(target met)" : "(above target)"}
        </div>
      )}

      <div className="scoreboard reversi-scoreboard">
        <div>
          <span className="score-label">You</span>
          <span className="score-value">{counts.player}</span>
        </div>
        <div>
          <span className="score-label">AI</span>
          <span className="score-value">{counts.ai}</span>
        </div>
      </div>

      <div className="reversi-board">
        {board.map((cell, index) => {
          const row = Math.floor(index / SIZE);
          const col = index % SIZE;
          const isValid = validMoves.some((move) => move.index === index);

          return (
            <button
              key={index}
              className={`reversi-cell ${isValid ? "valid" : ""}`}
              onClick={() => handleCellClick(index)}
              disabled={busy || aiThinking || gameOver || currentPlayer !== PLAYER || !isValid}
              title={`Row ${row + 1}, Column ${col + 1}`}
            >
              {cell && <span className={`reversi-piece ${cell === PLAYER ? "player" : "ai"}`} />}
              {isValid && !cell && <span className="reversi-valid-dot" />}
            </button>
          );
        })}
      </div>

      <div className="reversi-footer">
        <span>{lastMove}</span>
      </div>

      {gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default ReversiGame;
