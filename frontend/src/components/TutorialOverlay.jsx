export default function TutorialOverlay({ text, stepIndex, totalSteps, isComplete, onExit }) {
  if (isComplete) {
    return (
      <div className="tutorial-overlay">
        <p className="tutorial-complete">Tutorial Complete!</p>
        <p className="tutorial-overlay-text" style={{ textAlign: "center", marginTop: 8, marginBottom: 0 }}>
          You've learned the key strategies. Now try a real game!
        </p>
        <div className="tutorial-overlay-footer" style={{ justifyContent: "center", marginTop: 12 }}>
          <button className="tutorial-finish-btn" onClick={onExit}>
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-overlay" key={stepIndex}>
      <p className="tutorial-overlay-text">{text}</p>
      <div className="tutorial-overlay-footer">
        <span className="tutorial-step-counter">
          Step {stepIndex + 1} / {totalSteps}
        </span>
        <button className="tutorial-exit-btn" onClick={onExit}>
          Exit Tutorial
        </button>
      </div>
    </div>
  );
}
