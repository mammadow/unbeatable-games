import { useRef, useState } from "react";
import GameInfo from "../components/GameInfo";
import { delay, getAIDelay } from "./gameUtils";

const symbols = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍉", "🍋", "🍑"];

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createDeck() {
  return shuffle(
    [...symbols, ...symbols].map((value, index) => ({
      id: index,
      value,
      matched: false
    }))
  );
}

function getUnmatchedIndices(deck) {
  return deck.reduce((indices, card, index) => {
    if (!card.matched) {
      indices.push(index);
    }
    return indices;
  }, []);
}

function recordSeen(seenRef, deck, index) {
  const value = deck[index].value;
  if (!seenRef.current[value]) {
    seenRef.current[value] = [];
  }

  if (!seenRef.current[value].includes(index)) {
    seenRef.current[value].push(index);
  }
}

function getKnownPair(deck, seenRef) {
  const unmatched = new Set(getUnmatchedIndices(deck));

  for (const value of Object.keys(seenRef.current)) {
    const candidates = seenRef.current[value].filter((index) => unmatched.has(index));
    if (candidates.length >= 2) {
      return candidates.slice(0, 2);
    }
  }

  return null;
}

function getRandomPair(deck) {
  const unmatched = getUnmatchedIndices(deck);

  if (unmatched.length < 2) {
    return null;
  }

  const firstIndex = unmatched[Math.floor(Math.random() * unmatched.length)];
  const remaining = unmatched.filter((index) => index !== firstIndex);
  const secondIndex = remaining[Math.floor(Math.random() * remaining.length)];
  return [firstIndex, secondIndex];
}

function chooseAiPair(deck, difficulty, seenRef) {
  const knownPair = getKnownPair(deck, seenRef);
  const randomPair = getRandomPair(deck);

  if (!randomPair) {
    return null;
  }

  if (difficulty === "easy") {
    return randomPair;
  }

  if (difficulty === "medium") {
    return Math.random() < 0.7 && knownPair ? knownPair : randomPair;
  }

  return knownPair || randomPair;
}

function countMatches(deck) {
  return deck.filter((card) => card.matched).length / 2;
}

