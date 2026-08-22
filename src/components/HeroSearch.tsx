import React, { useState, useEffect } from 'react';
import { Search, Sparkles, SlidersHorizontal, Plus, Compass, X, Loader2, ArrowRight } from 'lucide-react';
import { AppSettings, ShoppingSource } from '../types';
import { translations } from '../lib/i18n';

interface HeroSearchProps {
  settings: AppSettings;
  allSources: ShoppingSource[];
  selectedSourceIds: string[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onCancelSearch: () => void;
  onOpenSourceSelector: () => void;
  onOpenDiscovery: () => void;
  onOpenAddSource: () => void;
  onOpenWelcomeTour?: () => void;
  recentSearches: string[];
  onSelectRecentSearch: (query: string) => void;
  initialQuery?: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  settings,
  allSources,
  selectedSourceIds,
  isSearching,
  onSearch,
  onCancelSearch,
  onOpenSourceSelector,
  onOpenDiscovery,
  onOpenAddSource,
  onOpenWelcomeTour,
  recentSearches,
  onSelectRecentSearch,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const t = translations[settings.language];

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const activeSources = allSources.filter(s => selectedSourceIds.includes(s.id));

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-4 px-4">
      {/* Header Banner */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-orange-50 dark:bg-[#181818] border border-orange-200 dark:border-[#2a2a2a] text-[11px] font-mono font-bold tracking-widest text-[#FF3E00] uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse"></span>
          REAL-TIME INTELLIGENCE ENGINE
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
          {settings.language === 'hi' ? (
            <>एक बार खोजें, <span className="text-[#FF3E00]">सभी स्टोर्स</span> पर तुलना करें</>
          ) : (
            <>Search Once. <span className="text-[#FF3E00]">Compare Every Store.</span></>
          )}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
          {settings.language === 'hi'
            ? 'Amazon, Flipkart, Myntra, Meesho, Ajio और विशेष स्टोर्स पर वास्तविक कीमतों और समीक्षाओं की तुरंत तुलना करें।'
            : 'Uncover the lowest price, verified rating distributions, and deep review summaries across Amazon, Flipkart, Myntra, Meesho, and Ajio.'}
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-[#2c2c2c] focus-within:border-[#FF3E00] rounded-xl transition-all p-1.5 shadow-xl dark:shadow-2xl">
          <div className="pl-3.5 pr-2 text-zinc-400 dark:text-zinc-500">
            <Search className="w-5 h-5" />
          </div>

          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            disabled={isSearching}
            className="w-full py-3 px-2 text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 bg-transparent focus:outline-none disabled:opacity-60 font-medium"
          />

          {query && !isSearching && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white mr-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isSearching ? (
            <button
              id="cancel-search-btn"
              type="button"
              onClick={onCancelSearch}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow transition-all cursor-pointer"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.cancelSearch}</span>
            </button>
          ) : (
            <button
              id="submit-search-btn"
              type="submit"
              disabled={!query.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-xs sm:text-sm font-mono font-black uppercase tracking-wider bg-[#FF3E00] hover:bg-[#E03600] disabled:opacity-40 disabled:hover:bg-[#FF3E00] text-black shadow-md transition-all cursor-pointer shrink-0"
            >
              <span>{t.searchButton}</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline stroke-[2.5]" />
            </button>
          )}
        </div>
      </form>

      {/* Shopping Sources Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-[11px] mr-1">
            {t.selectSources} ({activeSources.length}):
          </span>
          {activeSources.slice(0, 5).map((source) => (
            <span
              key={source.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-[#161616] text-zinc-800 dark:text-zinc-300 font-mono font-semibold border border-zinc-300 dark:border-[#2a2a2a] text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              {source.name}
            </span>
          ))}
          {activeSources.length > 5 && (
            <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
              +{activeSources.length - 5} MORE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            id="hero-sources-config-btn"
            type="button"
            onClick={onOpenSourceSelector}
            className="flex items-center gap-1 text-[#FF3E00] hover:underline cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>SOURCES</span>
          </button>
          <span className="text-zinc-300 dark:text-[#333333]">|</span>
          <button
            id="hero-discover-btn"
            type="button"
            onClick={onOpenDiscovery}
            className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.discoverSites}</span>
          </button>
          <span className="text-zinc-300 dark:text-[#333333]">|</span>
          <button
            id="hero-add-source-btn"
            type="button"
            onClick={onOpenAddSource}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addCustomSite}</span>
          </button>
        </div>
      </div>

      {/* Recent Searches (if user has any) or Quick Guide Link */}
      {(recentSearches.length > 0 || onOpenWelcomeTour) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {recentSearches.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                {t.recentSearches}:
              </span>
              {recentSearches.slice(0, 4).map((rs, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectRecentSearch(rs)}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-orange-50 dark:bg-[#1a1512] text-[#C03000] dark:text-[#FF9575] hover:bg-orange-100 dark:hover:bg-[#281d17] border border-orange-200 dark:border-[#4d261a] transition-colors font-medium font-mono cursor-pointer"
                >
                  {rs}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          {onOpenWelcomeTour && (
            <button
              id="hero-why-pricepulse-guide-btn"
              type="button"
              onClick={onOpenWelcomeTour}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 dark:bg-[#181818] hover:bg-zinc-200 dark:hover:bg-[#222222] text-[#FF3E00] border border-zinc-300 dark:border-[#333333] text-[11px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ml-auto shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.language === 'hi' ? 'एक्सटेंशन से कैसे अलग है?' : 'Why Different from Extensions?'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

