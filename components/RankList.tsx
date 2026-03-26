'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { City } from '../types/city';
import { CityCard } from './CityCard';

interface RankListProps {
  cities: City[];
  disabled?: boolean;
}

export function RankList({ cities, disabled = false }: RankListProps) {
  return (
    <SortableContext items={cities.map((city) => city.id)} strategy={verticalListSortingStrategy}>
      <ol className="rank-list">
        {cities.map((city, index) => (
          <CityCard key={city.id} city={city} position={index + 1} disabled={disabled} />
        ))}
      </ol>
    </SortableContext>
  );
}
