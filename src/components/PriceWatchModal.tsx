import React, { useState } from 'react';
import { TrackedPriceItem, AppSettings } from '../types';
import { getRealProductImageFallback } from '../lib/imageUtils';
import { 
  X, 
  TrendingDown, 
  Bell, 
  BellRing, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

interface PriceWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackedItems: TrackedPriceItem[];
  onUntrack: (id: string) => void;
  onSimulateDrop: (id: string) => void;
  onClearAll: () => void;
  settings: AppSettings;
}

export const PriceWatchModal: React.FC<PriceWatchModalProps> = ({
  isOpen,
  onClose,
  trackedItems,
  onUntrack,
  onSimulateDrop,
  onClearAll,
  settings
}) => {
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<TrackedPriceItem | null>(null);

  if (!isOpen) return null;

  const droppedItems = trackedItems.filter(i => i.priceDropDetected);
  const totalSavingsAcrossDrops = droppedItems.reduce((acc, curr) => acc + (curr.priceDropAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#f4f4f4]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase font-display">
                  Price Watch & Drop Alerts
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1e1e1e] text-zinc-300 border border-[#333333]">
                  {trackedItems.length} {trackedItems.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Background price monitor checking rate cuts across verified shopping stores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trackedItems.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-red-400 bg-[#1a1a1a] hover:bg-[#241a1a] border border-[#2c2c2c] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Watchlist</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-[#1a1a1a] hover:bg-[#252525] rounded-xl transition-colors border border-[#2c2c2c] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Drop Alert Highlights Banner if any drops detected */}
        {droppedItems.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#102a18]/90 to-emerald-950/80 border-b border-emerald-500/30 p-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-xs font-mono font-black text-emerald-300 uppercase tracking-wider block">
                  ⚡ Significant Price Drop Detected on Next App Load!
                </span>
                <p className="text-[11px] text-zinc-300 font-mono">
                  {droppedItems.length} of your tracked {droppedItems.length === 1 ? 'item is' : 'items are'} currently on flash discount. Total Potential Savings: <strong className="text-emerald-400 font-black">₹{totalSavingsAcrossDrops.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                {droppedItems.length} DEAL {droppedItems.length === 1 ? 'READY' : 'ALERTS'}
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {trackedItems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#141414] rounded-2xl border border-dashed border-[#2c2c2c] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1c1c1c] text-zinc-500 flex items-center justify-center mb-4 border border-[#2a2a2a]">
                <Bell className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
                No Tracked Products Yet
              </h3>
              <p className="text-xs font-mono text-zinc-400 max-w-md mt-1.5 leading-relaxed">
                Click the <strong className="text-amber-400">"Track Price"</strong> button on any product listing or store row to start monitoring prices in local storage. When a significant price drop is detected on your next visit, you'll receive an instant alert!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {trackedItems.map((item) => {
                const hasDrop = item.priceDropDetected && (item.priceDropAmount || 0) > 0;
                const percentDrop = item.priceDropPercent || 0;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row gap-4 relative group ${
                      hasDrop 
                        ? 'bg-[#101b13] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20' 
                        : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-[#0c0c0c] border border-[#262626] shrink-0">
                      <img
                        src={item.primaryImage}
                        alt={item.canonicalTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getRealProductImageFallback(item.canonicalTitle, item.category);
                        }}
                      />
                      {hasDrop && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-sm bg-emerald-500 text-black font-mono font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                          <TrendingDown className="w-2.5 h-2.5 stroke-[3]" />
                          <span>-{percentDrop}%</span>
                        </div>
                      )}
                    </div>

                    {/* Meta & Pricing Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Top Store Badge & Notification Pill */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c1c1c] text-zinc-300 border border-[#2e2e2e]">
                              {item.store}
                            </span>
                            {item.category && (
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                • {item.category}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Tracked {new Date(item.trackedAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>

                        {/* Product Title */}
                        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#FF3E00] transition-colors">
                          {item.canonicalTitle}
                        </h4>

                        {/* Price Drop Banner if active */}
                        {hasDrop ? (
                          <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black font-black text-[10px] uppercase">
                                PRICE DROP ALERT
                              </span>
                              <span className="text-emerald-300 font-bold">
                                Dropped by ₹{item.priceDropAmount?.toLocaleString('en-IN')}!
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400">
                              Lowest Recorded: ₹{item.lowestPriceEver.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Currently stable at target monitoring price</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Pricing & Actions */}
                      <div className="mt-3 pt-2.5 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                        <div className="flex items-baseline gap-2.5">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase font-bold block">CURRENT PRICE</span>
                            <span className={`text-base font-black font-mono-num ${hasDrop ? 'text-emerald-400' : 'text-white'}`}>
                              ₹{item.currentPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="pl-2 border-l border-[#2e2e2e]">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold block">START PRICE</span>
                            <span className="text-xs text-zinc-400 font-mono-num line-through">
                              ₹{item.initialPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {item.targetPriceAlert && (
                            <div className="pl-2 border-l border-[#2e2e2e] hidden md:block">
                              <span className="text-[9px] text-zinc-500 uppercase font-bold block">TARGET ALERT</span>
                              <span className="text-xs text-amber-300 font-mono-num">
                                ≤ ₹{item.targetPriceAlert.toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Simulate Price Drop Trigger for demo */}
                          <button
                            type="button"
                            onClick={() => onSimulateDrop(item.id)}
                            title="Simulate a price drop on next load for testing"
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span className="hidden sm:inline">Simulate Drop</span>
                          </button>

                          {/* View Price Timeline History */}
                          <button
                            type="button"
                            onClick={() => setSelectedItemForHistory(item)}
                            title="View Price History Timeline"
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-zinc-300 hover:text-white bg-[#1c1c1c] hover:bg-[#282828] border border-[#2e2e2e] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-3 h-3" />
                            <span>History</span>
                          </button>

                          {/* Direct Store Buy Link */}
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm ${
                              hasDrop
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                : 'bg-[#2a2a2a] hover:bg-[#383838] text-white border border-[#383838]'
                            }`}
                          >
                            <span>Buy on {item.store.split(' ')[0]}</span>
                            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                          </a>

                          {/* Delete from Watchlist */}
                          <button
                            type="button"
                            onClick={() => onUntrack(item.id)}
                            title="Remove from Price Watch"
                            className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-[#241a1a] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141414] border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Price Watch state is preserved in browser storage across restarts and visits.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#222222] hover:bg-[#2d2d2d] text-white font-bold transition-colors cursor-pointer"
          >
            Close Price Watch
          </button>
        </div>
      </div>

      {/* Nested Price History Drawer / Modal */}
      {selectedItemForHistory && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl w-full max-w-lg p-5 shadow-2xl font-mono text-[#f4f4f4] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Price History & Timeline
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForHistory(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-white line-clamp-1">
                {selectedItemForHistory.canonicalTitle}
              </div>
              <div className="text-[11px] text-zinc-400">
                Store: <strong className="text-zinc-200">{selectedItemForHistory.store}</strong> • Initial: ₹{selectedItemForHistory.initialPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Timeline Entries */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {selectedItemForHistory.priceHistory.map((entry, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <span className="text-zinc-300 text-[11px]">
                      {entry.note || 'Price Check'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-emerald-400 font-mono-num">
                      ₹{entry.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#262626] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItemForHistory(null)}
                className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
