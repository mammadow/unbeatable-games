export default function GameTips({ objective, rules, tips, algorithm, isOpen }) {
  return (
    <div className={`tips-panel ${isOpen ? "tips-open" : ""}`}>
      <div className="tips-panel-inner">
        <div className="tips-section">
          <h4 className="tips-heading">Objective</h4>
          <p className="tips-text">{objective}</p>
        </div>

        <div className="tips-section">
          <h4 className="tips-heading">Rules</h4>
          <ul className="tips-list">
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="tips-section">
          <h4 className="tips-heading">Strategy Tips</h4>
          <ul className="tips-list tips-strategy">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        {algorithm && (
          <div className="tips-section tips-algorithm">
            <h4 className="tips-heading">AI Algorithm</h4>
            <p className="tips-algo-name">{algorithm.name}</p>
            <p className="tips-text">{algorithm.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