function MemoryMatchGame() {
  const [deck, setDeck] = useState(() => createDeck());
  const [difficulty, setDifficulty] = useState("medium");
  const [currentPlayer, setCurrentPlayer] = useState("player");
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [busy, setBusy] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [lastResult, setLastResult] = useState("Flip two cards to begin.");
  const [aiResponseMs, setAiResponseMs] = useState(null);
  const seenRef = useRef({});

  const totalPairs = symbols.length;

  const finishGame = (nextScores, nextDeck) => {
    const completedPairs = countMatches(nextDeck);
    if (completedPairs < totalPairs) {
      return;
    }

    if (nextScores.player > nextScores.ai) {
      setWinner("player");
    } else if (nextScores.ai > nextScores.player) {
      setWinner("ai");
    } else {
      setWinner("draw");
    }

    setGameOver(true);
    setBusy(false);
    setAiThinking(false);
    setSelectedIndices([]);
  };

  const playAiTurn = async (deckSnapshot, scoreSnapshot) => {
    setCurrentPlayer("ai");
    setBusy(true);
    setAiThinking(true);

    await delay(getAIDelay(difficulty));

    const aiStart = performance.now();
    const aiPair = chooseAiPair(deckSnapshot, difficulty, seenRef);
    const aiEnd = performance.now();
    setAiResponseMs(Math.round(aiEnd - aiStart));

    if (!aiPair) {
      setCurrentPlayer("player");
      setBusy(false);
      setAiThinking(false);
      return;
    }

    aiPair.forEach((index) => recordSeen(seenRef, deckSnapshot, index));
    setSelectedIndices(aiPair);

    await delay(900);

    const isMatch = deckSnapshot[aiPair[0]].value === deckSnapshot[aiPair[1]].value;
    let nextDeck = deckSnapshot;
    let nextScores = scoreSnapshot;

    if (isMatch) {
      nextDeck = deckSnapshot.map((card, index) =>
        aiPair.includes(index) ? { ...card, matched: true } : card
      );
      nextScores = { ...scoreSnapshot, ai: scoreSnapshot.ai + 1 };
      setLastResult(`AI matched ${deckSnapshot[aiPair[0]].value}.`);
    } else {
      setLastResult("AI missed and gave the turn back.");
    }

    setDeck(nextDeck);
    setScores(nextScores);
    setSelectedIndices([]);
    setAiThinking(false);
    setBusy(false);

    finishGame(nextScores, nextDeck);

    if (countMatches(nextDeck) < totalPairs) {
      setCurrentPlayer("player");
    }
  };

  const handleRestart = () => {
    setDeck(createDeck());
    setCurrentPlayer("player");
    setSelectedIndices([]);
    setScores({ player: 0, ai: 0 });
    setGameOver(false);
    setWinner(null);
    setBusy(false);
    setAiThinking(false);
    setShowInfo(false);
    setLastResult("Flip two cards to begin.");
    setAiResponseMs(null);
    seenRef.current = {};
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    handleRestart();
  };

  const handleCardClick = async (index) => {
    if (busy || aiThinking || gameOver || currentPlayer !== "player") {
      return;
    }

    if (deck[index].matched || selectedIndices.includes(index)) {
      return;
    }

    recordSeen(seenRef, deck, index);

    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
      return;
    }

    const firstIndex = selectedIndices[0];
    const pair = [firstIndex, index];
    const humanStartScores = { ...scores };

    setBusy(true);
    setSelectedIndices(pair);

    await delay(800);

    const isMatch = deck[firstIndex].value === deck[index].value;
    let nextDeck = deck;
    let nextScores = humanStartScores;

    if (isMatch) {
      nextDeck = deck.map((card, cardIndex) =>
        pair.includes(cardIndex) ? { ...card, matched: true } : card
      );
      nextScores = { ...humanStartScores, player: humanStartScores.player + 1 };
      setLastResult(`You matched ${deck[firstIndex].value}.`);
    } else {
      setLastResult("No match. The AI is thinking.");
    }

    setDeck(nextDeck);
    setScores(nextScores);
    setSelectedIndices([]);

    finishGame(nextScores, nextDeck);

    if (gameOver || countMatches(nextDeck) >= totalPairs) {
      setBusy(false);
      return;
    }

    await playAiTurn(nextDeck, nextScores);
  };

  const statusText = gameOver
    ? winner === "player"
      ? "You won the memory duel."
      : winner === "ai"
        ? "AI won the memory duel."
        : "It is a draw."
    : aiThinking
      ? "AI is scanning the board..."
      : currentPlayer === "player"
        ? selectedIndices.length === 1
          ? "Pick one more card."
          : "Your turn."
        : "AI turn."
  ;

  return (
    <div className="game-wrapper memory-match-wrapper">
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
          title="Memory Match"
          objective="Find more matching pairs than the AI by remembering where the cards are."
          rules={[
            "The board starts with 8 hidden pairs",
            "You flip two cards on your turn",
            "Matching cards stay open and score a point",
            "The AI remembers every revealed card",
            "The player with the most matches wins"
          ]}
          tips={{
            easy: "AI mostly guesses, so track the board carefully.",
            medium: "AI remembers some cards and will punish random flips.",
            hard: "AI uses perfect memory and will grab known pairs fast."
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

      <div className="scoreboard memory-scoreboard">
        <div>
          <span className="score-label">You</span>
          <span className="score-value">{scores.player}</span>
        </div>
        <div>
          <span className="score-label">AI</span>
          <span className="score-value">{scores.ai}</span>
        </div>
      </div>

      <div className="memory-board">
        {deck.map((card, index) => {
          const isVisible = card.matched || selectedIndices.includes(index);

          return (
            <button
              key={card.id}
              className={`memory-card ${isVisible ? "flipped" : "hidden"} ${card.matched ? "matched" : ""}`}
              onClick={() => handleCardClick(index)}
              disabled={busy || aiThinking || gameOver || currentPlayer !== "player" || card.matched}
            >
              <span className="memory-card-face memory-card-front">?</span>
              <span className="memory-card-face memory-card-back">{card.value}</span>
            </button>
          );
        })}
      </div>

      <div className="memory-footer">
        <span>{countMatches(deck)} / {totalPairs} pairs found</span>
        <span>{lastResult}</span>
      </div>

      {gameOver && (
        <button className="restart-btn" onClick={handleRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default MemoryMatchGame;
