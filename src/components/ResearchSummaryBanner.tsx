import React from 'react';
import { ResearchSummaryData, ProductGroup } from '../types';
import { ShieldCheck, TrendingDown, Award, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';

interface ResearchSummaryBannerProps {
  summary?: ResearchSummaryData | null;
  productGroups?: ProductGroup[];
  onOpenDecisionGuide?: () => void;
  onSelectProduct?: (group: ProductGroup) => void;
}

export const ResearchSummaryBanner: React.FC<ResearchSummaryBannerProps> = ({
  summary,
  productGroups = [],
  onOpenDecisionGuide,
  onSelectProduct
}) => {
  if (!summary || summary.totalGroups === 0) return null;

  const bestOverall = productGroups.find(p => p.winnerCategory === 'best_overall') || productGroups[0];

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#FF3E00]/10 via-[#FF3E00]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Stats Overview */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-sm bg-[#FF3E00] text-black font-mono text-[10px] font-black uppercase tracking-wider">
              RESEARCH ENGINE INSIGHTS
            </span>
            <span className="text-zinc-400 font-mono text-xs">
              Synthesized across {summary.totalStores} verified stores & {summary.totalListings} listings
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="bg-[#181818] border border-[#282828] p-2.5 rounded-lg">
              <div className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-[#FF9575]" />
                <span>Groups Identified</span>
              </div>
              <div className="text-lg font-black font-mono-num text-white mt-0.5">
                {summary.totalGroups} <span className="text-xs text-zinc-500 font-normal">matches</span>
              </div>
            </div>

            <div className="bg-[#181818] border border-[#282828] p-2.5 rounded-lg">
              <div className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-emerald-400" />
                <span>Lowest Price</span>
              </div>
              <div className="text-lg font-black font-mono-num text-emerald-400 mt-0.5">
                ₹{summary.lowestPrice.toLocaleString('en-IN')}{' '}
                <span className="text-[10px] text-zinc-400 font-normal truncate block sm:inline">
                  on {summary.lowestPriceStore}
                </span>
              </div>
            </div>

            <div className="bg-[#181818] border border-[#282828] p-2.5 rounded-lg">
              <div className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Review Confidence</span>
              </div>
              <div className="text-lg font-black font-mono-num text-white mt-0.5">
                {summary.highConfidenceCount}{' '}
                <span className="text-xs text-zinc-500 font-normal">high volume</span>
              </div>
            </div>

            <div className="bg-[#181818] border border-[#282828] p-2.5 rounded-lg">
              <div className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                <span>Budget Matches</span>
              </div>
              <div className="text-lg font-black font-mono-num text-white mt-0.5">
                {summary.budgetMatchesCount}{' '}
                <span className="text-xs text-zinc-500 font-normal">in target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA / Best overall shortcut */}
        {bestOverall && (
          <div className="lg:w-72 w-full shrink-0 bg-[#1a1412] border border-[#442217] p-3.5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1 text-[11px] font-mono font-black uppercase text-[#FF9575]">
                  <Award className="w-3.5 h-3.5 text-[#FF3E00]" />
                  <span>Top Recommendation</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FF3E00] text-black font-black">
                  {bestOverall.platformScore}/10
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">
                {bestOverall.canonicalTitle}
              </p>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                ₹{bestOverall.minPrice.toLocaleString('en-IN')} on {bestOverall.lowestPriceStore} ({bestOverall.averageRating}★ / {bestOverall.totalReviews.toLocaleString('en-IN')} rev)
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#381f16]">
              {onSelectProduct && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(bestOverall)}
                  className="flex-1 py-1.5 px-2 bg-[#FF3E00] hover:bg-[#E03600] text-black font-mono font-black text-xs uppercase tracking-wider rounded-md text-center transition-colors cursor-pointer"
                >
                  View Top Pick
                </button>
              )}
              {onOpenDecisionGuide && (
                <button
                  type="button"
                  onClick={onOpenDecisionGuide}
                  className="py-1.5 px-2.5 bg-[#251712] hover:bg-[#341e17] text-[#FF9575] border border-[#52291b] font-mono text-xs font-bold uppercase rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Help Me Decide</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
