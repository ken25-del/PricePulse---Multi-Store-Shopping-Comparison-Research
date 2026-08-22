import React from 'react';
import { ShoppingBag, CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { SourceStatus } from '../types';

interface SourceStatusLiveProps {
  statuses: Record<string, {
    status: SourceStatus;
    count: number;
    latencyMs: number;
    error?: string;
    storeName: string;
  }>;
  isSearching: boolean;
  totalProductsFound: number;
  totalGroupsFound: number;
  onRetry?: () => void;
}

export const SourceStatusLive: React.FC<SourceStatusLiveProps> = ({
  statuses,
  isSearching,
  totalProductsFound,
  totalGroupsFound,
  onRetry
}) => {
  const entries = Object.entries(statuses) as [string, {
    status: SourceStatus;
    count: number;
    latencyMs: number;
    error?: string;
    storeName: string;
  }][];
  if (entries.length === 0) return null;

  const successfulCount = entries.filter(([, s]) => s.count > 0).length;
  const failedCount = entries.filter(([, s]) => s.status === 'error' || s.status === 'unavailable').length;

  return (
    <div className="w-full bg-[#101010] border border-[#242424] rounded-xl p-3.5 mb-5 shadow-sm text-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
            <ShoppingBag className="w-4 h-4 text-[#FF3E00]" />
            <span>
              {isSearching
                ? `STREAMING ${entries.length} SHOPPING SOURCES...`
                : `INDEXED ${successfulCount} / ${entries.length} SOURCES`}
            </span>
          </div>

          {!isSearching && totalGroupsFound > 0 && (
            <span className="bg-[#1f1510] text-[#FF9575] border border-[#4a2418] font-black px-2 py-0.5 rounded-sm text-[11px] font-mono-num">
              {totalGroupsFound} GROUPS ({totalProductsFound} LISTINGS)
            </span>
          )}
        </div>

        {failedCount > 0 && !isSearching && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FF3E00] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RETRY FAILED</span>
          </button>
        )}
      </div>

      {/* Grid of source statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {entries.map(([id, item]) => {
          let badgeColor = 'bg-[#151515] border-[#262626] text-zinc-400';
          let icon = <Clock className="w-3 h-3 text-zinc-500 animate-pulse" />;
          let label = 'SYNCING';

          if (item.status === 'available' || item.count > 0) {
            badgeColor = 'bg-[#0f1f14] border-[#1d4726] text-emerald-300';
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            label = `${item.count} ITEMS`;
          } else if (item.status === 'limited') {
            badgeColor = 'bg-[#211910] border-[#442c16] text-[#FF9575]';
            icon = <AlertTriangle className="w-3.5 h-3.5 text-[#FF3E00]" />;
            label = 'LIMITED';
          } else if (item.status === 'unavailable' || item.status === 'error') {
            badgeColor = 'bg-[#241113] border-[#4f1f23] text-rose-300';
            icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
            label = 'OFFLINE';
          }

          return (
            <div
              key={id}
              title={item.error || `${item.storeName}: ${label} (${item.latencyMs}ms)`}
              className={`flex items-center justify-between p-2 rounded-md border text-xs transition-colors ${badgeColor}`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {icon}
                <span className="font-bold truncate text-white uppercase">{item.storeName}</span>
              </div>
              <span className="text-[10px] font-mono-num shrink-0 ml-1 font-bold">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

