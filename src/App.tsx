import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingSource,
  ProductGroup,
  FilterState,
  AppSettings,
  SearchResponse,
  SearchIntent,
  SourceStatus,
  ResearchSummary,
  UserPriority,
  TrackedPriceItem,
  NormalizedProduct
} from './types';
import {
  getSettings,
  saveSettings,
  getWishlist,
  saveToWishlist,
  removeFromWishlist,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getCustomSources,
  addCustomSource,
  removeCustomSource,
  clearAllLocalData,
  getTrackedPrices,
  trackProductPrice,
  removeTrackedPrice,
  clearTrackedPrices,
  checkPriceDropsOnAppLoad,
  dismissPriceDropAlert,
  updateTrackedPriceTarget
} from './lib/storage';
import { translations } from './lib/i18n';

// Components
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { SourceStatusLive } from './components/SourceStatusLive';
import { IntentBadgeBar } from './components/IntentBadgeBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SideBySideCompareModal } from './components/SideBySideCompareModal';
import { WishlistModal } from './components/WishlistModal';
import { PriceWatchModal } from './components/PriceWatchModal';
import { SettingsModal } from './components/SettingsModal';
import { SourceSelectorModal } from './components/SourceSelectorModal';
import { AddSourceModal } from './components/AddSourceModal';
import { SiteDiscoveryModal } from './components/SiteDiscoveryModal';
import { ResearchSummaryBanner } from './components/ResearchSummaryBanner';
import { UserPrioritySelector } from './components/UserPrioritySelector';
import { ResearchRefinementChips } from './components/ResearchRefinementChips';
import { QuickDecisionView } from './components/QuickDecisionView';

import {
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Sparkles,
  WifiOff,
  AlertCircle,
  PackageSearch,
  Scale,
  Bell,
  BellRing,
  TrendingDown,
  X
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 25000,
  minRating: 0,
  minReviews: 0,
  selectedStores: [],
  materials: [],
  colors: [],
  occasions: [],
  inStockOnly: false,
  returnAvailableOnly: false,
  discountOnly: false,
  sortBy: 'relevance',
  userPriority: 'balanced'
};

