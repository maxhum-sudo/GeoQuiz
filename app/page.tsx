'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CITIES } from '../data/cities';
import {
  createRound,
  evaluateRound,
  formatMetricValue,
  getOrderedCities,
  getMetricValue,
  reorderCityIds,
} from '../lib/game';
import { METRIC_CONFIG, type CityId } from '../types/city';
import { RankList } from '../components/RankList';
import { ScorePanel } from '../components/ScorePanel';

export default function HomePage() {
  const [round, setRound] = useState(() => createRound(CITIES));
  const [submittedOrder, setSubmittedOrder] = useState<CityId[]>(round.submittedOrder);
  const [score, setScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [outcome, setOutcome] = useState<'correct' | 'partial' | 'incorrect' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedCities = useMemo(() => getOrderedCities(round, submittedOrder), [round, submittedOrder]);
  const revealedCities = useMemo(() => getOrderedCities(round, round.correctOrder), [round]);
  const metric = METRIC_CONFIG[round.metricKey];

  function handleDragEnd(event: DragEndEvent) {
    if (isSubmitted || !event.over) {
      return;
    }

    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    setSubmittedOrder((current) => reorderCityIds(current, activeId, overId));
  }

  function handleSubmit() {
    const result = evaluateRound(round, submittedOrder);
    setIsSubmitted(true);
    setOutcome(result.outcome);
    setTotalRounds((current) => current + 1);
    setScore((current) => current + result.pointsAwarded);
  }

  function handleNextRound() {
    const nextRound = createRound(CITIES);
    setRound(nextRound);
    setSubmittedOrder(nextRound.submittedOrder);
    setIsSubmitted(false);
    setOutcome(null);
  }

  const submitButtonLabel =
    outcome === 'correct' ? 'Correct' : outcome === 'partial' ? 'Half point' : outcome === 'incorrect' ? 'Incorrect' : 'Submit answer';

  const submitButtonClassName =
    outcome === 'correct'
      ? 'primary-button is-correct'
      : outcome === 'partial'
        ? 'primary-button is-partial'
        : outcome === 'incorrect'
          ? 'primary-button is-incorrect'
          : 'primary-button';

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">GeoQuiz MVP</p>
          <h1>Rank four cities by a surprise metric.</h1>
          <p className="hero-copy">
            Drag cities into order based on population, restaurants, cafes, income, UHNW
            individuals, home price, or rent.
          </p>
        </div>
      </section>

      <section className="game-grid">
        <div className="game-column">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Your ranking</p>
                <h2>Rank by {metric.label}</h2>
                <p className="subtle">Drag the cities into {metric.rankOrderLabel} order.</p>
              </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <RankList cities={orderedCities} disabled={isSubmitted} />
            </DndContext>

            <div className="action-row">
              <button type="button" className={submitButtonClassName} onClick={handleSubmit} disabled={isSubmitted}>
                {submitButtonLabel}
              </button>
              <button type="button" className="secondary-button" onClick={handleNextRound}>
                {isSubmitted ? 'Next round' : 'Skip round'}
              </button>
            </div>
          </section>
        </div>

        <div className="sidebar-column">
          <ScorePanel score={score} totalRounds={totalRounds} outcome={outcome} />

          <section className="panel">
            <p className="eyebrow">Metric reveal</p>
            <h2>
              {isSubmitted ? 'Correct order' : 'Values stay hidden until you submit'}
            </h2>
            <ol className="reveal-list">
              {revealedCities.map((city, index) => (
                <li key={city.id} className="reveal-item">
                  <span className="rank-pill">{index + 1}</span>
                  <span className="city-copy">
                    <strong>{city.name}</strong>
                    <span>{city.country}</span>
                  </span>
                  <strong className="metric-value">
                    {isSubmitted
                      ? formatMetricValue(round.metricKey, getMetricValue(city, round.metricKey))
                      : '???'}
                  </strong>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>
    </main>
  );
}
