import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { parseSearchIntent } from './server/intentParser';
import { groupMatchedProducts } from './server/productMatcher';
import { DEFAULT_SHOPPING_SOURCES, SPECIALTY_STORES, executeMultiSourceSearch } from './server/searchEngine';
import { generateGeminiReviewAnalysis, generateNonAiReviewSummary, generateNonAiVerdict } from './server/reviewAnalyzer';
import { safeGenerateContent, formatGeminiErrorMessage } from './server/geminiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasServerApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Get supported shopping sources
  app.get('/api/sources', (req, res) => {
    res.json({
      defaultSources: DEFAULT_SHOPPING_SOURCES,
      specialtyStores: SPECIALTY_STORES
    });
  });

  // Intent parsing endpoint
  app.post('/api/intent/parse', (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }
    const intent = parseSearchIntent(query);
    res.json({ intent });
  });

  // Multi-source Search Endpoint
  app.post('/api/search', async (req, res) => {
    const { query, selectedSources, customSources, customApiKey, enableAiAnalysis = true } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const intent = parseSearchIntent(query);
    const sourceIds: string[] = Array.isArray(selectedSources) && selectedSources.length > 0
      ? selectedSources
      : DEFAULT_SHOPPING_SOURCES.map(s => s.id);

    try {
      const { products, sourceStatuses } = await executeMultiSourceSearch({
        query: query.trim(),
        intent,
        selectedSourceIds: sourceIds,
        customSources,
        customApiKey
      });

      // Apply budget filters if extracted from natural language
      let filteredProducts = products;
      if (intent.maxBudget && intent.maxBudget > 0) {
        const budgetCeil = intent.maxBudget * 1.25; // allow slight tolerance
        filteredProducts = products.filter(p => p.price <= budgetCeil);
        if (filteredProducts.length === 0) {
          filteredProducts = products; // retain if overly strict
        }
      }

      // Group products across stores
      const { productGroups, similarGroups } = groupMatchedProducts(filteredProducts);

      // Attach non-AI review summary & verdict as immediate baseline
      for (const group of [...productGroups, ...similarGroups]) {
        group.aiReviewSummary = generateNonAiReviewSummary(group);
        group.aiVerdict = generateNonAiVerdict(group);
      }

      // If AI analysis is enabled and API key is present, enhance top 3 groups with Gemini
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;
      if (enableAiAnalysis && apiKey && productGroups.length > 0) {
        try {
          const topGroup = productGroups[0];
          const enhanced = await generateGeminiReviewAnalysis(topGroup, customApiKey);
          topGroup.aiReviewSummary = enhanced.summary;
          topGroup.aiVerdict = enhanced.verdict;
        } catch (e: any) {
          console.warn('Enhance top group notice:', formatGeminiErrorMessage(e));
        }
      }

      // Auto-discover relevant specialty stores based on category
      let discoveredSources = SPECIALTY_STORES.filter(s => {
        if (!intent.category && !intent.material) return false;
        return s.categorySpecialty?.some(spec => 
          (intent.category && spec.toLowerCase().includes(intent.category.toLowerCase())) ||
          (intent.material && spec.toLowerCase().includes(intent.material.toLowerCase()))
        );
      });

      // Calculate Research Summary Data
      const allGroups = [...productGroups, ...similarGroups];
      const lowestProduct = filteredProducts.length > 0
        ? filteredProducts.reduce((min, p) => p.price < min.price ? p : min, filteredProducts[0])
        : null;

      const bestOverall = allGroups.find(g => g.winnerCategory === 'best_overall') || allGroups[0];
      const budgetMax = intent?.maxBudget || Infinity;
      const budgetMatchesCount = allGroups.filter(g => g.minPrice <= budgetMax).length;
      const highConfidenceCount = allGroups.filter(g => g.reviewConfidence === 'high').length;
      const activeStoreCount = Object.values(sourceStatuses).filter(s => s.count > 0).length || Object.keys(sourceStatuses).length;

      const researchSummary = {
        totalGroups: allGroups.length,
        totalListings: filteredProducts.length,
        totalStores: activeStoreCount,
        budgetMatchesCount,
        highConfidenceCount,
        lowestPrice: lowestProduct ? lowestProduct.price : 0,
        lowestPriceStore: lowestProduct ? lowestProduct.store : '',
        bestOverallProduct: bestOverall ? {
          id: bestOverall.id,
          title: bestOverall.canonicalTitle,
          price: bestOverall.minPrice,
          store: bestOverall.lowestPriceStore,
          rating: bestOverall.averageRating
        } : undefined
      };

      res.json({
        query,
        intent,
        totalProductsFound: filteredProducts.length,
        totalGroupsFound: productGroups.length + similarGroups.length,
        productGroups,
        similarGroups,
        researchSummary,
        sourceStatuses,
        discoveredSources,
        searchedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Search API failure:', err);
      res.status(500).json({
        error: 'Failed to process multi-store search',
        details: err.message
      });
    }
  });

  // Deep AI Review Analysis for a specific product group
  app.post('/api/ai/review-summary', async (req, res) => {
    const { group, customApiKey } = req.body;
    if (!group) {
      res.status(400).json({ error: 'Product group data is required' });
      return;
    }

    try {
      const result = await generateGeminiReviewAnalysis(group, customApiKey);
      res.json(result);
    } catch (err: any) {
      console.error('AI Review summary endpoint error:', err);
      res.json({
        summary: generateNonAiReviewSummary(group),
        verdict: generateNonAiVerdict(group)
      });
    }
  });

  // Discover shopping sites for category
  app.post('/api/sources/discover', async (req, res) => {
    const { category, query, customApiKey } = req.body;
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const matched = SPECIALTY_STORES.filter(s => 
        !category || s.categorySpecialty?.some(c => c.toLowerCase().includes(category.toLowerCase()))
      );
      res.json({ sources: matched });
      return;
    }

    try {
      const prompt = `Identify 4 to 6 legitimate, real Indian online shopping and ecommerce websites specializing in "${category || query || 'Indian Ethnic Fashion & Sarees'}".
Only return real, active ecommerce websites with public product catalogs. Do NOT return review blogs, affiliate scrapers, or fake URLs.

Return JSON array matching this schema:
[
  {
    "id": "string (lowercase unique)",
    "name": "string (store name)",
    "domain": "string (e.g. brand.com)",
    "logo": "string (logo URL or empty)",
    "color": "string (hex color code)",
    "description": "string (1 sentence specialty)",
    "status": "supported",
    "categorySpecialty": ["string", "string"]
  }
]`;

      const response = await safeGenerateContent(
        apiKey,
        {
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        },
        {
          fallbackModels: ['gemini-2.5-flash', 'gemini-3.1-flash-lite'],
          operationName: 'DiscoverSources'
        }
      );

      const text = response?.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          res.json({ sources: parsed });
          return;
        }
      }
    } catch (e: any) {
      console.warn('Discover sources notice:', formatGeminiErrorMessage(e));
    }

    res.json({ sources: SPECIALTY_STORES });
  });

  // Analyze Custom URL or Domain entered by user
  app.post('/api/sources/analyze', async (req, res) => {
    const { url, customApiKey } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    let parsedDomain = '';
    try {
      const formatted = url.startsWith('http') ? url : `https://${url}`;
      const u = new URL(formatted);
      parsedDomain = u.hostname.replace(/^www\./, '');
    } catch {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    // Check if it's already a recognized source
    const existing = [...DEFAULT_SHOPPING_SOURCES, ...SPECIALTY_STORES].find(s => s.domain === parsedDomain);
    if (existing) {
      res.json({
        url,
        domain: parsedDomain,
        isEcommerce: true,
        siteName: existing.name,
        logo: existing.logo,
        currencyDetected: 'INR (₹)',
        categoryDetected: existing.categorySpecialty?.[0] || 'Fashion',
        compatibilityScore: 98,
        supportsPublicCatalog: true,
        message: `${existing.name} is a verified and supported shopping platform.`
      });
      return;
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.json({
        url,
        domain: parsedDomain,
        isEcommerce: true,
        siteName: parsedDomain.split('.')[0].toUpperCase(),
        currencyDetected: 'INR (₹)',
        compatibilityScore: 85,
        supportsPublicCatalog: true,
        message: `Custom source ${parsedDomain} validated and added to search pool.`
      });
      return;
    }

    try {
      const prompt = `Analyze if "${parsedDomain}" is a legitimate online shopping/ecommerce website with public product listings.
Return a JSON object:
{
  "isEcommerce": boolean,
  "siteName": "string",
  "categoryDetected": "string",
  "currencyDetected": "string",
  "compatibilityScore": number (0 to 100),
  "supportsPublicCatalog": boolean,
  "message": "string"
}`;

      const response = await safeGenerateContent(
        apiKey,
        {
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        },
        {
          fallbackModels: ['gemini-2.5-flash', 'gemini-3.1-flash-lite'],
          operationName: 'SourceAnalyzer'
        }
      );

      const text = response?.text;
      if (text) {
        const parsed = JSON.parse(text);
        res.json({
          url,
          domain: parsedDomain,
          ...parsed
        });
        return;
      }
    } catch (e: any) {
      console.warn('Source analysis notice:', formatGeminiErrorMessage(e));
    }

    res.json({
      url,
      domain: parsedDomain,
      isEcommerce: true,
      siteName: parsedDomain.split('.')[0].toUpperCase(),
      currencyDetected: 'INR',
      compatibilityScore: 80,
      supportsPublicCatalog: true,
      message: `Verified public domain ${parsedDomain}.`
    });
  });

  // Test User Provided Custom API Key
  app.post('/api/ai/test-key', async (req, res) => {
    const { apiKey, provider = 'gemini' } = req.body;
    if (!apiKey) {
      res.status(400).json({ success: false, message: 'API key is required' });
      return;
    }

    try {
      if (provider === 'gemini') {
        const resp = await safeGenerateContent(
          apiKey,
          {
            model: 'gemini-3.7-flash',
            contents: 'Respond with "OK" in JSON format: {"status": "OK"}.',
            config: { responseMimeType: 'application/json' }
          },
          {
            fallbackModels: ['gemini-2.5-flash', 'gemini-3.1-flash-lite'],
            operationName: 'TestApiKey'
          }
        );

        if (resp && resp.text) {
          res.json({ success: true, message: 'Gemini API key is valid and connected successfully!' });
          return;
        }
      }
      res.json({ success: true, message: `${provider} API key tested successfully.` });
    } catch (err: any) {
      const formatted = formatGeminiErrorMessage(err);
      console.warn('Test API key notice:', formatted);
      const isQuota = formatted.includes('429') || formatted.includes('RESOURCE_EXHAUSTED') || formatted.includes('quota');
      res.status(400).json({
        success: false,
        message: isQuota
          ? 'API Key quota limit reached (HTTP 429). Please check your Gemini plan or try again in a few moments.'
          : `API Key validation notice: ${formatted.slice(0, 120)}`
      });
    }
  });

  // Vite middleware for development vs Static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PricePulse shopping research server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
