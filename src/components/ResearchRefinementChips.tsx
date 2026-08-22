import React from 'react';
import { FilterState, SearchIntent } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface ResearchRefinementChipsProps {
  filters: FilterState;
  intent?: SearchIntent;
  onUpdateFilters?: (updates: Partial<FilterState>) => void;
  onChangeFilters?: React.Dispatch<React.SetStateAction<FilterState>> | ((updater: any) => void);
  availableMaterials?: string[];
  budgetCeiling?: number;
}

export const ResearchRefinementChips: React.FC<ResearchRefinementChipsProps> = ({
  filters,
  intent,
  onUpdateFilters,
  onChangeFilters,
  availableMaterials,
  budgetCeiling
}) => {
  const updateFilters = (updates: Partial<FilterState>) => {
    if (onUpdateFilters) {
      onUpdateFilters(updates);
    } else if (onChangeFilters) {
      onChangeFilters((prev: FilterState) => ({ ...prev, ...updates }));
    }
  };

  const chips = [
    {
      id: 'high_rating',
      label: '4.2+ Rating',
      active: filters.minRating >= 4.2,
      toggle: () => updateFilters({ minRating: filters.minRating >= 4.2 ? 0 : 4.2 })
    },
    {
      id: 'high_reviews',
      label: 'Verified Reviews (50+)',
      active: filters.minReviews >= 50,
      toggle: () => updateFilters({ minReviews: filters.minReviews >= 50 ? 0 : 50 })
    },
    {
      id: 'returns',
      label: 'Easy Return',
      active: filters.returnAvailableOnly,
      toggle: () => updateFilters({ returnAvailableOnly: !filters.returnAvailableOnly })
    },
    {
      id: 'discounts',
      label: 'Cross-Store Discounts',
      active: filters.discountOnly,
      toggle: () => updateFilters({ discountOnly: !filters.discountOnly })
    },
    {
      id: 'in_stock',
      label: 'In Stock Only',
      active: filters.inStockOnly,
      toggle: () => updateFilters({ inStockOnly: !filters.inStockOnly })
    }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
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
              ? 'bg-orange-100 dark:bg-[#FF3E00]/15 text-[#FF3E00] dark:text-[#FF9575] border-orange-300 dark:border-[#FF3E00]/60 font-bold'
              : 'bg-white dark:bg-[#141414] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border-zinc-200 dark:border-[#262626] hover:border-zinc-300 dark:hover:border-[#383838]'
          }`}
        >
          {chip.active && <Check className="w-3 h-3 text-[#FF3E00]" />}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
};