export default function App() {
  // App Settings & State
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [allSources, setAllSources] = useState<ShoppingSource[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(settings.selectedSources);
  const [customSources, setCustomSources] = useState<ShoppingSource[]>(getCustomSources());

  // Search State
  const [currentQuery, setCurrentQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);
  const [researchSummary, setResearchSummary] = useState<ResearchSummary | null>(null);
  const [sourceStatuses, setSourceStatuses] = useState<Record<string, { status: SourceStatus; count: number; latencyMs: number; error?: string; storeName: string }>>({});
  const [exactGroups, setExactGroups] = useState<ProductGroup[]>([]);
  const [similarGroups, setSimilarGroups] = useState<ProductGroup[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Filters & Sorting
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Wishlist & Compare State
  const [wishlist, setWishlist] = useState<ProductGroup[]>(getWishlist());
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());

  // Price Watch & Drop Alerts State
  const [trackedPrices, setTrackedPrices] = useState<TrackedPriceItem[]>(getTrackedPrices());
  const [priceDropAlerts, setPriceDropAlerts] = useState<TrackedPriceItem[]>([]);
  const [showPriceDropBanner, setShowPriceDropBanner] = useState(false);

  // Modals
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductGroup | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isPriceWatchOpen, setIsPriceWatchOpen] = useState(false);
  const [isQuickDecisionOpen, setIsQuickDecisionOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  // Network State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // AbortController Ref for search cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const t = translations[settings.language];

  // Price Drop Check on App Load
  useEffect(() => {
    try {
      const { allTracked, droppedAlerts } = checkPriceDropsOnAppLoad();
      setTrackedPrices(allTracked);
      if (droppedAlerts && droppedAlerts.length > 0) {
        setPriceDropAlerts(droppedAlerts);
        setShowPriceDropBanner(true);
      }
    } catch (err) {
      console.error('Error checking price drops on app load:', err);
    }
  }, []);

  // Fetch initial sources from API
  useEffect(() => {
    async function loadSources() {
      try {
        const res = await fetch('/api/sources');
        const data = await res.json();
        const combined = [...(data.defaultSources || []), ...(data.specialtyStores || []), ...customSources];
        setAllSources(combined);
      } catch (err) {
        console.error('Failed to load shopping sources:', err);
      }
    }
    loadSources();
  }, [customSources]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme
  useEffect(() => {
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Settings update handler
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
    if (newSettings.selectedSources) {
      setSelectedSourceIds(newSettings.selectedSources);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: nextTheme });
  };

  const handleToggleLanguage = () => {
    const nextLang = settings.language === 'en' ? 'hi' : 'en';
    handleUpdateSettings({ language: nextLang });
  };

  // Perform Real Multi-Source Search
  const handlePerformSearch = async (queryText: string) => {
    if (!queryText.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCurrentQuery(queryText);
    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);

    // Add to recent searches
    addRecentSearch(queryText);
    setRecentSearches(getRecentSearches());

    // Initial searching status for selected sources
    const initialStatuses: Record<string, { status: SourceStatus; count: number; latencyMs: number; error?: string; storeName: string }> = {};
    selectedSourceIds.forEach(sId => {
      const src = allSources.find(s => s.id === sId);
      initialStatuses[sId] = {
        status: 'searching',
        count: 0,
        latencyMs: 0,
        storeName: src?.name || sId
      };
    });
    setSourceStatuses(initialStatuses);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          query: queryText,
          selectedSources: selectedSourceIds,
          customSources,
          customApiKey: settings.customApiKey,
          enableAiAnalysis: settings.aiEnabled,
          userPriority: filters.userPriority
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${res.status}`);
      }

      const data: SearchResponse = await res.json();
      setSearchIntent(data.intent);
      setExactGroups(data.productGroups || []);
      setSimilarGroups(data.similarGroups || []);
      setTotalFound(data.totalProductsFound || 0);
      setSourceStatuses(data.sourceStatuses || {});
      setResearchSummary(data.researchSummary || null);

      // If intent extracted budget, adjust default filter max
      if (data.intent?.maxBudget) {
        setFilters(prev => ({ ...prev, maxPrice: data.intent.maxBudget! * 1.2 }));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Search cancelled by user');
      } else {
        console.error('Search execution error:', err);
        setSearchError(err.message || 'An error occurred while querying shopping sources.');
      }
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSearching(false);
  };

  // Wishlist handlers
  const handleToggleWishlist = (product: ProductGroup) => {
    const isSaved = wishlist.some(item => item.id === product.id);
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      saveToWishlist(product);
    }
    setWishlist(getWishlist());
  };

  const handleRemoveWishlistItem = (id: string) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  const handleClearWishlist = () => {
    wishlist.forEach(item => removeFromWishlist(item.id));
    setWishlist([]);
  };

  const handleImportWishlist = (items: ProductGroup[]) => {
    items.forEach(item => saveToWishlist(item));
    setWishlist(getWishlist());
  };

  // Price Tracking handlers
  const handleTogglePriceTrack = (product: ProductGroup, listing?: NormalizedProduct) => {
    const targetListing = listing || product.listings.find(l => l.price === product.minPrice) || product.listings[0];
    
    // Check if this specific product/store listing is already tracked
    const existingIndex = trackedPrices.findIndex(
      item => item.productId === product.id && (targetListing ? item.storeId === targetListing.storeId : true)
    );

    if (existingIndex >= 0) {
      // Remove from price watch
      const itemToRemove = trackedPrices[existingIndex];
      removeTrackedPrice(itemToRemove.id);
      setTrackedPrices(getTrackedPrices());
      setPriceDropAlerts(prev => prev.filter(a => a.id !== itemToRemove.id));
    } else {
      // Add to price watch
      trackProductPrice(product, targetListing);
      setTrackedPrices(getTrackedPrices());
    }
  };

  const isGroupPriceTracked = (groupId: string): boolean => {
    return trackedPrices.some(item => item.productId === groupId);
  };

  const isListingTracked = (storeId: string): boolean => {
    return trackedPrices.some(item => item.storeId === storeId);
  };

  const handleRemoveTrackedPrice = (id: string) => {
    removeTrackedPrice(id);
    setTrackedPrices(getTrackedPrices());
    setPriceDropAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleDismissPriceDropAlert = (id: string) => {
    dismissPriceDropAlert(id);
    setTrackedPrices(getTrackedPrices());
    setPriceDropAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateTargetPrice = (id: string, targetPrice?: number) => {
    updateTrackedPriceTarget(id, targetPrice);
    setTrackedPrices(getTrackedPrices());
  };

  const handleClearAllTrackedPrices = () => {
    clearTrackedPrices();
    setTrackedPrices([]);
    setPriceDropAlerts([]);
    setShowPriceDropBanner(false);
  };

  // Compare Tray handlers
  const handleToggleCompare = (productId: string) => {
    if (compareProductIds.includes(productId)) {
      setCompareProductIds(compareProductIds.filter(id => id !== productId));
    } else {
      if (compareProductIds.length >= 4) {
        alert('You can compare a maximum of 4 products side-by-side.');
        return;
      }
      setCompareProductIds([...compareProductIds, productId]);
    }
  };

  const allComparedProducts = useMemo(() => {
    const all = [...exactGroups, ...similarGroups, ...wishlist];
    return compareProductIds
      .map(id => all.find(p => p.id === id))
      .filter((p): p is ProductGroup => Boolean(p));
  }, [compareProductIds, exactGroups, similarGroups, wishlist]);

  // Dynamic filter attributes available in search results
  const allAvailableMaterials = useMemo(() => {
    const set = new Set<string>();
    [...exactGroups, ...similarGroups].forEach(g => {
      if (g.material) set.add(g.material);
    });
    return Array.from(set);
  }, [exactGroups, similarGroups]);

  const allAvailableColors = useMemo(() => {
    const set = new Set<string>();
    [...exactGroups, ...similarGroups].forEach(g => {
      if (g.color) set.add(g.color);
    });
    return Array.from(set);
  }, [exactGroups, similarGroups]);

  // Filter & Sort Logic
  const applyFiltersAndSort = (groups: ProductGroup[]) => {
    let result = [...groups];

    // Price
    result = result.filter(g => g.minPrice <= filters.maxPrice);

    // Rating
    if (filters.minRating > 0) {
      result = result.filter(g => g.averageRating >= filters.minRating);
    }

    // Reviews count
    if (filters.minReviews > 0) {
      result = result.filter(g => g.totalReviews >= filters.minReviews);
    }

    // Stores
    if (filters.selectedStores.length > 0) {
      result = result.filter(g =>
        g.listings.some(l => filters.selectedStores.includes(l.store))
      );
    }

    // Materials
    if (filters.materials.length > 0) {
      result = result.filter(g =>
        g.material && filters.materials.some(m => g.material?.toLowerCase().includes(m.toLowerCase()))
      );
    }

    // Colors
    if (filters.colors.length > 0) {
      result = result.filter(g =>
        g.color && filters.colors.some(c => g.color?.toLowerCase().includes(c.toLowerCase()))
      );
    }

    // Return Policy
    if (filters.returnAvailableOnly) {
      result = result.filter(g =>
        g.listings.some(l => l.returnPolicy && !l.returnPolicy.toLowerCase().includes('no return'))
      );
    }

    // In Stock Only
    if (filters.inStockOnly) {
      result = result.filter(g =>
        g.listings.some(l => l.availability === 'in_stock')
      );
    }

    // Discount Only
    if (filters.discountOnly) {
      result = result.filter(g =>
        g.listings.some(l => (l.discountPercent || 0) >= 20)
      );
    }

    // Priority-based sorting or explicit sort
    if (filters.userPriority && filters.userPriority !== 'balanced') {
      if (filters.userPriority === 'cheapest') {
        result.sort((a, b) => a.minPrice - b.minPrice);
      } else if (filters.userPriority === 'highest_rated') {
        result.sort((a, b) => b.averageRating - a.averageRating || b.totalReviews - a.totalReviews);
      } else if (filters.userPriority === 'trusted_stores') {
        result.sort((a, b) => b.listings.length - a.listings.length || (b.reviewConfidence === 'high' ? 1 : -1));
      } else if (filters.userPriority === 'best_value') {
        result.sort((a, b) => b.platformScore - a.platformScore);
      }
    } else {
      // Standard Sort
      switch (filters.sortBy) {
        case 'price_low':
          result.sort((a, b) => a.minPrice - b.minPrice);
          break;
        case 'price_high':
          result.sort((a, b) => b.minPrice - a.minPrice);
          break;
        case 'rating_high':
          result.sort((a, b) => b.averageRating - a.averageRating || b.totalReviews - a.totalReviews);
          break;
        case 'reviews_most':
          result.sort((a, b) => b.totalReviews - a.totalReviews);
          break;
        case 'best_value':
          result.sort((a, b) => b.platformScore - a.platformScore);
          break;
        case 'discount_high':
          result.sort((a, b) => b.savingsPercent - a.savingsPercent);
          break;
        default:
          // relevance / multi-store rich
          break;
      }
    }

    return result;
  };

  const filteredExactGroups = useMemo(() => applyFiltersAndSort(exactGroups), [exactGroups, filters]);
  const filteredSimilarGroups = useMemo(() => applyFiltersAndSort(similarGroups), [similarGroups, filters]);
  const allCurrentGroups = useMemo(() => [...exactGroups, ...similarGroups], [exactGroups, similarGroups]);

  // Initial prompt search run on startup if query provided
  useEffect(() => {
    if (!hasSearched) {
      handlePerformSearch('Teej ke liye ₹2000 ke andar silk saree');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f4f4f4] flex flex-col font-sans transition-colors">
      
      {/* Offline Banner if disconnected */}
      {isOffline && (
        <div className="bg-[#1f1010] border-b border-rose-900 text-rose-400 text-xs font-mono font-bold py-2 px-4 text-center flex items-center justify-center gap-2 uppercase tracking-wider">
          <WifiOff className="w-4 h-4" />
          <span>{t.offlineNotice}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        settings={settings}
        wishlistCount={wishlist.length}
        compareCount={compareProductIds.length}
        priceWatchCount={trackedPrices.length}
        priceDropAlertCount={priceDropAlerts.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenPriceWatch={() => setIsPriceWatchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
        onToggleLanguage={handleToggleLanguage}
        onResetSearch={() => {
          setCurrentQuery('');
          setHasSearched(false);
          setExactGroups([]);
          setSimilarGroups([]);
          setResearchSummary(null);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Price Drop Alert Notification Banner (On App Load) */}
        {showPriceDropBanner && priceDropAlerts.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-black to-[#1a140d] border-2 border-amber-500/70 shadow-xl font-mono text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-400 text-black shrink-0 mt-0.5 shadow-md">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-sm bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                    PRICE DROP DETECTED!
                  </span>
                  <span className="text-xs font-bold text-amber-200">
                    {priceDropAlerts.length} item{priceDropAlerts.length > 1 ? 's' : ''} in your Price Watch {priceDropAlerts.length > 1 ? 'have' : 'has'} dropped in price!
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-300 font-sans">
                  {priceDropAlerts.slice(0, 2).map((alert) => (
                    <span key={alert.id} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 border border-amber-500/30 text-amber-300">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-white truncate max-w-[160px] sm:max-w-[220px]">{alert.canonicalTitle}</strong>
                      <span className="text-emerald-400 font-mono font-bold font-mono-num">
                        ₹{alert.currentPrice.toLocaleString('en-IN')}
                      </span>
                      {alert.priceDropPercent && (
                        <span className="text-[10px] px-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xs">
                          -{alert.priceDropPercent}%
                        </span>
                      )}
                    </span>
                  ))}
                  {priceDropAlerts.length > 2 && (
                    <span className="text-xs text-zinc-400 self-center">
                      +{priceDropAlerts.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsPriceWatchOpen(true)}
                className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                VIEW PRICE WATCH ({priceDropAlerts.length})
              </button>
              <button
                type="button"
                onClick={() => setShowPriceDropBanner(false)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white bg-black/40 hover:bg-black border border-white/10 cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Hero Search Section */}
        <HeroSearch
          settings={settings}
          allSources={allSources}
          selectedSourceIds={selectedSourceIds}
          isSearching={isSearching}
          onSearch={handlePerformSearch}
          onCancelSearch={handleCancelSearch}
          onOpenSourceSelector={() => setIsSourceSelectorOpen(true)}
          onOpenDiscovery={() => setIsDiscoveryOpen(true)}
          onOpenAddSource={() => setIsAddSourceOpen(true)}
          recentSearches={recentSearches}
          onSelectRecentSearch={handlePerformSearch}
          initialQuery={currentQuery}
        />

        {/* Live Search Status Panel */}
        {hasSearched && (
          <SourceStatusLive
            statuses={sourceStatuses}
            isSearching={isSearching}
            totalProductsFound={totalFound}
            totalGroupsFound={exactGroups.length + similarGroups.length}
            onRetry={() => handlePerformSearch(currentQuery)}
          />
        )}

        {/* Extracted Intent Badge Bar */}
        {searchIntent && (
          <IntentBadgeBar
            intent={searchIntent}
            onClearIntentConstraint={(k) => {
              setSearchIntent(prev => prev ? { ...prev, [k]: undefined } : null);
            }}
          />
        )}

        {/* Research Summary Banner (High-Level Shopping Research Insights) */}
        {hasSearched && (
          <div className="mt-4">
            <ResearchSummaryBanner
              summary={researchSummary}
              productGroups={allCurrentGroups}
              onOpenDecisionGuide={() => setIsQuickDecisionOpen(true)}
              onSelectProduct={(p) => setSelectedProductForModal(p)}
            />
          </div>
        )}

        {/* User Priority Selector & Quick Refinements */}
        {hasSearched && allCurrentGroups.length > 0 && (
          <div className="mt-4 space-y-3">
            <UserPrioritySelector
              selectedPriority={filters.userPriority || 'balanced'}
              onChangePriority={(priority: UserPriority) => {
                setFilters(prev => ({ ...prev, userPriority: priority }));
              }}
            />

            <ResearchRefinementChips
              filters={filters}
              onChangeFilters={setFilters}
              availableMaterials={allAvailableMaterials}
              budgetCeiling={searchIntent?.maxBudget}
            />
          </div>
        )}

        {/* Search Results Area */}
        {hasSearched && (
          <div className="mt-4 flex flex-col lg:flex-row gap-6">
            
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                availableStores={allSources.filter(s => selectedSourceIds.includes(s.id))}
                availableMaterials={allAvailableMaterials}
                availableColors={allAvailableColors}
                language={settings.language}
                onReset={() => setFilters(INITIAL_FILTERS)}
              />
            </div>

            {/* Mobile Filter Trigger */}
            <div className="flex lg:hidden items-center justify-between gap-2 pb-2 border-b border-[#242424]">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[#181818] border border-[#303030] text-xs font-mono font-bold text-white uppercase tracking-wider cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#FF3E00]" />
                <span>FILTERS & REFINEMENTS</span>
              </button>

              <div className="flex items-center gap-1 text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="bg-[#121212] border border-[#2e2e2e] text-zinc-300 rounded-xs px-2 py-1 font-bold text-xs uppercase focus:outline-hidden"
                >
                  <option value="relevance">{t.relevance}</option>
                  <option value="price_low">{t.priceLow}</option>
                  <option value="price_high">{t.priceHigh}</option>
                  <option value="rating_high">{t.ratingHigh}</option>
                  <option value="best_value">{t.bestValue}</option>
                  <option value="discount_high">{t.discountHigh}</option>
                </select>
              </div>
            </div>

            {/* Product Comparison Stream */}
            <div className="flex-1 min-w-0 space-y-6">
              
              {/* Sort & Summary Header */}
              <div className="hidden lg:flex items-center justify-between pb-3 border-b border-[#242424] text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase tracking-wider">
                    SHOWING {filteredExactGroups.length + filteredSimilarGroups.length} PRODUCT GROUPS
                  </span>
                  <span className="text-zinc-500">({totalFound} VERIFIED STORE LISTINGS)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">{t.sortBy.toUpperCase()}:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="p-1.5 rounded-sm bg-[#161616] border border-[#303030] font-bold uppercase text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="relevance">{t.relevance}</option>
                    <option value="price_low">{t.priceLow}</option>
                    <option value="price_high">{t.priceHigh}</option>
                    <option value="rating_high">{t.ratingHigh}</option>
                    <option value="reviews_most">{t.reviewsMost}</option>
                    <option value="best_value">{t.bestValue}</option>
                    <option value="discount_high">{t.discountHigh}</option>
                  </select>
                </div>
              </div>

              {/* Error Notification */}
              {searchError && (
                <div className="p-4 rounded-lg bg-[#241212] border border-rose-900 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold uppercase mb-0.5">SEARCH ENCOUNTERED AN ISSUE</strong>
                    <span className="font-sans text-rose-200">{searchError}</span>
                  </div>
                </div>
              )}

              {/* Section 1: Exact / Multi-Store Matches (The Core Experience) */}
              {filteredExactGroups.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                    <h2 className="text-sm sm:text-base font-mono font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>
                      <span>{t.exactMatch.toUpperCase()} ({filteredExactGroups.length})</span>
                    </h2>
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline uppercase">
                      CROSS-STORE CATALOG MATCHES
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredExactGroups.map((group) => (
                      <ProductCard
                        key={group.id}
                        productGroup={group}
                        language={settings.language}
                        isWishlisted={wishlist.some(w => w.id === group.id)}
                        isSelectedForCompare={compareProductIds.includes(group.id)}
                        isPriceTracked={isGroupPriceTracked(group.id)}
                        isListingTracked={isListingTracked}
                        onToggleWishlist={() => handleToggleWishlist(group)}
                        onToggleCompare={() => handleToggleCompare(group.id)}
                        onTogglePriceTrack={(listing) => handleTogglePriceTrack(group, listing)}
                        onViewDetails={() => setSelectedProductForModal(group)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Similar Products */}
              {filteredSimilarGroups.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                    <h2 className="text-sm sm:text-base font-mono font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#FF3E00] inline-block"></span>
                      <span>{t.similarProducts.toUpperCase()} ({filteredSimilarGroups.length})</span>
                    </h2>
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline uppercase">
                      CATEGORY & BUDGET ALTERNATIVES
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredSimilarGroups.map((group) => (
                      <ProductCard
                        key={group.id}
                        productGroup={group}
                        language={settings.language}
                        isWishlisted={wishlist.some(w => w.id === group.id)}
                        isSelectedForCompare={compareProductIds.includes(group.id)}
                        isPriceTracked={isGroupPriceTracked(group.id)}
                        isListingTracked={isListingTracked}
                        onToggleWishlist={() => handleToggleWishlist(group)}
                        onToggleCompare={() => handleToggleCompare(group.id)}
                        onTogglePriceTrack={(listing) => handleTogglePriceTrack(group, listing)}
                        onViewDetails={() => setSelectedProductForModal(group)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty Results State */}
              {!isSearching && filteredExactGroups.length === 0 && filteredSimilarGroups.length === 0 && (
                <div className="py-16 text-center bg-[#121212] rounded-xl border border-[#262626] p-8 shadow-sm font-mono">
                  <PackageSearch className="w-14 h-14 mx-auto text-zinc-500 mb-3 stroke-[1.2]" />
                  <h3 className="font-bold text-base uppercase tracking-wider text-white">
                    {t.noResultsFound.toUpperCase()}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto font-sans">
                    {t.tryAdjustingFilters}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilters(INITIAL_FILTERS)}
                      className="px-4 py-2 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      RESET ALL FILTERS
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSourceSelectorOpen(true)}
                      className="px-4 py-2 rounded-sm bg-[#1e1e1e] hover:bg-[#282828] border border-[#333333] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      SELECT MORE STORES
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Welcome Empty State on Fresh Load */}
        {!hasSearched && (
          <div className="py-16 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-xl bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/30 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-black tracking-tight text-white uppercase">
              Shopping Research & Price Intelligence
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Search in English, Hindi, or Hinglish to inspect verified cross-store prices, review analysis, buyer sentiment, and instant decision recommendations across Amazon, Flipkart, Myntra, Meesho, and Ajio.
            </p>
          </div>
        )}

      </main>

      {/* Floating Compare Tray if items selected */}
      {compareProductIds.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 bg-[#121212] text-white rounded-xl p-3.5 shadow-2xl border border-[#FF3E00] flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-mono">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-[#FF3E00]" />
            <span>{compareProductIds.length} ITEMS SELECTED</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="px-3.5 py-1.5 rounded-sm bg-[#FF3E00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#E03600] cursor-pointer"
          >
            COMPARE NOW
          </button>
          <button
            type="button"
            onClick={() => setCompareProductIds([])}
            className="p-1 rounded-xs text-zinc-400 hover:text-white cursor-pointer"
            title="Clear"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mobile Filter Slide-Over */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-80 h-full bg-[#0d0d0d] border-l border-[#262626] p-5 overflow-y-auto shadow-2xl flex flex-col justify-between font-mono">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#242424] mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">FILTERS & REFINEMENTS</h3>
                <button type="button" onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                availableStores={allSources.filter(s => selectedSourceIds.includes(s.id))}
                availableMaterials={allAvailableMaterials}
                availableColors={allAvailableColors}
                language={settings.language}
                onReset={() => setFilters(INITIAL_FILTERS)}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-4 py-2.5 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}

      {/* Quick Decision Guide Modal ("Help Me Decide") */}
      {isQuickDecisionOpen && (
        <QuickDecisionView
          productGroups={allCurrentGroups}
          onSelectProduct={(product) => setSelectedProductForModal(product)}
          onClose={() => setIsQuickDecisionOpen(false)}
        />
      )}

      {/* Product Detail & Comparison Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          productGroup={selectedProductForModal}
          settings={settings}
          isWishlisted={wishlist.some(w => w.id === selectedProductForModal.id)}
          isSelectedForCompare={compareProductIds.includes(selectedProductForModal.id)}
          isPriceTracked={isGroupPriceTracked(selectedProductForModal.id)}
          isListingTracked={isListingTracked}
          onToggleWishlist={() => handleToggleWishlist(selectedProductForModal)}
          onToggleCompare={() => handleToggleCompare(selectedProductForModal.id)}
          onTogglePriceTrack={(listing) => handleTogglePriceTrack(selectedProductForModal, listing)}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      {/* Price Watch Modal */}
      {isPriceWatchOpen && (
        <PriceWatchModal
          items={trackedPrices}
          settings={settings}
          onRemoveItem={handleRemoveTrackedPrice}
          onDismissAlert={handleDismissPriceDropAlert}
          onUpdateTargetPrice={handleUpdateTargetPrice}
          onClearAll={handleClearAllTrackedPrices}
          onClose={() => setIsPriceWatchOpen(false)}
        />
      )}

      {/* Side by Side Compare Modal */}
      {isCompareOpen && (
        <SideBySideCompareModal
          products={allComparedProducts}
          settings={settings}
          onRemoveProduct={(id) => setCompareProductIds(compareProductIds.filter(pId => pId !== id))}
          onClearAll={() => setCompareProductIds([])}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* Wishlist Modal */}
      {isWishlistOpen && (
        <WishlistModal
          wishlist={wishlist}
          settings={settings}
          onRemoveItem={handleRemoveWishlistItem}
          onClearWishlist={handleClearWishlist}
          onViewProduct={(p) => setSelectedProductForModal(p)}
          onImportWishlist={handleImportWishlist}
          onClose={() => setIsWishlistOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          customSources={customSources}
          onRemoveCustomSource={(id) => {
            removeCustomSource(id);
            setCustomSources(getCustomSources());
          }}
          onClearHistory={() => {
            clearRecentSearches();
            setRecentSearches([]);
          }}
          onClearWishlist={handleClearWishlist}
          onClearAllData={() => {
            clearAllLocalData();
            setWishlist([]);
            setRecentSearches([]);
            setCustomSources([]);
            setSettings(getSettings());
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Source Selector Modal */}
      {isSourceSelectorOpen && (
        <SourceSelectorModal
          allSources={allSources}
          selectedSourceIds={selectedSourceIds}
          settings={settings}
          onUpdateSelectedSources={(ids) => {
            setSelectedSourceIds(ids);
            handleUpdateSettings({ selectedSources: ids });
          }}
          onClose={() => setIsSourceSelectorOpen(false)}
        />
      )}

      {/* Add Custom Source Modal */}
      {isAddSourceOpen && (
        <AddSourceModal
          settings={settings}
          onAddSource={(newSource) => {
            addCustomSource(newSource);
            setCustomSources(getCustomSources());
            if (!selectedSourceIds.includes(newSource.id)) {
              const updated = [...selectedSourceIds, newSource.id];
              setSelectedSourceIds(updated);
              handleUpdateSettings({ selectedSources: updated });
            }
          }}
          onClose={() => setIsAddSourceOpen(false)}
        />
      )}

      {/* Site Discovery Modal */}
      {isDiscoveryOpen && (
        <SiteDiscoveryModal
          settings={settings}
          currentCategory={searchIntent?.category || 'Ethnic Wear & Sarees'}
          onAddAndEnableSource={(site) => {
            if (!selectedSourceIds.includes(site.id)) {
              const updated = [...selectedSourceIds, site.id];
              setSelectedSourceIds(updated);
              handleUpdateSettings({ selectedSources: updated });
            }
          }}
          enabledSourceIds={selectedSourceIds}
          onClose={() => setIsDiscoveryOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-[#242424] bg-[#090909] py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-bold text-white tracking-wider uppercase">PRICEPULSE</span>
            <span>•</span>
            <span className="text-zinc-400">INDEPENDENT MULTI-STORE SHOPPING RESEARCH ENGINE</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500">{t.disclaimer}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
