import { METRIC_CONFIG, type MetricKey } from '../types/city';

export function MetricPrompt({ metricKey }: { metricKey: MetricKey }) {
  const metric = METRIC_CONFIG[metricKey];

  return (
    <section className="panel">
      <p className="eyebrow">Current challenge</p>
      <h1>Rank these 4 cities by {metric.label}</h1>
      <p className="subtle">
        Drag the cities into <strong>{metric.rankOrderLabel}</strong> order.
      </p>
      <p className="metric-note">{metric.unitNote}</p>
    </section>
  );
}
