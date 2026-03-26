export interface City {
  id: string;
  name: string;
  country: string;
  population: number;
  restaurants: number;
  cafes: number;
  income: number;
  uhnwIndividuals: number;
  housePrice: number;
  rent: number;
}

export type CityId = City['id'];

export const METRIC_KEYS = [
  'population',
  'restaurants',
  'cafes',
  'income',
  'uhnwIndividuals',
  'housePrice',
  'rent',
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

/** Hints for UI formatting; consumers map these to Intl or custom formatters. */
export type MetricFormatHint =
  | { kind: 'integer'; group?: boolean }
  | { kind: 'compact'; base: 1000 | 1000000; suffix: string }
  | { kind: 'currency'; code: 'USD'; compact?: boolean; fractionDigits?: 0 | 1 }
  | { kind: 'decimal'; fractionDigits: 0 | 1 };

export interface MetricConfigEntry {
  label: string;
  shortLabel: string;
  /** Rough unit or meaning for tooltips. */
  unitNote: string;
  format: MetricFormatHint;
  rankOrderLabel: string;
}

export const METRIC_CONFIG: Record<MetricKey, MetricConfigEntry> = {
  population: {
    label: 'Population',
    shortLabel: 'Pop.',
    unitNote: 'metro or city proper style headcount (illustrative)',
    format: { kind: 'compact', base: 1000000, suffix: 'M' },
    rankOrderLabel: 'highest to lowest',
  },
  restaurants: {
    label: 'Restaurants',
    shortLabel: 'Rest.',
    unitNote: 'estimated count of dining establishments',
    format: { kind: 'integer', group: true },
    rankOrderLabel: 'highest to lowest',
  },
  cafes: {
    label: 'Cafes',
    shortLabel: 'Cafes',
    unitNote: 'estimated count of cafes and coffee shops',
    format: { kind: 'integer', group: true },
    rankOrderLabel: 'highest to lowest',
  },
  income: {
    label: 'Median household income',
    shortLabel: 'Income',
    unitNote: 'USD per year, nominal, illustrative',
    format: { kind: 'currency', code: 'USD', compact: false, fractionDigits: 0 },
    rankOrderLabel: 'highest to lowest',
  },
  uhnwIndividuals: {
    label: 'UHNW individuals',
    shortLabel: 'UHNW',
    unitNote: 'ultra-high-net-worth people in metro (illustrative count)',
    format: { kind: 'integer', group: true },
    rankOrderLabel: 'highest to lowest',
  },
  housePrice: {
    label: 'Median home price',
    shortLabel: 'Home',
    unitNote: 'USD, illustrative median',
    format: { kind: 'currency', code: 'USD', compact: true, fractionDigits: 0 },
    rankOrderLabel: 'highest to lowest',
  },
  rent: {
    label: 'Median monthly rent',
    shortLabel: 'Rent',
    unitNote: 'USD per month, typical central 1-bedroom style',
    format: { kind: 'currency', code: 'USD', compact: false, fractionDigits: 0 },
    rankOrderLabel: 'highest to lowest',
  },
};
