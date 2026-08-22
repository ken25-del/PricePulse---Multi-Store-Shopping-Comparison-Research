import { AppSettings, ProductGroup, ShoppingSource } from '../types';

const WISHLIST_KEY = 'pricepulse_wishlist_v1';
const RECENT_SEARCHES_KEY = 'pricepulse_recent_searches_v1';
const SETTINGS_KEY = 'pricepulse_settings_v1';
const CUSTOM_SOURCES_KEY = 'pricepulse_custom_sources_v1';
const SAVED_COMPARISONS_KEY = 'pricepulse_saved_comparisons_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  currency: 'INR',
  theme: 'dark',
  aiEnabled: true,
  aiProvider: 'gemini',
  selectedSources: ['amazon', 'flipkart', 'myntra', 'meesho', 'ajio', 'nykaa', 'tatacliq'],
  autoDiscoverSources: true,
  showReviewExcerpts: true
};

export function getWishlist(): ProductGroup[] {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToWishlist(product: ProductGroup): boolean {
  try {
    const list = getWishlist();
    const exists = list.some(item => item.id === product.id);
    if (!exists) {
      list.unshift(product);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function removeFromWishlist(productId: string): boolean {
  try {
    const list = getWishlist();
    const updated = list.filter(item => item.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function isWishlisted(productId: string): boolean {
  const list = getWishlist();
  return list.some(item => item.id === productId);
}

export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string) {
  if (!query || !query.trim()) return;
  try {
    const trimmed = query.trim();
    let list = getRecentSearches().filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    list.unshift(trimmed);
    list = list.slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving recent search:', e);
  }
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function getCustomSources(): ShoppingSource[] {
  try {
    const data = localStorage.getItem(CUSTOM_SOURCES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addCustomSource(source: ShoppingSource) {
  try {
    const list = getCustomSources().filter(s => s.id !== source.id);
    list.push(source);
    localStorage.setItem(CUSTOM_SOURCES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving custom source:', e);
  }
}

export function removeCustomSource(sourceId: string) {
  try {
    const list = getCustomSources().filter(s => s.id !== sourceId);
    localStorage.setItem(CUSTOM_SOURCES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error removing custom source:', e);
  }
}

export function clearAllLocalData() {
  localStorage.removeItem(WISHLIST_KEY);
  localStorage.removeItem(RECENT_SEARCHES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(CUSTOM_SOURCES_KEY);
  localStorage.removeItem(SAVED_COMPARISONS_KEY);
}
