import { useState, useEffect } from "react";
import {
  initializeBoard,
  getValidColumns,
  dropDisc,
  getGameStatus,
  getAIMove,
  isGameOver
} from "./connectFour";
import { getAIDelay, delay } from "./gameUtils";
import GameInfo from "../components/GameInfo";

function ConnectFourGame() {
  const [board, setBoard] = useState(initializeBoard());
  const [difficulty, setDifficulty] = useState("medium");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [dropCol, setDropCol] = useState(null);
  const [aiResponseMs, setAiResponseMs] = useState(null);

  // Handle player move
  const handleColumnClick = async (col) => {
    if (!playerTurn || gameOver || aiThinking) return;

    const validCols = getValidColumns(board);
    if (!validCols.includes(col)) return;

    try {
      // Drop disc with animation
      setDropCol(col);
      const newBoard = dropDisc(board, col, "player");

      if (!newBoard) return; // Column full

      await delay(500);
      setDropCol(null);
      setBoard(newBoard);

      const status = getGameStatus(newBoard);
      if (status === "won") {
        setWinner("player");
        setGameOver(true);
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
      const aiCol = getAIMove(newBoard, difficulty);
      const aiEnd = performance.now();
      setAiResponseMs(Math.round(aiEnd - aiStart));

      if (aiCol !== null) {
        setDropCol(aiCol);
        const boardAfterAI = dropDisc(newBoard, aiCol, "ai");
        await delay(500);
        setDropCol(null);
        setBoard(boardAfterAI);

        const aiStatus = getGameStatus(boardAfterAI);
        if (aiStatus === "lost") {
          setWinner("ai");
          setGameOver(true);
          setAiThinking(false);
          return;
        }

        if (aiStatus === "draw") {
          setGameOver(true);
          setWinner("draw");
          setAiThinking(false);
          return;
        }
      }

      setAiThinking(false);
      setPlayerTurn(true);
    } catch (err) {
      console.error("Error:", err);
      setAiThinking(false);
    }
  };

  const handleRestart = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setWinner(null);
    setPlayerTurn(true);
    setAiThinking(false);
    setDropCol(null);
    setAiResponseMs(null);
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    handleRestart();
  };

  const validColumns = getValidColumns(board);

  return (
    <div className="game-wrapper connectFour-wrapper">
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
          title="Connect Four"
          objective="Get four of your discs in a row (horizontal, vertical, or diagonal) before the AI does."
          rules={[
            "Take turns dropping red and yellow discs into columns",
            "Discs fall to the lowest available position in that column",
            "First to get 4 in a row wins",
            "If all 42 spaces are filled with no winner, it's a draw",
            "You play as red (go first), AI plays as yellow"
          ]}
          tips={{
            easy: "AI makes random moves - focus on building threats",
            medium: "AI looks ahead and tries to build winning positions",
            hard: "AI plays strategically - very difficult to beat"
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
            {aiThinking ? "🤔 AI thinking..." : playerTurn ? "Your turn (Red)" : "AI's turn (Yellow)"}
          </div>
        )}
      </div>

      {aiResponseMs !== null && (
        <div className={`ai-metric ${aiResponseMs < 500 ? "good" : "slow"}`}>
          AI response: {aiResponseMs}ms {aiResponseMs < 500 ? "(target met)" : "(above target)"}
        </div>
      )}

      <div className="c4-column-buttons">
        {[0, 1, 2, 3, 4, 5, 6].map(col => (
          <button
            key={col}
            className={`c4-col-btn ${!validColumns.includes(col) ? "full" : ""} ${
              dropCol === col ? "dropping" : ""
            }`}
            onClick={() => handleColumnClick(col)}
            disabled={gameOver || !playerTurn || aiThinking || !validColumns.includes(col)}
            title={`Column ${col + 1}`}
          >
            ▼
          </button>
        ))}
      </div>

      <div className="c4-board-container">
        <div className="c4-board">
          {board.map((disc, i) => {
            const col = i % 7;
            return (
              <div key={i} className="c4-slot">
                {disc && (
                  <span
                    className={`c4-disc ${disc === "player" ? "red" : "yellow"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default ConnectFourGame;
