import { useState, useEffect } from "react";
import {
  initializeBoard,
  getWinner,
  isGameOver,
  getGameStatus,
  makePlayerMove,
  getAIMove,
  makeAIMove,
  getWinningLine
} from "./tictactoe";
import { getAIDelay, delay } from "./gameUtils";
import GameInfo from "../components/GameInfo";

function TicTacToeGame() {
  const [board, setBoard] = useState(initializeBoard());
  const [difficulty, setDifficulty] = useState("medium");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [aiResponseMs, setAiResponseMs] = useState(null);

  // Handle player move
  const handleCellClick = async (index) => {
    if (!playerTurn || gameOver || board[index] !== null || aiThinking) return;

    try {
      const newBoard = makePlayerMove(board, index);
      setBoard(newBoard);

      const status = getGameStatus(newBoard);
      if (status === "won") {
        setWinner("player");
        setGameOver(true);
        setWinningLine(getWinningLine(newBoard));
        return;
      }

      if (status === "draw") {
        setGameOver(true);
        setWinner("draw");
        return;
      }

      setPlayerTurn(false);
      await delay(getAIDelay(difficulty));

      // AI move
      setAiThinking(true);
      const aiStart = performance.now();
      const aiMove = getAIMove(newBoard, difficulty);
      const aiEnd = performance.now();
      setAiResponseMs(Math.round(aiEnd - aiStart));

      const boardAfterAI = makeAIMove(newBoard, aiMove);
      setBoard(boardAfterAI);
      setAiThinking(false);

      const aiStatus = getGameStatus(boardAfterAI);
      if (aiStatus === "lost") {
        setWinner("ai");
        setGameOver(true);
        setWinningLine(getWinningLine(boardAfterAI));
        return;
      }

      if (aiStatus === "draw") {
        setGameOver(true);
        setWinner("draw");
        return;
      }

      setPlayerTurn(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRestart = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setWinner(null);
    setPlayerTurn(true);
    setAiThinking(false);
    setWinningLine(null);
    setAiResponseMs(null);
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    handleRestart();
  };

  return (
    <div className="game-wrapper tictactoe-wrapper">
      <div className="game-controls">
        <div className="difficulty-selector">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => handleDifficultyChange(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          className="info-btn"
          onClick={() => setShowInfo(!showInfo)}
          title="Show rules"
        >
          ℹ️
        </button>
      </div>

      {showInfo && (
        <GameInfo
          title="Tic Tac Toe"
          objective="Get three of your marks in a row (horizontal, vertical, or diagonal) before the AI does."
          rules={[
            "Take turns placing X's and O's on a 3×3 grid",
            "First player to get 3 in a row wins",
            "If all 9 squares are filled with no winner, it's a draw",
            "You play as X (go first), AI plays as O"
          ]}
          tips={{
            easy: "AI makes random moves - try to control the center",
            medium: "AI plays semi-strategically - defend and attack",
            hard: "AI plays perfectly - impossible to beat without luck"
          }}
        />
      )}

      <div className="game-status">
        {gameOver ? (
          <div className={`status-message ${winner}`}>
            {winner === "player" ? "🎉 You Won!" : winner === "ai" ? "AI Won" : "Draw"}
          </div>
        ) : (
          <div className="status-message playing">
            {aiThinking ? "🤔 AI thinking..." : playerTurn ? "Your turn (X)" : "AI's turn (O)"}
          </div>
        )}
      </div>

      {aiResponseMs !== null && (
        <div className={`ai-metric ${aiResponseMs < 500 ? "good" : "slow"}`}>
          AI response: {aiResponseMs}ms {aiResponseMs < 500 ? "(target met)" : "(above target)"}
        </div>
      )}

      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`ttt-cell ${winningLine?.includes(i) ? "win" : ""} ${
              cell === "X" ? "x" : cell === "O" ? "o" : ""
            }`}
            onClick={() => handleCellClick(i)}
            disabled={gameOver || !playerTurn || aiThinking}
          >
            {cell}
          </button>
        ))}
      </div>

      {gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default TicTacToeGame;
