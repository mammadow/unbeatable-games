import { useState } from "react";
import GameInfo from "../components/GameInfo";
import { delay, getAIDelay } from "./gameUtils";

const choices = ["rock", "paper", "scissors"];

const labels = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors"
};

const icons = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️"
};

const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};

const counters = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock"
};

function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getMostLikelyPlayerMove(history, difficulty) {
  if (history.length === 0) {
    return getRandomChoice();
  }

  const counts = {
    rock: 0,
    paper: 0,
    scissors: 0
  };

  if (difficulty === "easy") {
    return getRandomChoice();
  }

  if (difficulty === "medium") {
    history.forEach((round) => {
      counts[round.player] += 1;
    });
  } else {
    history.slice(-4).forEach((round, index) => {
      counts[round.player] += index + 1;
    });
  }

  return Object.entries(counts).reduce((best, current) =>
    current[1] > best[1] ? current : best
  )[0];
}

function getAiChoice(history, difficulty) {
  const predictedPlayerMove = getMostLikelyPlayerMove(history, difficulty);
  return counters[predictedPlayerMove] || getRandomChoice();
}

function getRoundWinner(playerChoice, aiChoice) {
  if (playerChoice === aiChoice) {
    return "draw";
  }

  return beats[playerChoice] === aiChoice ? "player" : "ai";
}

function RockPaperScissorsGame() {
  const [difficulty, setDifficulty] = useState("medium");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [lastResult, setLastResult] = useState("Choose rock, paper, or scissors.");
  const [aiResponseMs, setAiResponseMs] = useState(null);
  const [aiMove, setAiMove] = useState(null);
  const [aiReveal, setAiReveal] = useState(false);

  const handleRestart = () => {
    setPlayerScore(0);
    setAiScore(0);
    setRound(0);
    setHistory([]);
    setGameOver(false);
    setWinner(null);
    setBusy(false);
    setShowInfo(false);
    setLastResult("Choose rock, paper, or scissors.");
    setAiResponseMs(null);
    setAiMove(null);
    setAiReveal(false);
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    handleRestart();
  };

  const finishGame = (nextPlayerScore, nextAiScore, nextRound) => {
    if (nextPlayerScore >= 3 || nextAiScore >= 3 || nextRound >= 5) {
      if (nextPlayerScore > nextAiScore) {
        setWinner("player");
      } else if (nextAiScore > nextPlayerScore) {
        setWinner("ai");
      } else {
        setWinner("draw");
      }

      setGameOver(true);
    }
  };

  const handleChoice = async (playerChoice) => {
    if (busy || gameOver) {
      return;
    }

    setBusy(true);
    await delay(getAIDelay(difficulty));

    const aiStart = performance.now();
    const aiChoice = getAiChoice(history, difficulty);
    const aiEnd = performance.now();
    setAiResponseMs(Math.round(aiEnd - aiStart));
    setAiMove(aiChoice);
    setAiReveal(true);

    await delay(700);

    const roundWinner = getRoundWinner(playerChoice, aiChoice);
    const nextRound = round + 1;
    const nextPlayerScore = playerScore + (roundWinner === "player" ? 1 : 0);
    const nextAiScore = aiScore + (roundWinner === "ai" ? 1 : 0);

    setPlayerScore(nextPlayerScore);
    setAiScore(nextAiScore);
    setRound(nextRound);
    setHistory((currentHistory) => [
      ...currentHistory,
      {
        player: playerChoice,
        ai: aiChoice,
        result: roundWinner
      }
    ]);

    if (roundWinner === "player") {
      setLastResult(`You won the round: ${labels[playerChoice]} beats ${labels[aiChoice]}.`);
    } else if (roundWinner === "ai") {
      setLastResult(`AI won the round: ${labels[aiChoice]} beats ${labels[playerChoice]}.`);
    } else {
      setLastResult(`Draw round: both chose ${labels[playerChoice]}.`);
    }

    finishGame(nextPlayerScore, nextAiScore, nextRound);
    setAiReveal(false);
    setBusy(false);
  };

  const statusText = gameOver
    ? winner === "player"
      ? "You won the match."
      : winner === "ai"
        ? "AI won the match."
        : "The match ended in a draw."
    : busy
      ? "AI is adapting to your pattern..."
      : "Pick your move."
  ;

  return (
    <div className="game-wrapper rps-wrapper">
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
          title="Rock Paper Scissors"
          objective="Win more rounds than the AI over a best-of-five match."
          rules={[
            "Choose rock, paper, or scissors each round",
            "Rock beats scissors, scissors beats paper, paper beats rock",
            "The first player to 3 wins the match",
            "If no one reaches 3 after 5 rounds, the higher score wins"
          ]}
          tips={{
            easy: "The AI mostly guesses, so you can mix your choices freely.",
            medium: "The AI learns your most common choice.",
            hard: "The AI watches recent rounds and adapts faster."
          }}
        />
      )}

      <div className="game-status">
        <div className={`status-message ${gameOver ? winner : "playing"}`}>
          {statusText}
        </div>
      </div>

      {aiMove && !gameOver && busy && (
        <div className={`ai-move-badge ${aiReveal ? "revealing" : ""}`}>
          <span className="ai-move-label">AI move</span>
          <span className="ai-move-icon">{icons[aiMove]}</span>
          <span className="ai-move-text">{aiReveal ? `Selected ${labels[aiMove]}` : labels[aiMove]}</span>
        </div>
      )}

      {aiMove && !busy && history.length > 0 && (
        <div className="ai-move-summary">
          AI chose {icons[aiMove]} {labels[aiMove]} last round.
        </div>
      )}

      {aiResponseMs !== null && (
        <div className={`ai-metric ${aiResponseMs < 500 ? "good" : "slow"}`}>
          AI response: {aiResponseMs}ms {aiResponseMs < 500 ? "(target met)" : "(above target)"}
        </div>
      )}

      <div className="scoreboard rps-scoreboard">
        <div>
          <span className="score-label">You</span>
          <span className="score-value">{playerScore}</span>
        </div>
        <div>
          <span className="score-label">AI</span>
          <span className="score-value">{aiScore}</span>
        </div>
        <div>
          <span className="score-label">Rounds</span>
          <span className="score-value">{round}/5</span>
        </div>
      </div>

      <div className="rps-choices">
        {choices.map((choice) => (
          <button
            key={choice}
            className={`rps-choice ${choice}`}
            onClick={() => handleChoice(choice)}
            disabled={busy || gameOver}
          >
            <span className="rps-choice-icon">
              {choice === "rock" ? "🪨" : choice === "paper" ? "📄" : "✂️"}
            </span>
            <span className="rps-choice-label">{labels[choice]}</span>
          </button>
        ))}
      </div>

      <div className="rps-last-result">
        <strong>Latest round:</strong> {lastResult}
      </div>

      <div className="rps-history">
        {history.map((roundEntry, index) => (
          <div key={`${roundEntry.player}-${roundEntry.ai}-${index}`} className="rps-history-item">
            <span>Round {index + 1}</span>
            <span>You: {labels[roundEntry.player]}</span>
            <span>AI: {labels[roundEntry.ai]}</span>
            <span>{roundEntry.result === "draw" ? "Draw" : `${roundEntry.result === "player" ? "You" : "AI"} won`}</span>
          </div>
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

export default RockPaperScissorsGame;
