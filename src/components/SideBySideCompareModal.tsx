import React from 'react';
import { ProductGroup, AppSettings } from '../types';
import { translations } from '../lib/i18n';
import { getRealProductImageFallback } from '../lib/imageUtils';
import { X, Star, ArrowUpRight, Scale, Trash2, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

interface SideBySideCompareModalProps {
  products: ProductGroup[];
  settings: AppSettings;
  onRemoveProduct: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const SideBySideCompareModal: React.FC<SideBySideCompareModalProps> = ({
  products,
  settings,
  onRemoveProduct,
  onClearAll,
  onClose
}) => {
  const t = translations[settings.language];

  if (products.length === 0) return null;

  // Derive automated comparative decision synthesis
  const lowestPriceItem = [...products].sort((a, b) => a.minPrice - b.minPrice)[0];
  const highestRatedItem = [...products].sort((a, b) => b.averageRating - a.averageRating)[0];
  const mostReviewedItem = [...products].sort((a, b) => b.totalReviews - a.totalReviews)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#262626] overflow-hidden text-[#f4f4f4] my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-white">
              DECISION COMPARISON MATRIX ({products.length} ITEMS)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-[#201010] rounded-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-[#1a1a1a] border border-[#303030] text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparative Decision Guide Header */}
        {products.length >= 2 && (
          <div className="p-4 bg-[#141414] border-b border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-[#FF3E00] shrink-0" />
              <span>
                <strong>Decision Guide:</strong> Pick <strong>{lowestPriceItem.canonicalTitle.slice(0, 28)}...</strong> if sticking to lowest price (₹{lowestPriceItem.minPrice.toLocaleString('en-IN')}) is your priority. Pick <strong>{mostReviewedItem.canonicalTitle.slice(0, 28)}...</strong> for highest review validation ({mostReviewedItem.totalReviews.toLocaleString('en-IN')} reviews).
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Compare Grid */}
        <div className="p-5 overflow-x-auto">
          <div className="min-w-[750px]">
            <div className="grid grid-cols-1 divide-y divide-[#222222]">
              
              {/* Image & Title Row */}
              <div className={`grid grid-cols-${products.length} gap-4 pb-4`} style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id} className="relative space-y-2">
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(p.id)}
                      className="absolute top-1 right-1 p-1 rounded-sm bg-black/80 text-white hover:bg-[#FF3E00] hover:text-black transition-colors z-10 cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="w-full h-44 rounded-lg overflow-hidden bg-[#141414] border border-[#282828]">
                      <img
                        src={p.primaryImage}
                        alt={p.canonicalTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getRealProductImageFallback(p.canonicalTitle, p.category);
                        }}
                      />
                    </div>
                    <div className="font-bold text-xs line-clamp-2 text-white tracking-tight">
                      {p.canonicalTitle}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lowest Price Row */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id}>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">LOWEST PRICE</span>
                    <div className="text-base font-black text-emerald-400 font-mono-num">
                      ₹{p.minPrice.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-zinc-400">ON {p.lowestPriceStore.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              {/* Price Range Across Stores */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id}>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">PRICE RANGE</span>
                    <div className="font-bold text-white font-mono-num">
                      ₹{p.minPrice.toLocaleString('en-IN')} — ₹{p.maxPrice.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      SAVE {p.savingsPercent}% (₹{p.priceDifference.toLocaleString('en-IN')})
                    </span>
                  </div>
                ))}
              </div>

              {/* Available Stores & Prices with Exact Links */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id} className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      ALL STORES & PRICES ({p.listings.length})
                    </span>
                    <div className="space-y-1 mt-1">
                      {p.listings.map((l, i) => {
                        const isLowest = l.price === p.minPrice;
                        return (
                          <div key={i} className={`flex items-center justify-between p-1.5 rounded text-[11px] border ${
                            isLowest ? 'bg-[#0f1f14] border-[#1d4c26] text-white' : 'bg-[#151515] border-[#222222] text-zinc-300'
                          }`}>
                            <div className="truncate font-bold">
                              <span>{l.store}</span>
                              {isLowest && <span className="ml-1 text-[9px] text-emerald-400">★ LOWEST</span>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`font-black font-mono-num ${isLowest ? 'text-emerald-400' : 'text-zinc-200'}`}>
                                ₹{l.price.toLocaleString('en-IN')}
                              </span>
                              <a
                                href={l.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Open on ${l.store}`}
                                className="p-1 rounded bg-[#242424] hover:bg-[#333333] text-zinc-200 hover:text-white"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating & Reviews */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id}>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">RATING & REVIEWS</span>
                    <div className="flex items-center gap-1 font-bold text-white">
                      <span>{p.averageRating}</span>
                      <Star className="w-3.5 h-3.5 fill-current text-[#FF3E00]" />
                      <span className="text-zinc-500 font-normal">({p.totalReviews.toLocaleString('en-IN')})</span>
                    </div>
                    <span className={`text-[10px] uppercase block font-bold mt-0.5 ${p.reviewConfidence === 'high' ? 'text-cyan-400' : 'text-zinc-400'}`}>
                      {p.reviewConfidence || 'medium'} confidence
                    </span>
                  </div>
                ))}
              </div>

              {/* Strengths / Why Recommended */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>WHY BUY THIS</span>
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed font-sans">
                      {p.whyRecommended || 'Meets criteria with good cross-store availability.'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Things to Consider */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>THINGS TO CONSIDER</span>
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed font-sans">
                      {p.thingsToConsider || 'Check store-specific seller rating before placing order.'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Fabric / Specs */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">SPECIFICATIONS</span>
                    <div className="text-zinc-300">FABRIC: <strong className="text-white">{p.material || 'N/A'}</strong></div>
                    <div className="text-zinc-300">COLOR: <strong className="text-white">{p.color || 'N/A'}</strong></div>
                  </div>
                ))}
              </div>

              {/* Platform Score */}
              <div className="grid gap-4 py-3 text-xs font-mono" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => (
                  <div key={p.id}>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">INDEX SCORE</span>
                    <div className="font-black text-[#FF9575]">
                      {p.platformScore} / 10
                    </div>
                  </div>
                ))}
              </div>

              {/* Buy CTA */}
              <div className="grid gap-4 pt-4" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
                {products.map((p) => {
                  const lowest = p.listings[0];
                  return (
                    <div key={p.id}>
                      <a
                        href={lowest.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-mono font-black text-xs uppercase tracking-wider transition-transform active:scale-95"
                      >
                        <span>Buy on {lowest.store}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </a>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
