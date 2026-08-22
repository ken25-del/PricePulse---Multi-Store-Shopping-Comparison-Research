import React from 'react';
import { FilterState, SearchIntent } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface ResearchRefinementChipsProps {
  filters: FilterState;
  intent?: SearchIntent;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
}

export const ResearchRefinementChips: React.FC<ResearchRefinementChipsProps> = ({
  filters,
  intent,
  onUpdateFilters
}) => {
  const chips = [
    {
      id: 'high_rating',
      label: '4.2+ Rating',
      active: filters.minRating >= 4.2,
      toggle: () => onUpdateFilters({ minRating: filters.minRating >= 4.2 ? 0 : 4.2 })
    },
    {
      id: 'high_reviews',
      label: 'Verified Review Volume (50+)',
      active: filters.minReviews >= 50,
      toggle: () => onUpdateFilters({ minReviews: filters.minReviews >= 50 ? 0 : 50 })
    },
    {
      id: 'returns',
      label: 'Easy Return Required',
      active: filters.returnAvailableOnly,
      toggle: () => onUpdateFilters({ returnAvailableOnly: !filters.returnAvailableOnly })
    },
    {
      id: 'discounts',
      label: 'Cross-Store Discounts',
      active: filters.discountOnly,
      toggle: () => onUpdateFilters({ discountOnly: !filters.discountOnly })
    },
    {
      id: 'in_stock',
      label: 'In Stock Only',
      active: filters.inStockOnly,
      toggle: () => onUpdateFilters({ inStockOnly: !filters.inStockOnly })
    }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
        <Sparkles className="w-3 h-3 text-[#FF3E00]" />
        <span>Quick Refine:</span>
      </span>

      {chips.map(chip => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.toggle}
          className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
            chip.active
              ? 'bg-[#FF3E00]/15 text-[#FF9575] border-[#FF3E00]/60 font-bold'
              : 'bg-[#141414] text-zinc-400 hover:text-zinc-200 border-[#262626] hover:border-[#383838]'
          }`}
        >
          {chip.active && <Check className="w-3 h-3 text-[#FF3E00]" />}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
};
