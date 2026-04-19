import { useState, useEffect } from "react";
import {
  initializeGame,
  makeMove,
  getAIMove,
  checkWinner,
  getValidMoves
} from "./numberTarget";
import { getAIDelay, delay } from "./gameUtils";
import GameInfo from "../components/GameInfo";

function NumberTargetGame() {
  const [gameState, setGameState] = useState(initializeGame());
  const [difficulty, setDifficulty] = useState("medium");
  const [showInfo, setShowInfo] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [moves, setMoves] = useState([]); // Track move history for UI
  const [winner, setWinner] = useState(null);
  const [aiResponseMs, setAiResponseMs] = useState(null);

  const target = 100;
  const currentSum = gameState.currentSum;

  // Check if game is over
  useEffect(() => {
    if (currentSum === target) {
      setWinner(moves.length % 2 === 1 ? "player" : "ai");
      setGameState(prev => ({ ...prev, gameOver: true }));
    }
  }, [currentSum, moves.length]);

  // Handle player move
  const handleNumberClick = async (choice) => {
    if (gameState.gameOver || !gameState.playerTurn || aiThinking) return;

    try {
      const newSum = makeMove(currentSum, choice);

      if (newSum === target) {
        setWinner("player");
        setGameState(prev => ({ ...prev, gameOver: true, playerTurn: true }));
        setMoves([...moves, { by: "player", choice, sum: newSum }]);
        return;
      }

      setMoves([...moves, { by: "player", choice, sum: newSum }]);
      setGameState(prev => ({ ...prev, currentSum: newSum, playerTurn: false }));

      await delay(getAIDelay(difficulty));

      // AI move
      setAiThinking(true);
      const aiStart = performance.now();
      const aiChoice = getAIMove(newSum, difficulty, target);
      const aiEnd = performance.now();
      setAiResponseMs(Math.round(aiEnd - aiStart));
      const sumAfterAI = makeMove(newSum, aiChoice);
      setAiThinking(false);

      if (sumAfterAI === target) {
        setWinner("ai");
        setGameState(prev => ({ ...prev, gameOver: true, playerTurn: false }));
        setMoves(prev => [...prev, { by: "ai", choice: aiChoice, sum: sumAfterAI }]);
        return;
      }

      setMoves(prev => [...prev, { by: "ai", choice: aiChoice, sum: sumAfterAI }]);
      setGameState(prev => ({
        ...prev,
        currentSum: sumAfterAI,
        playerTurn: true
      }));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRestart = () => {
    setGameState(initializeGame());
    setMoves([]);
    setWinner(null);
    setAiThinking(false);
    setAiResponseMs(null);
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    handleRestart();
  };

  const validMoves = getValidMoves(currentSum, target);
  const progress = (currentSum / target) * 100;

  return (
    <div className="game-wrapper numberTarget-wrapper">
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
          title="Number Target"
          objective="Reach exactly 100 before the AI does."
          rules={[
            "Take turns adding numbers from 1 to 10 to the sum",
            "First to reach exactly 100 wins",
            "You can't go over 100 (invalid moves not allowed)",
            "You go first"
          ]}
          tips={{
            easy: "AI makes random choices - any strategy can work",
            medium: "AI occasionally plays smart moves",
            hard: "AI plays optimally - it uses a winning strategy"
          }}
        />
      )}

      <div className="game-status">
        {gameState.gameOver ? (
          <div className={`status-message ${winner}`}>
            {winner === "player" ? "🎉 You Won!" : "AI Won"}
          </div>
        ) : (
          <div className="status-message playing">
            {aiThinking ? "🤔 AI thinking..." : gameState.playerTurn ? "Your turn" : "AI's turn"}
          </div>
        )}
      </div>

      {aiResponseMs !== null && (
        <div className={`ai-metric ${aiResponseMs < 500 ? "good" : "slow"}`}>
          AI response: {aiResponseMs}ms {aiResponseMs < 500 ? "(target met)" : "(above target)"}
        </div>
      )}

      <div className="number-target-display">
        <div className="sum-display">
          <div className="sum-value">{currentSum}</div>
          <div className="sum-target">/ {target}</div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="number-choices">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <button
            key={num}
            className={`choice-btn ${!validMoves.includes(num) ? "disabled" : ""}`}
            onClick={() => handleNumberClick(num)}
            disabled={
              gameState.gameOver ||
              !gameState.playerTurn ||
              aiThinking ||
              !validMoves.includes(num)
            }
          >
            {num}
          </button>
        ))}
      </div>

      {gameState.gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Play Again
        </button>
      )}

      {moves.length > 0 && (
        <div className="move-history">
          <h4>Move History:</h4>
          <div className="history-list">
            {moves.map((move, i) => (
              <div key={i} className={`history-item ${move.by}`}>
                {move.by === "player" ? "You" : "AI"} + {move.choice} = {move.sum}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NumberTargetGame;
