import { METRIC_CONFIG, METRIC_KEYS, type City, type CityId, type MetricKey } from '../types/city';

export type RandomSource = () => number;

export interface GameRound {
  id: string;
  metricKey: MetricKey;
  cities: City[];
  submittedOrder: CityId[];
  correctOrder: CityId[];
}

export interface RoundResult {
  outcome: 'correct' | 'partial' | 'incorrect';
  pointsAwarded: number;
  submittedOrder: CityId[];
  correctOrder: CityId[];
}

const DEFAULT_ROUND_SIZE = 4;

function defaultRandom(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / 4294967296;
  }

  return Math.random();
}

function randomIndex(length: number, rng: RandomSource): number {
  return Math.floor(rng() * length);
}

export function shuffle<T>(items: readonly T[], rng: RandomSource = defaultRandom): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, rng);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function getMetricValue(city: City, metricKey: MetricKey): number {
  return city[metricKey];
}

export function sortCitiesByMetricDescending(cities: readonly City[], metricKey: MetricKey): City[] {
  return [...cities].sort((left, right) => {
    const delta = getMetricValue(right, metricKey) - getMetricValue(left, metricKey);

    if (delta !== 0) {
      return delta;
    }

    return left.name.localeCompare(right.name);
  });
}

export function formatMetricValue(metricKey: MetricKey, value: number): string {
  const config = METRIC_CONFIG[metricKey];

  switch (config.format.kind) {
    case 'compact':
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: config.format.code,
        maximumFractionDigits: config.format.fractionDigits ?? 0,
      }).format(value);
    case 'decimal':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: config.format.fractionDigits,
        maximumFractionDigits: config.format.fractionDigits,
      }).format(value);
    case 'integer':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}

export function pickMetric(rng: RandomSource = defaultRandom): MetricKey {
  return METRIC_KEYS[randomIndex(METRIC_KEYS.length, rng)];
}

export function pickCities(pool: readonly City[], count = DEFAULT_ROUND_SIZE, rng: RandomSource = defaultRandom): City[] {
  return shuffle(pool, rng).slice(0, count);
}

export function createRound(pool: readonly City[], rng: RandomSource = defaultRandom): GameRound {
  const metricKey = pickMetric(rng);
  const cities = pickCities(pool, DEFAULT_ROUND_SIZE, rng);
  const submittedOrder = cities.map((city) => city.id);
  const correctOrder = sortCitiesByMetricDescending(cities, metricKey).map((city) => city.id);

  return {
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `round-${Date.now()}`,
    metricKey,
    cities,
    submittedOrder,
    correctOrder,
  };
}

export function reorderCityIds(cityIds: readonly CityId[], activeId: CityId, overId: CityId): CityId[] {
  const oldIndex = cityIds.indexOf(activeId);
  const newIndex = cityIds.indexOf(overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return [...cityIds];
  }

  const nextOrder = [...cityIds];
  const [moved] = nextOrder.splice(oldIndex, 1);
  nextOrder.splice(newIndex, 0, moved);
  return nextOrder;
}

export function getOrderedCities(round: GameRound, orderedIds: readonly CityId[]): City[] {
  const cityLookup = new Map(round.cities.map((city) => [city.id, city]));
  return orderedIds
    .map((cityId) => cityLookup.get(cityId))
    .filter((city): city is City => Boolean(city));
}

export function evaluateRound(round: GameRound, submittedOrder: readonly CityId[]): RoundResult {
  const normalizedOrder = [...submittedOrder];
  const isCorrect = normalizedOrder.join('|') === round.correctOrder.join('|');
  const hasCorrectTopCity = normalizedOrder[0] === round.correctOrder[0];

  return {
    outcome: isCorrect ? 'correct' : hasCorrectTopCity ? 'partial' : 'incorrect',
    pointsAwarded: isCorrect ? 1 : hasCorrectTopCity ? 0.5 : 0,
    submittedOrder: normalizedOrder,
    correctOrder: round.correctOrder,
  };
}
