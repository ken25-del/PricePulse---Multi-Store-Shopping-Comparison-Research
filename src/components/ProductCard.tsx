import React, { useState } from 'react';
import { ProductGroup, NormalizedProduct } from '../types';
import { translations } from '../lib/i18n';
import { getRealProductImageFallback } from '../lib/imageUtils';
import { 
  Heart, 
  Scale, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Award, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown,
  Store,
  Bell,
  BellRing
} from 'lucide-react';

interface ProductCardProps {
  productGroup: ProductGroup;
  language: 'en' | 'hi';
  isWishlisted: boolean;
  isSelectedForCompare: boolean;
  isPriceTracked?: boolean;
  onToggleWishlist: () => void;
  onToggleCompare: () => void;
  onTogglePriceTrack?: (listing?: NormalizedProduct) => void;
  onViewDetails: () => void;
  isListingTracked?: (storeId: string) => boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productGroup,
  language,
  isWishlisted,
  isSelectedForCompare,
  isPriceTracked = false,
  onToggleWishlist,
  onToggleCompare,
  onTogglePriceTrack,
  onViewDetails,
  isListingTracked
}) => {
  const t = translations[language];
  const listings = productGroup.listings;
  const [showFullResearch, setShowFullResearch] = useState(false);

  // Winner banner configuration
  const winnerConfig: Record<string, { label: string; icon: React.FC<{ className?: string }>; bg: string; text: string; border: string }> = {
    best_overall: { label: 'BEST OVERALL', icon: Award, bg: 'bg-[#FF3E00]', text: 'text-black', border: 'border-[#FF3E00]' },
    best_price: { label: 'BEST PRICE', icon: TrendingDown, bg: 'bg-emerald-500', text: 'text-black', border: 'border-emerald-500' },
    best_value: { label: 'BEST VALUE', icon: Sparkles, bg: 'bg-amber-500', text: 'text-black', border: 'border-amber-500' },
    best_rated: { label: 'TOP RATED', icon: Star, bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500' },
    most_reviewed: { label: 'MOST REVIEWED', icon: ShieldCheck, bg: 'bg-cyan-500', text: 'text-black', border: 'border-cyan-500' },
    best_store_option: { label: 'MULTI-STORE CHOICE', icon: Store, bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' },
  };

  const currentWinner = productGroup.winnerCategory ? winnerConfig[productGroup.winnerCategory] : null;

  return (
    <div className={`bg-white dark:bg-[#111111] border rounded-xl p-4 sm:p-5 transition-all flex flex-col justify-between group shadow-sm dark:shadow-lg ${
      productGroup.winnerCategory === 'best_overall' 
        ? 'border-[#FF3E00]/60 ring-1 ring-[#FF3E00]/30' 
        : 'border-zinc-200 dark:border-[#242424] hover:border-zinc-300 dark:hover:border-[#383838]'
    }`}>
      {/* Top section */}
      <div>
        {/* Winner Tag Banner if applicable */}
        {currentWinner && (
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-200 dark:border-[#222222]">
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-black uppercase tracking-wider ${currentWinner.bg} ${currentWinner.text}`}>
              <currentWinner.icon className="w-3.5 h-3.5" />
              <span>{currentWinner.label}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              Platform Index: <strong className="text-zinc-900 dark:text-white">{productGroup.platformScore}/10</strong>
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="relative w-full sm:w-44 h-52 sm:h-44 rounded-lg overflow-hidden bg-zinc-50 dark:bg-[#0c0c0c] shrink-0 border border-zinc-200 dark:border-[#262626]">
            <img
              src={productGroup.primaryImage}
              alt={productGroup.canonicalTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getRealProductImageFallback(productGroup.canonicalTitle, productGroup.category);
              }}
            />

            {/* Platform count pill */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-black/90 text-white font-mono text-[10px] font-black uppercase tracking-wider border border-[#333333]">
              {listings.length} {listings.length === 1 ? 'STORE' : 'STORES'}
            </div>

            {/* Quick Actions overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={onToggleWishlist}
                title={isWishlisted ? 'Remove from Saved Research' : 'Save to Wishlist & Research'}
                className={`p-1.5 rounded-md backdrop-blur-md transition-colors border cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                    : 'bg-white/90 dark:bg-black/80 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border-zinc-300 dark:border-[#333333] shadow-xs'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-black stroke-black' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onToggleCompare}
                title="Add to Side-by-Side Decision Comparison"
                className={`p-1.5 rounded-md backdrop-blur-md transition-colors border cursor-pointer ${
                  isSelectedForCompare
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white'
                    : 'bg-white/90 dark:bg-black/80 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border-zinc-300 dark:border-[#333333] shadow-xs'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onTogglePriceTrack && onTogglePriceTrack()}
                title={isPriceTracked ? 'Tracking Price (Alerts Enabled)' : 'Track Price (Get Price Drop Alerts)'}
                className={`p-1.5 rounded-md backdrop-blur-md transition-colors border cursor-pointer ${
                  isPriceTracked
                    ? 'bg-amber-400 text-black border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-white/90 dark:bg-black/80 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 border-zinc-300 dark:border-[#333333] shadow-xs'
                }`}
              >
                {isPriceTracked ? (
                  <BellRing className="w-3.5 h-3.5 animate-bounce" />
                ) : (
                  <Bell className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2 font-mono">
              {productGroup.savingsPercent >= 10 && (
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-[#1c2e1f] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-[#27532d]">
                  SAVE ₹{productGroup.priceDifference.toLocaleString('en-IN')} ({productGroup.savingsPercent}%)
                </span>
              )}
              {productGroup.reviewConfidence && (
                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                  productGroup.reviewConfidence === 'high' 
                    ? 'bg-cyan-50 dark:bg-[#102024] text-cyan-800 dark:text-cyan-400 border-cyan-200 dark:border-[#1c444e]'
                    : 'bg-zinc-100 dark:bg-[#1a1a1a] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#2e2e2e]'
                }`}>
                  {productGroup.reviewConfidence} Review Confidence
                </span>
              )}
              {productGroup.brand && (
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-[#1c1c1c] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#2e2e2e]">
                  {productGroup.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              onClick={onViewDetails}
              className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white line-clamp-2 hover:text-[#FF3E00] cursor-pointer tracking-tight leading-snug"
            >
              {productGroup.canonicalTitle}
            </h3>

            {/* Attributes & Material */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono">
              {productGroup.material && (
                <span>FABRIC: <strong className="text-zinc-800 dark:text-zinc-200">{productGroup.material}</strong></span>
              )}
              {productGroup.color && (
                <span>COLOR: <strong className="text-zinc-800 dark:text-zinc-200">{productGroup.color}</strong></span>
              )}
              {productGroup.occasion && (
                <span>OCCASION: <strong className="text-zinc-800 dark:text-zinc-200">{productGroup.occasion}</strong></span>
              )}
            </div>

            {/* Ratings & Price vs Quality Snapshot */}
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 font-mono">
              <div className="flex items-center gap-1 bg-orange-50 dark:bg-[#1a1410] text-[#C03000] dark:text-[#FF9575] px-2 py-0.5 rounded-sm font-black text-xs border border-orange-200 dark:border-[#442217]">
                <span>{productGroup.averageRating}</span>
                <Star className="w-3 h-3 fill-current text-[#FF3E00]" />
                <span className="text-zinc-500 font-normal ml-0.5">({productGroup.totalReviews.toLocaleString('en-IN')})</span>
              </div>

              {productGroup.priceVsQuality && (
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-[#161616] px-2 py-0.5 rounded border border-zinc-200 dark:border-[#292929]">
                  Value Rating: <strong className="text-emerald-600 dark:text-emerald-400">{productGroup.priceVsQuality.valueRating}</strong>
                </span>
              )}

              {productGroup.sentiment && productGroup.sentiment !== 'insufficient_data' && (
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-[#161616] px-2 py-0.5 rounded border border-zinc-200 dark:border-[#292929]">
                  Sentiment: <strong className={productGroup.sentiment === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{productGroup.sentiment.toUpperCase()}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Evidence-Based Research Summary Box */}
        <div className="mt-3.5 space-y-2">
          {/* Why This Product */}
          {productGroup.whyRecommended && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#141814] border border-emerald-200 dark:border-[#223d26] text-xs">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 text-[11px] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Why This Product?</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed font-sans">
                {productGroup.whyRecommended}
              </p>
            </div>
          )}

          {/* Things to Consider (What to watch out for) */}
          {productGroup.thingsToConsider && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-[#181612] border border-amber-200 dark:border-[#423219] text-xs">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 text-[11px] mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Things to Consider / What to watch out for</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed font-sans">
                {productGroup.thingsToConsider}
              </p>
            </div>
          )}

          {/* "Why Not Cheapest?" Explanation if best overall */}
          {productGroup.whyNotCheapestExplanation && (
            <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-[#1a1410] border border-orange-200 dark:border-[#442217] text-xs">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#C03000] dark:text-[#FF9575] block mb-0.5">
                Why recommend this over the cheapest option?
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed font-sans">
                {productGroup.whyNotCheapestExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Expandable Review Intelligence & Store Breakdown */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowFullResearch(!showFullResearch)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#151515] hover:bg-zinc-200 dark:hover:bg-[#1c1c1c] text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-[#262626] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>Review Intelligence & Store Rating Breakdown</span>
            </span>
            {showFullResearch ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFullResearch && (
            <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-[#0e0e0e] border border-zinc-200 dark:border-[#262626] space-y-3">
              {/* Buyers Like vs Dislike */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 dark:bg-[#121c14] border border-emerald-200 dark:border-[#204027] p-2.5 rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] mb-1.5">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Buyers Like</span>
                  </div>
                  <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                    {(productGroup.positiveThemes || productGroup.aiReviewSummary?.whatBuyersLike || []).slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600 dark:text-emerald-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50 dark:bg-[#1c1412] border border-rose-200 dark:border-[#442017] p-2.5 rounded-lg">
                  <div className="flex items-center gap-1 text-rose-700 dark:text-amber-400 font-mono font-bold text-[11px] mb-1.5">
                    <ThumbsDown className="w-3 h-3" />
                    <span>Buyers Dislike / Cautions</span>
                  </div>
                  <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                    {(productGroup.negativeThemes || productGroup.aiReviewSummary?.commonConcerns || []).slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-500 dark:text-amber-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Source-by-source ratings */}
              {productGroup.sourceReviewBreakdown && productGroup.sourceReviewBreakdown.length > 0 && (
                <div className="pt-2 border-t border-zinc-200 dark:border-[#222222]">
                  <span className="font-mono text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 block mb-1.5">
                    Ratings Breakdown by Store
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {productGroup.sourceReviewBreakdown.map((s, idx) => (
                      <div key={idx} className="bg-zinc-100 dark:bg-[#161616] border border-zinc-200 dark:border-[#2c2c2c] px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5">
                        <span className="text-zinc-800 dark:text-zinc-300 font-bold">{s.store}:</span>
                        <span className="text-[#C03000] dark:text-[#FF9575] font-bold">{s.rating}★</span>
                        <span className="text-zinc-500">({s.reviewCount})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multi-Store Price Comparison Box */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-[#222222]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <Store className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.comparePrices} ({listings.length} {listings.length === 1 ? 'Store' : 'Stores'})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">Lowest:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                ₹{productGroup.minPrice.toLocaleString('en-IN')} on {productGroup.lowestPriceStore}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {listings.map((item, idx) => {
              const isLowest = item.price === productGroup.minPrice;
              const diffFromLowest = item.price - productGroup.minPrice;

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg text-xs transition-colors border gap-2 ${
                    isLowest
                      ? 'bg-emerald-50/80 dark:bg-[#0f1f14] border-emerald-300 dark:border-[#1d4c26] text-zinc-900 dark:text-white shadow-xs'
                      : 'bg-zinc-50 dark:bg-[#151515] border-zinc-200 dark:border-[#242424] hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  {/* Left: Store Name & Badges */}
                  <div className="flex items-center gap-2 min-w-0 font-mono">
                    <span className="font-bold text-zinc-900 dark:text-white text-xs truncate">
                      {item.store}
                    </span>

                    {isLowest ? (
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-xs bg-emerald-500 text-black">
                        LOWEST PRICE
                      </span>
                    ) : diffFromLowest > 0 ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-xs bg-amber-50 dark:bg-[#241a18] text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-[#442720]">
                        +₹{diffFromLowest.toLocaleString('en-IN')}
                      </span>
                    ) : null}

                    {item.rating > 0 && (
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden md:inline">
                        ({item.rating}★)
                      </span>
                    )}
                  </div>

                  {/* Right: Exact Price + Track Price Button + Direct Store Link */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
                    <div className="text-left sm:text-right font-mono-num">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-black ${isLowest ? 'text-emerald-600 dark:text-emerald-400 text-sm' : 'text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm'}`}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-through">
                            ₹{item.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {item.discountPercent ? (
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 sm:text-right">
                          {item.discountPercent}% OFF
                        </div>
                      ) : null}
                    </div>

                    {/* Track Price Button for this individual listing */}
                    {onTogglePriceTrack && (
                      <button
                        type="button"
                        onClick={() => onTogglePriceTrack(item)}
                        title={isListingTracked && isListingTracked(item.storeId) ? `Price tracking enabled for ${item.store}` : `Track price on ${item.store}`}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer border ${
                          isListingTracked && isListingTracked(item.storeId)
                            ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                            : 'bg-white dark:bg-[#181818] hover:bg-zinc-100 dark:hover:bg-[#242424] text-zinc-700 dark:text-zinc-300 hover:text-amber-500 border-zinc-300 dark:border-[#303030]'
                        }`}
                      >
                        {isListingTracked && isListingTracked(item.storeId) ? (
                          <>
                            <BellRing className="w-3 h-3 animate-pulse text-black" />
                            <span className="hidden md:inline text-[10px] font-black uppercase">Tracked</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3 h-3" />
                            <span className="hidden md:inline text-[10px] uppercase">Track</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Direct Buy Link with exact URL */}
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open exact product on ${item.store}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-black uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-sm ${
                        isLowest
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                          : 'bg-zinc-800 dark:bg-[#2a2a2a] hover:bg-zinc-900 dark:hover:bg-[#383838] text-white border border-zinc-800 dark:border-[#383838]'
                      }`}
                    >
                      <span>Buy on {item.store.split(' ')[0]}</span>
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-[#222222] flex items-center justify-between">
        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          RANGE: <strong className="text-zinc-900 dark:text-white font-mono-num">₹{productGroup.minPrice.toLocaleString('en-IN')}</strong> — <strong className="text-zinc-900 dark:text-white font-mono-num">₹{productGroup.maxPrice.toLocaleString('en-IN')}</strong>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono font-black uppercase tracking-wider bg-[#FF3E00] hover:bg-[#E03600] text-black shadow-sm transition-colors cursor-pointer"
        >
          <span>Research Deep-Dive</span>
        </button>
      </div>
    </div>
  );
};
