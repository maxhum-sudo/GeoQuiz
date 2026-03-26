'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { City } from '../types/city';

interface CityCardProps {
  city: City;
  position: number;
  disabled?: boolean;
}

export function CityCard({ city, position, disabled = false }: CityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: city.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`city-card${isDragging ? ' dragging' : ''}${disabled ? ' locked' : ''}`}
    >
      <button
        type="button"
        className="city-button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Move ${city.name}`}
      >
        <span className="rank-pill">{position}</span>
        <span className="city-copy">
          <strong>{city.name}</strong>
          <span>{city.country}</span>
        </span>
        <span className="drag-handle" aria-hidden="true">
          ::
        </span>
      </button>
    </li>
  );
}
