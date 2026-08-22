export type SourceStatus = 'supported' | 'available' | 'limited' | 'unavailable' | 'unsupported' | 'custom' | 'searching' | 'error';

export type ResearchWinnerType = 
  | 'best_overall' 
  | 'best_price' 
  | 'best_rated' 
  | 'most_reviewed' 
  | 'best_value' 
  | 'best_store_option';

export type UserPriority = 
  | 'balanced' 
  | 'lowest_price' 
  | 'quality' 
  | 'reviews' 
  | 'brand' 
  | 'fast_delivery' 
  | 'easy_return' 
  | 'overall_value';

export type CustomerSentimentType = 'positive' | 'mixed' | 'negative' | 'insufficient_data';
export type ReviewConfidenceType = 'high' | 'medium' | 'low';

export interface ShoppingSource {
  id: string;
  name: string;
  domain: string;
  logo: string;
  color: string;
  description: string;
  status: SourceStatus;
  enabled: boolean;
  isCustom?: boolean;
  categorySpecialty?: string[];
  productCountFound?: number;
  lastChecked?: string;
  errorMessage?: string;
  latencyMs?: number;
}

export interface ReviewExcerpt {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  store: string;
  rating?: number;
  date?: string;
  verified?: boolean;
  topic?: string;
}

export interface SourceReviewBreakdown {
  store: string;
  rating: number;
  reviewCount: number;
}

export interface PriceVsQualitySignal {
  priceLevel: number;
  qualitySignals: 'Strong' | 'Moderate' | 'Basic';
  reviewConfidence: 'High' | 'Medium' | 'Low';
  valueRating: 'Excellent' | 'Good' | 'Fair';
}

export interface NormalizedProduct {
  id: string;
  canonicalId: string;
  title: string;
  store: string;
  storeId: string;
  storeLogo: string;
  productUrl: string;
  brand?: string;
  seller?: string;
  primaryImage: string;
  galleryImages?: string[];
  description?: string;
  category?: string;
  material?: string;
  color?: string;
  size?: string;
  pattern?: string;
  occasion?: string;
  price: number;
  mrp?: number;
  discountPercent?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  reviewHighlights?: string[];
  reviewExcerpts?: ReviewExcerpt[];
  returnPolicy?: string;
  deliveryInfo?: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock' | 'unknown';
  timestamp: string;
  matchConfidence: number; // 0 to 1
  isBestPrice?: boolean;
  isBestRated?: boolean;
}

export interface AIReviewSummary {
  overallSentiment: 'positive' | 'mixed' | 'negative' | 'neutral';
  scoreOutOf10?: number;
  whatBuyersLike: string[];
  commonConcerns: string[];
  recurringComplaints?: string[];
  suitabilityForPurpose?: string;
  fabricQualityNotes?: string;
  valueVerdict: string;
  evidenceBased: boolean;
}

export interface AIVerdict {
  status: 'recommended' | 'consider' | 'not_recommended' | 'insufficient_data';
  headline: string;
  reason: string;
  pros: string[];
  cons: string[];
  riskAlerts: string[];
}

export interface ProductGroup {
  id: string;
  canonicalTitle: string;
  brand?: string;
  primaryImage: string;
  galleryImages: string[];
  material?: string;
  color?: string;
  category?: string;
  occasion?: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  priceDifference: number;
  savingsPercent: number;
  lowestPriceStore: string;
  highestPriceStore: string;
  averageRating: number;
  totalReviews: number;
  highestRatedStore: string;
  mostReviewedStore: string;
  listings: NormalizedProduct[];
  matchType: 'exact' | 'likely' | 'similar';
  badges: string[];
  platformScore: number;
  
  // Research Layer Additions
  winnerCategory?: ResearchWinnerType;
  whyRecommended?: string;
  thingsToConsider?: string;
  productStrengths?: string[];
  productWeaknesses?: string[];
  positiveThemes?: string[];
  negativeThemes?: string[];
  sentiment?: CustomerSentimentType;
  reviewConfidence?: ReviewConfidenceType;
  whyNotCheapestExplanation?: string;
  priceVsQuality?: PriceVsQualitySignal;
  sourceReviewBreakdown?: SourceReviewBreakdown[];
  savedAtTimestamp?: string;

  aiReviewSummary?: AIReviewSummary;
  aiVerdict?: AIVerdict;
  lastUpdated: string;
}

export interface SearchIntent {
  rawQuery: string;
  extractedKeywords: string;
  category?: string;
  material?: string;
  color?: string;
  minBudget?: number;
  maxBudget?: number;
  occasion?: string;
  ratingThreshold?: number;
  returnRequired?: boolean;
  deliveryPreference?: string;
  brand?: string;
  languageDetected?: 'en' | 'hi' | 'hinglish';
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minReviews: number;
  selectedStores: string[];
  materials: string[];
  colors: string[];
  occasions: string[];
  inStockOnly: boolean;
  returnAvailableOnly: boolean;
  discountOnly: boolean;
  userPriority?: UserPriority;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating_high' | 'reviews_most' | 'best_value' | 'discount_high';
}

export interface AppSettings {
  language: 'en' | 'hi';
  currency: 'INR' | 'USD' | 'EUR';
  theme: 'light' | 'dark' | 'system';
  aiEnabled: boolean;
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  customApiKey?: string;
  selectedSources: string[];
  autoDiscoverSources: boolean;
  showReviewExcerpts: boolean;
  deepResearchMode?: boolean;
}

export interface ResearchSummaryData {
  totalGroups: number;
  totalListings: number;
  totalStores: number;
  budgetMatchesCount: number;
  highConfidenceCount: number;
  lowestPrice: number;
  lowestPriceStore: string;
  bestOverallProduct?: {
    id: string;
    title: string;
    price: number;
    store: string;
    rating: number;
  };
}

export type ResearchSummary = ResearchSummaryData;

export interface SearchResponse {
  query: string;
  intent: SearchIntent;
  totalProductsFound: number;
  totalGroupsFound: number;
  productGroups: ProductGroup[];
  similarGroups: ProductGroup[];
  researchSummary?: ResearchSummaryData;
  sourceStatuses: Record<string, {
    status: SourceStatus;
    count: number;
    latencyMs: number;
    error?: string;
    storeName: string;
  }>;
  discoveredSources?: ShoppingSource[];
  searchedAt: string;
}

export interface WebsiteAnalysisResult {
  url: string;
  domain: string;
  isEcommerce: boolean;
  siteName: string;
  logo?: string;
  currencyDetected?: string;
  categoryDetected?: string;
  compatibilityScore: number;
  supportsPublicCatalog: boolean;
  message: string;
  sampleProductsFound?: number;
}

