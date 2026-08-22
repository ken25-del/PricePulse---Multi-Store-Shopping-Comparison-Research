import React from 'react';
import { UserPriority } from '../types';
import { Sparkles, DollarSign, Award, Star, ShieldCheck, Truck, RefreshCw, Layers } from 'lucide-react';

interface UserPrioritySelectorProps {
  currentPriority: UserPriority;
  onSelectPriority: (priority: UserPriority) => void;
}

interface PriorityOption {
  id: UserPriority;
  label: string;
  sublabel: string;
  icon: React.FC<{ className?: string }>;
}

const PRIORITIES: PriorityOption[] = [
  { id: 'balanced', label: 'Balanced Best', sublabel: 'Rating + Price balance', icon: Layers },
  { id: 'lowest_price', label: 'Lowest Price', sublabel: 'Absolute cheapest', icon: DollarSign },
  { id: 'quality', label: 'Quality & Fabric', sublabel: 'Premium rating 4.3★+', icon: Award },
  { id: 'reviews', label: 'Review Confidence', sublabel: 'Most verified buyer reviews', icon: Star },
  { id: 'overall_value', label: 'Max Savings', sublabel: 'Highest cross-store discount', icon: Sparkles },
  { id: 'fast_delivery', label: 'Fast Delivery', sublabel: 'Express shipping available', icon: Truck },
  { id: 'easy_return', label: 'Easy Return', sublabel: 'Hassle-free verified return', icon: RefreshCw },
];

export const UserPrioritySelector: React.FC<UserPrioritySelectorProps> = ({
  currentPriority,
  onSelectPriority
}) => {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
          <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
            Prioritize Research By:
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Rankings and decision highlights dynamically adjust
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {PRIORITIES.map(opt => {
          const Icon = opt.icon;
          const isActive = currentPriority === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectPriority(opt.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#FF3E00] text-black border-[#FF3E00] font-black shadow-md'
                  : 'bg-[#181818] text-zinc-300 hover:text-white hover:bg-[#202020] border-[#2c2c2c]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'text-zinc-400'}`} />
              <div className="text-left">
                <div className="leading-tight">{opt.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
