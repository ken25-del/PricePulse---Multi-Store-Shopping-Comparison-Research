import React, { useState } from 'react';
import { ProductGroup, AppSettings, NormalizedProduct } from '../types';
import { translations } from '../lib/i18n';
import { getRealProductImageFallback } from '../lib/imageUtils';
import { 
  X, 
  Heart, 
  Scale, 
  Star, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Info,
  ThumbsUp,
  ThumbsDown,
  Award,
  TrendingDown,
  Store,
  Bell,
  BellRing
} from 'lucide-react';

interface ProductDetailModalProps {
  productGroup: ProductGroup | null;
  settings: AppSettings;
  isWishlisted: boolean;
  isSelectedForCompare: boolean;
  isPriceTracked?: boolean;
  onToggleWishlist: () => void;
  onToggleCompare: () => void;
  onTogglePriceTrack?: (listing?: NormalizedProduct) => void;
  onClose: () => void;
  isListingTracked?: (storeId: string) => boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productGroup,
  settings,
  isWishlisted,
  isSelectedForCompare,
  isPriceTracked = false,
  onToggleWishlist,
  onToggleCompare,
  onTogglePriceTrack,
  onClose,
  isListingTracked
}) => {
  if (!productGroup) return null;

  const [selectedImage, setSelectedImage] = useState(productGroup.primaryImage);
  const t = translations[settings.language];
  const listings = productGroup.listings;
  const reviewSummary = productGroup.aiReviewSummary;
  const verdict = productGroup.aiVerdict;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#262626] overflow-hidden text-[#f4f4f4] my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-[#1f1510] text-[#FF9575] border border-[#442217]">
              {listings.length} STORES COMPARED
            </span>
            {productGroup.savingsPercent >= 10 && (
              <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-[#112417] text-emerald-400 border border-[#1e4a28]">
                SAVE ₹{productGroup.priceDifference.toLocaleString('en-IN')} ({productGroup.savingsPercent}%)
              </span>
            )}
            {productGroup.winnerCategory && (
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider bg-[#FF3E00] text-black">
                {productGroup.winnerCategory.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTogglePriceTrack && onTogglePriceTrack()}
              title={isPriceTracked ? 'Price Tracking Active (Alerts Enabled)' : 'Track Price (Get Alert on Drops)'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-mono font-bold transition-colors cursor-pointer ${
                isPriceTracked
                  ? 'bg-amber-400 text-black border-amber-400 shadow-md ring-1 ring-amber-400/50'
                  : 'hover:bg-[#1a1a1a] border-[#303030] text-zinc-300 hover:text-amber-400'
              }`}
            >
              {isPriceTracked ? (
                <>
                  <BellRing className="w-4 h-4 animate-bounce" />
                  <span className="hidden sm:inline uppercase text-[10px] font-black">Tracking Active</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline uppercase text-[10px]">Track Price</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleWishlist}
              title={isWishlisted ? 'Remove from Saved Research' : 'Save to Wishlist & Research'}
              className={`p-2 rounded-md border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                  : 'hover:bg-[#1a1a1a] border-[#303030] text-zinc-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onToggleCompare}
              title="Add to Decision Comparison"
              className={`p-2 rounded-md border transition-colors cursor-pointer ${
                isSelectedForCompare
                  ? 'bg-white text-black border-white'
                  : 'hover:bg-[#1a1a1a] border-[#303030] text-zinc-300'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-[#1a1a1a] border border-[#303030] text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Overview: Image + Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="w-full h-72 sm:h-80 rounded-lg overflow-hidden bg-[#141414] border border-[#282828]">
                <img
                  src={selectedImage}
                  alt={productGroup.canonicalTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getRealProductImageFallback(productGroup.canonicalTitle, productGroup.category);
                  }}
                />
              </div>

              {productGroup.galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {productGroup.galleryImages.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#FF3E00]'
                          : 'border-[#282828] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spec Sheet */}
            <div className="md:col-span-7 space-y-4">
              <div>
                {productGroup.brand && (
                  <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3E00]">
                    {productGroup.brand}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug tracking-tight">
                  {productGroup.canonicalTitle}
                </h2>
              </div>

              {/* Price Range Strip */}
              <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2a2a2a] flex items-center justify-between font-mono">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">PRICE ACROSS STORES:</div>
                  <div className="text-xl font-black text-white font-mono-num">
                    ₹{productGroup.minPrice.toLocaleString('en-IN')} <span className="text-xs font-normal text-zinc-500">to</span> ₹{productGroup.maxPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-emerald-400 font-bold uppercase">
                    LOWEST AT {productGroup.lowestPriceStore}
                  </div>
                  <div className="text-xs font-black text-[#FF9575]">
                    DIFF: ₹{productGroup.priceDifference.toLocaleString('en-IN')} ({productGroup.savingsPercent}%)
                  </div>
                </div>
              </div>

              {/* Spec Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                {productGroup.material && (
                  <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">FABRIC</span>
                    <strong className="text-white">{productGroup.material}</strong>
                  </div>
                )}
                {productGroup.color && (
                  <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">COLOR</span>
                    <strong className="text-white">{productGroup.color}</strong>
                  </div>
                )}
                {productGroup.occasion && (
                  <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">OCCASION</span>
                    <strong className="text-white">{productGroup.occasion}</strong>
                  </div>
                )}
                <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">RATING</span>
                  <div className="flex items-center gap-1 font-bold text-white">
                    <span>{productGroup.averageRating}★</span>
                    <span className="text-zinc-500 font-normal">({productGroup.totalReviews})</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">INDEX SCORE</span>
                  <strong className="text-emerald-400">{productGroup.platformScore} / 10</strong>
                </div>
                <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">REVIEW CONFIDENCE</span>
                  <strong className={productGroup.reviewConfidence === 'high' ? 'text-cyan-400' : 'text-zinc-300'}>
                    {productGroup.reviewConfidence?.toUpperCase() || 'MEDIUM'}
                  </strong>
                </div>
              </div>

              {/* Description */}
              {productGroup.description && (
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {productGroup.description}
                </p>
              )}
            </div>
          </div>

          {/* Research Breakdown Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Why This Product */}
            <div className="p-4 rounded-xl bg-[#121c14] border border-[#1f4227] space-y-2">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Why This Product?</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {productGroup.whyRecommended || 'Verified cross-store product matching customer specifications and quality standards.'}
              </p>
              {productGroup.positiveThemes && productGroup.positiveThemes.length > 0 && (
                <div className="pt-2 border-t border-[#1f4227]/60 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-300 block">Verified Highlights:</span>
                  {productGroup.positiveThemes.map((theme, i) => (
                    <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{theme}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Things to Consider */}
            <div className="p-4 rounded-xl bg-[#1c1612] border border-[#4a2e1d] space-y-2">
              <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-amber-400 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Things to Consider / What to watch out for</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {productGroup.thingsToConsider || 'Ensure you check store-specific seller ratings and return windows before ordering.'}
              </p>
              {productGroup.negativeThemes && productGroup.negativeThemes.length > 0 && (
                <div className="pt-2 border-t border-[#4a2e1d]/60 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-300 block">Buyer Notes:</span>
                  {productGroup.negativeThemes.map((theme, i) => (
                    <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{theme}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cross-Store Comparison Table */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#FF3E00]" />
                <span>EXACT STORE PRICE COMPARISON ({listings.length} STORES AVAILABLE)</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Save ₹{productGroup.priceDifference.toLocaleString('en-IN')} ({productGroup.savingsPercent}%) by choosing {productGroup.lowestPriceStore}
              </span>
            </div>

            <div className="overflow-x-auto border border-[#262626] rounded-xl bg-[#101010]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#161616] text-zinc-300 font-mono font-bold uppercase tracking-wider border-b border-[#262626] text-[11px]">
                  <tr>
                    <th className="p-3.5">SHOPPING STORE</th>
                    <th className="p-3.5">STORE PRICE</th>
                    <th className="p-3.5">DIFF VS LOWEST</th>
                    <th className="p-3.5">DISCOUNT / MRP</th>
                    <th className="p-3.5">RATING</th>
                    <th className="p-3.5">DELIVERY & RETURN</th>
                    <th className="p-3.5 text-right">EXACT STORE LINK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {listings.map((item, idx) => {
                    const isLowest = item.price === productGroup.minPrice;
                    const diffFromLowest = item.price - productGroup.minPrice;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors font-mono ${
                          isLowest
                            ? 'bg-[#0e2114] font-medium'
                            : 'hover:bg-[#161616]'
                        }`}
                      >
                        {/* Store */}
                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-sm">{item.store}</span>
                            {isLowest && (
                              <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-xs bg-emerald-400 text-black">
                                LOWEST PRICE
                              </span>
                            )}
                          </div>
                          {item.seller && (
                            <div className="text-[10px] text-zinc-400 mt-0.5">SELLER: {item.seller}</div>
                          )}
                        </td>

                        {/* Price */}
                        <td className="p-3.5 font-mono-num">
                          <div className={`font-black ${isLowest ? 'text-emerald-400 text-base' : 'text-zinc-100 text-sm'}`}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Diff vs Lowest */}
                        <td className="p-3.5 font-mono">
                          {isLowest ? (
                            <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                              ✓ Best Deal
                            </span>
                          ) : (
                            <span className="text-amber-300 font-bold text-[11px] bg-[#291b15] px-2 py-0.5 rounded border border-[#4d2d1e]">
                              +₹{diffFromLowest.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        {/* Discount */}
                        <td className="p-3.5">
                          {item.discountPercent ? (
                            <span className="text-emerald-400 font-bold">
                              {item.discountPercent}% OFF
                            </span>
                          ) : (
                            <span className="text-zinc-400">Standard</span>
                          )}
                          {item.mrp && item.mrp > item.price && (
                            <div className="text-[10px] text-zinc-500 line-through">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Rating */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1 font-bold">
                            <span>{item.rating}</span>
                            <Star className="w-3.5 h-3.5 fill-current text-[#FF3E00]" />
                            <span className="text-zinc-400 text-[10px]">({item.reviewCount})</span>
                          </div>
                        </td>

                        {/* Delivery & Return */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                            <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{item.deliveryInfo || 'Standard Delivery'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1">
                            <RotateCcw className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span>{item.returnPolicy || '7 Days Return'}</span>
                          </div>
                        </td>

                        {/* Action: Track Price + Direct Buy */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {onTogglePriceTrack && (
                              <button
                                type="button"
                                onClick={() => onTogglePriceTrack(item)}
                                title={isListingTracked && isListingTracked(item.storeId) ? `Price tracking enabled for ${item.store}` : `Track price on ${item.store}`}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer border ${
                                  isListingTracked && isListingTracked(item.storeId)
                                    ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                                    : 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-zinc-300 hover:text-amber-400 border-[#333333]'
                                }`}
                              >
                                {isListingTracked && isListingTracked(item.storeId) ? (
                                  <>
                                    <BellRing className="w-3.5 h-3.5 animate-pulse text-black" />
                                    <span className="hidden lg:inline text-[10px] font-black uppercase">Tracked</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-3.5 h-3.5" />
                                    <span className="hidden lg:inline text-[10px] uppercase">Track</span>
                                  </>
                                )}
                              </button>
                            )}

                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono font-black uppercase tracking-wider transition-transform active:scale-95 shadow-sm cursor-pointer ${
                                isLowest
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                  : 'bg-[#262626] hover:bg-[#363636] text-white border border-[#3a3a3a]'
                              }`}
                            >
                              <span>Buy on {item.store}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Verdict & Review Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
            {/* AI Review Summary */}
            {reviewSummary && (
              <div className="p-4 rounded-lg bg-[#141414] border border-[#262626] space-y-3">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#FF9575] text-xs">
                  <Sparkles className="w-4 h-4 text-[#FF3E00]" />
                  <span>{t.aiReviewSummary}</span>
                </div>

                {/* Pros */}
                {reviewSummary.whatBuyersLike.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                      {t.whatBuyersLike}:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300 font-sans">
                      {reviewSummary.whatBuyersLike.map((like, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{like}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Concerns */}
                {reviewSummary.commonConcerns.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9575] block mb-1">
                      {t.commonConcerns}:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300 font-sans">
                      {reviewSummary.commonConcerns.map((concern, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FF3E00] shrink-0 mt-0.5" />
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* AI Verdict */}
            {verdict && (
              <div className="p-4 rounded-lg bg-[#161210] border border-[#3b2118] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#FF9575] text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#FF3E00]" />
                    <span>{t.shouldIBuy}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-wider ${
                      verdict.status === 'recommended'
                        ? 'bg-[#122b19] text-emerald-300 border border-[#21572f]'
                        : verdict.status === 'consider'
                        ? 'bg-[#331c12] text-[#FF9575] border border-[#663520]'
                        : 'bg-[#331215] text-rose-300 border border-[#632027]'
                    }`}
                  >
                    {verdict.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="font-bold text-xs text-white">
                  {verdict.headline}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {verdict.reason}
                </p>

                {verdict.riskAlerts.length > 0 && (
                  <div className="p-2 rounded bg-[#241510] text-[11px] text-[#FF9575] border border-[#4d2619]">
                    <strong>ALERT:</strong> {verdict.riskAlerts.join(' • ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legal / Data honesty disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#141414] border border-[#222222] text-[11px] text-zinc-400 font-mono">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-500" />
            <span>{t.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
