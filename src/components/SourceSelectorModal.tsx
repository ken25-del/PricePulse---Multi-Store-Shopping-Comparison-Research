import React from 'react';
import { ShoppingSource, AppSettings } from '../types';
import { translations } from '../lib/i18n';
import { X, CheckSquare, Square, Sliders, ShieldCheck } from 'lucide-react';

interface SourceSelectorModalProps {
  allSources: ShoppingSource[];
  selectedSourceIds: string[];
  settings: AppSettings;
  onUpdateSelectedSources: (ids: string[]) => void;
  onClose: () => void;
}

export const SourceSelectorModal: React.FC<SourceSelectorModalProps> = ({
  allSources,
  selectedSourceIds,
  settings,
  onUpdateSelectedSources,
  onClose
}) => {
  const t = translations[settings.language];

  const handleToggle = (id: string) => {
    if (selectedSourceIds.includes(id)) {
      if (selectedSourceIds.length > 1) {
        onUpdateSelectedSources(selectedSourceIds.filter(sId => sId !== id));
      }
    } else {
      onUpdateSelectedSources([...selectedSourceIds, id]);
    }
  };

  const handleSelectAll = () => {
    onUpdateSelectedSources(allSources.map(s => s.id));
  };

  const handleSelectTopN = (count: number) => {
    onUpdateSelectedSources(allSources.slice(0, count).map(s => s.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0d0d0d] rounded-xl shadow-2xl border border-zinc-200 dark:border-[#262626] overflow-hidden text-zinc-900 dark:text-[#f4f4f4] transition-colors">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-[#242424] bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
              CONFIGURE SOURCES ({selectedSourceIds.length} OF {allSources.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] border border-zinc-300 dark:border-[#303030] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets & Quick Actions */}
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-[#242424] bg-zinc-50 dark:bg-[#121212] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-zinc-500 text-[11px]">PRESETS:</span>
            <button
              onClick={() => handleSelectTopN(3)}
              className="px-2.5 py-1 rounded-sm bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-[#303030] text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] hover:border-[#FF3E00] hover:text-[#FF3E00] dark:hover:text-white transition-colors cursor-pointer"
            >
              TOP 3 SITES
            </button>
            <button
              onClick={() => handleSelectTopN(5)}
              className="px-2.5 py-1 rounded-sm bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-[#303030] text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] hover:border-[#FF3E00] hover:text-[#FF3E00] dark:hover:text-white transition-colors cursor-pointer"
            >
              TOP 5 SITES
            </button>
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-sm bg-white dark:bg-[#1a1a1a] border border-zinc-300 dark:border-[#303030] text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] hover:border-[#FF3E00] hover:text-[#FF3E00] dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.selectAll.toUpperCase()} ({allSources.length})
            </button>
          </div>
        </div>

        {/* Sources List */}
        <div className="p-5 overflow-y-auto space-y-2 flex-1 font-mono">
          {allSources.map((source) => {
            const isSelected = selectedSourceIds.includes(source.id);
            return (
              <div
                key={source.id}
                onClick={() => handleToggle(source.id)}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF3E00] bg-orange-50/50 dark:bg-[#FF3E00]/5'
                    : 'border-zinc-200 dark:border-[#222222] bg-white dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-[#333333]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#FF3E00]" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white tracking-tight">
                        {source.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        ({source.domain})
                      </span>
                      {source.isCustom && (
                        <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-bold bg-[#FF3E00]/10 dark:bg-[#FF3E00]/20 text-[#FF3E00] border border-[#FF3E00]/30 dark:border-[#FF3E00]/40 uppercase">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                      {source.description}
                    </p>
                    {source.categorySpecialty && source.categorySpecialty.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5 font-mono">
                        {source.categorySpecialty.map((c, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-xs bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-[#2a2a2a] text-zinc-600 dark:text-zinc-400 font-bold uppercase">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PUBLIC</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-[#242424] bg-zinc-50 dark:bg-[#090909] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500 text-[11px] uppercase">
            SELECTED SOURCES WILL BE PARSED SIMULTANEOUSLY.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm font-bold bg-[#FF3E00] hover:bg-[#E03600] text-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            APPLY SOURCES
          </button>
        </div>
      </div>
    </div>
  );
};
