function GameInfo({ title, objective, rules, tips }) {
  return (
    <div className="game-info-panel">
      <div className="game-info-content">
        <h3>{title}</h3>

        <div className="game-info-section">
          <h4>🎯 Objective</h4>
          <p>{objective}</p>
        </div>

        <div className="game-info-section">
          <h4>📋 Rules</h4>
          <ul>
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="game-info-section">
          <h4>💡 Strategy Tips</h4>
          <div className="tips-by-difficulty">
            {tips.easy && (
              <div className="tip">
                <strong>Easy:</strong> {tips.easy}
              </div>
            )}
            {tips.medium && (
              <div className="tip">
                <strong>Medium:</strong> {tips.medium}
              </div>
            )}
            {tips.hard && (
              <div className="tip">
                <strong>Hard:</strong> {tips.hard}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
