import React, { useRef } from 'react';
import { ProductGroup, AppSettings } from '../types';
import { translations } from '../lib/i18n';
import { getRealProductImageFallback } from '../lib/imageUtils';
import { X, Heart, Trash2, ArrowUpRight, Download, Upload, Star, Clock, AlertCircle } from 'lucide-react';

interface WishlistModalProps {
  wishlist: ProductGroup[];
  settings: AppSettings;
  onRemoveItem: (id: string) => void;
  onClearWishlist: () => void;
  onViewProduct: (product: ProductGroup) => void;
  onImportWishlist: (items: ProductGroup[]) => void;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  wishlist,
  settings,
  onRemoveItem,
  onClearWishlist,
  onViewProduct,
  onImportWishlist,
  onClose
}) => {
  const t = translations[settings.language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(wishlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PricePulse_Saved_Research_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportWishlist(parsed);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#262626] overflow-hidden text-[#f4f4f4] my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF3E00] fill-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-white">
              SAVED PRODUCT RESEARCH ({wishlist.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExport}
                  title="Export Saved Research as JSON"
                  className="p-1.5 px-2.5 rounded-sm border border-[#303030] hover:bg-[#1a1a1a] text-zinc-300 text-xs flex items-center gap-1 font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  type="button"
                  onClick={onClearWishlist}
                  title="Clear Saved List"
                  className="p-1.5 px-2.5 rounded-sm border border-[#401515] hover:bg-[#251010] text-rose-400 text-xs flex items-center gap-1 font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import Saved Research JSON"
              className="p-1.5 px-2.5 rounded-sm border border-[#303030] hover:bg-[#1a1a1a] text-zinc-300 text-xs flex items-center gap-1 font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-[#1a1a1a] border border-[#303030] text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live disclaimer notification */}
        <div className="px-5 py-2.5 bg-[#14120f] border-b border-[#2d2218] flex items-center gap-2 text-xs font-mono text-[#FF9575]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF3E00]" />
          <span>Notice: Saved research reflects data captured when bookmarked. Current prices and store stock are subject to live change.</span>
        </div>

        {/* Wishlist Items List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 font-mono">
              <Heart className="w-12 h-12 stroke-[1.2] mx-auto text-zinc-700 mb-3" />
              <p className="font-bold text-sm text-zinc-400 uppercase tracking-wider">Your saved research list is empty.</p>
              <p className="text-xs mt-1 text-zinc-500">Bookmark any product card to preserve comparison metrics, pros, and buy links.</p>
            </div>
          ) : (
            wishlist.map((item) => {
              const lowest = item.listings[0];
              const savedDate = item.savedAtTimestamp 
                ? new Date(item.savedAtTimestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent Session';

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-lg border border-[#222222] hover:border-[#FF3E00]/60 transition-colors bg-[#121212]"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={item.primaryImage}
                      alt={item.canonicalTitle}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-md object-cover bg-[#1a1a1a] shrink-0 border border-[#2a2a2a]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getRealProductImageFallback(item.canonicalTitle, item.category);
                      }}
                    />
                    <div className="min-w-0">
                      <h4
                        onClick={() => {
                          onViewProduct(item);
                          onClose();
                        }}
                        className="font-bold text-xs sm:text-sm text-white hover:text-[#FF3E00] cursor-pointer line-clamp-1 tracking-tight"
                      >
                        {item.canonicalTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
                        <span className="font-bold text-emerald-400 font-mono-num">
                          ₹{item.minPrice.toLocaleString('en-IN')}
                        </span>
                        <span>•</span>
                        <span>{item.listings.length} STORES</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <span>{item.averageRating}</span>
                          <Star className="w-3 h-3 fill-current text-[#FF3E00]" />
                        </div>
                        <span>•</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Saved: {savedDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-mono">
                    <a
                      href={lowest.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-mono font-bold text-xs uppercase tracking-wider"
                    >
                      <span>Buy on {lowest.store}</span>
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#242424] bg-[#090909] text-xs text-zinc-500 font-mono flex items-center justify-between">
          <span>SAVED LOCALLY IN BROWSER STORAGE. NO SIGN-IN NEEDED.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-sm bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333333] font-mono font-bold uppercase tracking-wider text-white text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
