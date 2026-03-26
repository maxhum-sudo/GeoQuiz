interface ScorePanelProps {
  score: number;
  totalRounds: number;
  outcome: 'correct' | 'partial' | 'incorrect' | null;
}

export function ScorePanel({ score, totalRounds, outcome }: ScorePanelProps) {
  return (
    <aside className="panel score-panel">
      <p className="eyebrow">Score</p>
      <h2>
        {score} / {totalRounds}
      </h2>
      <p className="subtle">Points earned so far.</p>
      {outcome === null ? (
        <p className="status-copy">Submit a round to see how you did.</p>
      ) : outcome === 'correct' ? (
        <p className="status-copy success">Correct ranking.</p>
      ) : outcome === 'partial' ? (
        <p className="status-copy warning">Half point. You got the top city right.</p>
      ) : (
        <p className="status-copy error">Not quite. Review the revealed order below.</p>
      )}
    </aside>
  );
}
