import React from 'react';
import { SearchIntent } from '../types';
import { Tag, IndianRupee, Sparkles, X } from 'lucide-react';

interface IntentBadgeBarProps {
  intent: SearchIntent;
  onClearIntentConstraint?: (key: keyof SearchIntent) => void;
}

export const IntentBadgeBar: React.FC<IntentBadgeBarProps> = ({ intent, onClearIntentConstraint }) => {
  const hasConstraints = Boolean(
    intent.category ||
    intent.material ||
    intent.color ||
    intent.maxBudget ||
    intent.occasion ||
    intent.ratingThreshold
  );

  if (!hasConstraints) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs mb-4 p-2.5 rounded-lg bg-[#141414] border border-[#262626] text-zinc-300 font-mono">
      <span className="font-bold uppercase tracking-wider text-[#FF3E00] flex items-center gap-1.5 text-[11px]">
        <Sparkles className="w-3.5 h-3.5" />
        INTENT DETECTED:
      </span>

      {intent.category && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#1b1b1b] border border-[#303030] text-white">
          <Tag className="w-3 h-3 text-[#FF3E00]" />
          <span>CATEGORY: <strong className="text-[#FF9575]">{intent.category.toUpperCase()}</strong></span>
          {onClearIntentConstraint && (
            <button onClick={() => onClearIntentConstraint('category')} className="hover:text-rose-400 ml-1 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {intent.maxBudget && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#102214] border border-[#1e4a26] text-emerald-300 font-bold">
          <IndianRupee className="w-3 h-3 text-emerald-400" />
          <span>BUDGET: ≤ ₹{intent.maxBudget.toLocaleString('en-IN')}</span>
          {onClearIntentConstraint && (
            <button onClick={() => onClearIntentConstraint('maxBudget')} className="hover:text-rose-400 ml-1 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {intent.material && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#1b1b1b] border border-[#303030] text-white">
          <span>FABRIC: <strong className="text-zinc-200">{intent.material.toUpperCase()}</strong></span>
          {onClearIntentConstraint && (
            <button onClick={() => onClearIntentConstraint('material')} className="hover:text-rose-400 ml-1 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {intent.color && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#1b1b1b] border border-[#303030] text-white">
          <span>COLOR: <strong className="text-zinc-200">{intent.color.toUpperCase()}</strong></span>
          {onClearIntentConstraint && (
            <button onClick={() => onClearIntentConstraint('color')} className="hover:text-rose-400 ml-1 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {intent.occasion && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#181824] border border-[#2a2a44] text-indigo-300">
          <span>OCCASION: <strong className="text-white">{intent.occasion.toUpperCase()}</strong></span>
          {onClearIntentConstraint && (
            <button onClick={() => onClearIntentConstraint('occasion')} className="hover:text-rose-400 ml-1 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}
    </div>
  );
};

