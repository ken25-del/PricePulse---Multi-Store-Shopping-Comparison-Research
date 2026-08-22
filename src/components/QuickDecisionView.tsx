import React from 'react';
import { ProductGroup } from '../types';
import { Award, TrendingDown, Star, Sparkles, ShoppingBag, X, Check, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface QuickDecisionViewProps {
  isOpen: boolean;
  onClose: () => void;
  productGroups: ProductGroup[];
  similarGroups: ProductGroup[];
  onSelectGroup: (group: ProductGroup) => void;
}

export const QuickDecisionView: React.FC<QuickDecisionViewProps> = ({
  isOpen,
  onClose,
  productGroups,
  similarGroups,
  onSelectGroup
}) => {
  if (!isOpen) return null;

  const allGroups = [...productGroups, ...similarGroups];

  const bestOverall = allGroups.find(g => g.winnerCategory === 'best_overall') || allGroups[0];
  const bestPrice = allGroups.find(g => g.winnerCategory === 'best_price') || 
    [...allGroups].sort((a, b) => a.minPrice - b.minPrice)[0];
  const bestValue = allGroups.find(g => g.winnerCategory === 'best_value') ||
    allGroups.find(g => g.id !== bestOverall?.id && g.savingsPercent >= 10);
  const bestRated = allGroups.find(g => g.winnerCategory === 'best_rated') ||
    [...allGroups].sort((a, b) => b.averageRating - a.averageRating)[0];
  const mostReviewed = allGroups.find(g => g.winnerCategory === 'most_reviewed') ||
    [...allGroups].sort((a, b) => b.totalReviews - a.totalReviews)[0];

  const decisionCards = [
    {
      title: 'BEST OVERALL',
      subtitle: 'Top score, validated ratings & verified specs',
      icon: Award,
      color: 'border-[#FF3E00] bg-[#1a120e]',
      tagColor: 'bg-[#FF3E00] text-black',
      group: bestOverall,
      recommendation: 'Choose this if you want the safest, highest-rated choice across multiple stores.'
    },
    {
      title: 'CHEAPEST VERIFIED OPTION',
      subtitle: 'Lowest price point available across all stores',
      icon: TrendingDown,
      color: 'border-emerald-700/60 bg-[#0f1d13]',
      tagColor: 'bg-emerald-500 text-black',
      group: bestPrice,
      recommendation: 'Choose this if sticking strictly to the lowest possible price is your primary goal.'
    },
    {
      title: 'BEST VALUE / SAVINGS',
      subtitle: 'High savings gap across verified multi-store listings',
      icon: Sparkles,
      color: 'border-amber-700/60 bg-[#1d170e]',
      tagColor: 'bg-amber-500 text-black',
      group: bestValue || bestOverall,
      recommendation: 'Choose this if you want premium attributes with verified multi-store discounts.'
    },
    {
      title: 'HIGHEST CUSTOMER TRUST',
      subtitle: 'Largest volume of verified customer testimonials',
      icon: Star,
      color: 'border-cyan-700/60 bg-[#0e181c]',
      tagColor: 'bg-cyan-500 text-black',
      group: mostReviewed || bestRated,
      recommendation: 'Choose this if you rely heavily on extensive buyer feedback and photo reviews.'
    }
  ].filter(c => c.group !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-md bg-[#FF3E00] text-black">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Help Me Decide — Quick Research Winners
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Objective categorization derived from ratings, cross-store pricing, and review confidence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisionCards.map((card, idx) => {
              const g = card.group!;
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${card.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-xs font-mono text-[10px] font-black uppercase tracking-wider ${card.tagColor}`}>
                        {card.title}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        {g.listings.length} {g.listings.length === 1 ? 'Store' : 'Stores'}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={g.primaryImage}
                        alt={g.canonicalTitle}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover rounded-lg bg-[#0c0c0c] border border-[#2a2a2a] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                          {g.canonicalTitle}
                        </h4>
                        
                        <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                          <span className="text-emerald-400 font-black text-sm font-mono-num">
                            ₹{g.minPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-zinc-500 text-[11px]">
                            on {g.lowestPriceStore}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                          <span className="text-[#FF9575] font-bold">{g.averageRating}★</span>
                          <span>({g.totalReviews.toLocaleString('en-IN')} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation context */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-zinc-300 leading-relaxed font-sans">
                      <strong className="text-white font-mono uppercase text-[10px] block mb-0.5">When to pick this:</strong>
                      {card.recommendation}
                    </div>

                    {/* Why this product highlight */}
                    {g.whyRecommended && (
                      <div className="mt-2 text-[11px] text-zinc-400 font-mono bg-black/40 p-2 rounded-md border border-white/5">
                        {g.whyRecommended}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectGroup(g);
                      }}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md text-center transition-colors cursor-pointer"
                    >
                      Compare & Research
                    </button>
                    {g.listings[0]?.productUrl && (
                      <a
                        href={g.listings[0].productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 bg-[#FF3E00] hover:bg-[#E03600] text-black font-mono font-black text-xs uppercase tracking-wider rounded-md flex items-center gap-1 transition-colors"
                      >
                        <span>Buy on {g.lowestPriceStore}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
