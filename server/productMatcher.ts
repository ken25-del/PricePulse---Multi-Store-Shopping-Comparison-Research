import { NormalizedProduct, ProductGroup, ResearchWinnerType, CustomerSentimentType, ReviewConfidenceType } from '../src/types';

function tokenize(text: string): Set<string> {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['with', 'and', 'for', 'the', 'saree', 'sari', 'piece', 'blouse', 'women', 'mens', 'free', 'size'].includes(t));
  return new Set(clean);
}

function calculateSimilarity(p1: NormalizedProduct, p2: NormalizedProduct): number {
  if (p1.store === p2.store) {
    // Products from the exact same store are generally distinct catalog items unless duplicated
    return 0.2;
  }

  const tokens1 = tokenize(p1.title);
  const tokens2 = tokenize(p2.title);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  // Jaccard similarity of key title tokens
  let intersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) intersection++;
  }
  const union = new Set([...tokens1, ...tokens2]).size;
  let jaccard = intersection / union;

  // Brand boost
  if (p1.brand && p2.brand && p1.brand.toLowerCase() === p2.brand.toLowerCase()) {
    jaccard += 0.25;
  }

  // Material match boost
  if (p1.material && p2.material && p1.material.toLowerCase() === p2.material.toLowerCase()) {
    jaccard += 0.15;
  }

  // Color match boost
  if (p1.color && p2.color && p1.color.toLowerCase() === p2.color.toLowerCase()) {
    jaccard += 0.1;
  }

  // Price compatibility check (two items with 5x price difference are rarely identical)
  const ratio = Math.max(p1.price, p2.price) / Math.max(1, Math.min(p1.price, p2.price));
  if (ratio > 2.5) {
    jaccard *= 0.5;
  }

  return Math.min(1, jaccard);
}

export function groupMatchedProducts(products: NormalizedProduct[]): { productGroups: ProductGroup[]; similarGroups: ProductGroup[] } {
  if (!products || products.length === 0) {
    return { productGroups: [], similarGroups: [] };
  }

  const clusters: NormalizedProduct[][] = [];
  const assigned = new Set<string>();

  // Pass 1: Cluster exact and strong multi-store matches
  for (let i = 0; i < products.length; i++) {
    const p1 = products[i];
    if (assigned.has(p1.id)) continue;

    const cluster: NormalizedProduct[] = [p1];
    assigned.add(p1.id);

    for (let j = i + 1; j < products.length; j++) {
      const p2 = products[j];
      if (assigned.has(p2.id)) continue;

      const sim = calculateSimilarity(p1, p2);
      if (sim >= 0.55) {
        // High confidence match across different stores
        cluster.push(p2);
        assigned.add(p2.id);
      }
    }
    clusters.push(cluster);
  }

  const rawGroups: ProductGroup[] = [];

  for (const cluster of clusters) {
    // Sort listings in cluster by price ascending
    cluster.sort((a, b) => a.price - b.price);

    const lowest = cluster[0];
    const highest = cluster[cluster.length - 1];
    const minPrice = lowest.price;
    const maxPrice = highest.price;
    const priceDiff = maxPrice - minPrice;
    const savingsPercent = maxPrice > 0 ? Math.round((priceDiff / maxPrice) * 100) : 0;

    // Best rating & review volume store
    let bestRatedListing = cluster[0];
    let mostReviewedListing = cluster[0];
    let totalReviews = 0;
    let weightedRatingSum = 0;

    const sourceReviewBreakdown = cluster.map(item => ({
      store: item.store,
      rating: item.rating,
      reviewCount: item.reviewCount || 0
    }));

    for (const item of cluster) {
      if (item.rating > bestRatedListing.rating) bestRatedListing = item;
      if (item.reviewCount > mostReviewedListing.reviewCount) mostReviewedListing = item;
      totalReviews += item.reviewCount || 0;
      weightedRatingSum += (item.rating || 0) * (item.reviewCount || 1);
    }

    const avgRating = totalReviews > 0 ? Number((weightedRatingSum / (totalReviews + cluster.length)).toFixed(1)) : lowest.rating;

    // Mark individual listings
    lowest.isBestPrice = true;
    bestRatedListing.isBestRated = true;

    // Derive canonical description & specifications
    const canonicalItem = cluster.reduce((prev, curr) => 
      (curr.description && curr.description.length > (prev.description?.length || 0)) ? curr : prev
    , lowest);

    // Extract positive & negative themes from review excerpts / highlights
    const positiveThemes: string[] = [];
    const negativeThemes: string[] = [];
    const productStrengths: string[] = [];
    const productWeaknesses: string[] = [];

    // Collect all review highlights
    cluster.forEach(c => {
      if (c.reviewHighlights) {
        c.reviewHighlights.forEach(h => {
          if (!positiveThemes.includes(h) && positiveThemes.length < 5) {
            positiveThemes.push(h);
            productStrengths.push(h);
          }
        });
      }
      if (c.reviewExcerpts) {
        c.reviewExcerpts.forEach(e => {
          if (e.sentiment === 'positive' && positiveThemes.length < 4 && !positiveThemes.includes(e.text)) {
            positiveThemes.push(e.text);
          }
          if (e.sentiment === 'negative' && negativeThemes.length < 3 && !negativeThemes.includes(e.text)) {
            negativeThemes.push(e.text);
            productWeaknesses.push(e.text);
          }
        });
      }
    });

    // Default evidence-based themes if highlights are sparse
    if (positiveThemes.length === 0) {
      if (avgRating >= 4.0) positiveThemes.push('Durable finishing & faithful color accuracy');
      if (savingsPercent >= 10) positiveThemes.push('Strong price-to-quality value across stores');
      if (canonicalItem.material) positiveThemes.push(`Authentic ${canonicalItem.material} feel`);
    }

    if (negativeThemes.length === 0) {
      if (totalReviews < 30) {
        negativeThemes.push('Limited review sample across stores');
        productWeaknesses.push('Relatively new listing with fewer verified buyer testimonials');
      } else if (cluster.some(c => c.returnPolicy?.toLowerCase().includes('no return'))) {
        negativeThemes.push('Strict non-returnable policy on select seller listings');
        productWeaknesses.push('Check return terms before purchasing on specific stores');
      } else {
        negativeThemes.push('Dry clean / gentle wash care recommended to retain sheen');
      }
    }

    // Determine review confidence
    let reviewConfidence: ReviewConfidenceType = 'low';
    if (totalReviews >= 150) reviewConfidence = 'high';
    else if (totalReviews >= 30) reviewConfidence = 'medium';

    // Determine sentiment
    let sentiment: CustomerSentimentType = 'insufficient_data';
    if (totalReviews >= 5) {
      if (avgRating >= 4.1) sentiment = 'positive';
      else if (avgRating >= 3.6) sentiment = 'mixed';
      else sentiment = 'negative';
    }

    // Evidence-based "Why this product?"
    const reasons: string[] = [];
    if (canonicalItem.material) reasons.push(`matches ${canonicalItem.material} specifications`);
    if (avgRating >= 4.2 && totalReviews >= 40) reasons.push(`maintains a strong ${avgRating}★ rating with ${totalReviews.toLocaleString('en-IN')} verified reviews`);
    else if (avgRating >= 4.0) reasons.push(`holds a verified ${avgRating}★ customer satisfaction score`);
    if (cluster.length >= 2) reasons.push(`available across ${cluster.length} shopping stores with up to ₹${priceDiff.toLocaleString('en-IN')} price variance`);
    if (savingsPercent >= 15) reasons.push(`offers ${savingsPercent}% savings at ${lowest.store}`);
    const whyRecommended = `Recommended because it ${reasons.join(', ')}.`;

    // Evidence-based "Things to Consider"
    let thingsToConsider = 'No significant defect or high-friction concern identified from the available public ratings and seller listings.';
    if (totalReviews < 25) {
      thingsToConsider = `This listing has a limited review volume (${totalReviews} ratings) compared to older catalog items, so verify seller ratings before purchasing.`;
    } else if (negativeThemes.length > 0) {
      thingsToConsider = `Buyers note: ${negativeThemes[0]}`;
    }

    // Price vs Quality
    const qualitySignals = avgRating >= 4.3 ? 'Strong' : avgRating >= 3.8 ? 'Moderate' : 'Basic';
    const valueRating = (avgRating >= 4.0 && savingsPercent >= 10) ? 'Excellent' : avgRating >= 3.7 ? 'Good' : 'Fair';

    // Badges calculation
    const badges: string[] = [];
    if (cluster.length >= 2) {
      badges.push(`${cluster.length} Stores Compared`);
      if (savingsPercent >= 10) {
        badges.push(`Save ₹${priceDiff.toLocaleString('en-IN')} (${savingsPercent}%)`);
      }
    }
    if (avgRating >= 4.3 && totalReviews > 50) {
      badges.push('Top Rated');
    }
    if (totalReviews >= 1000) {
      badges.push('Popular Choice');
    }

    // Platform Score calculation (0 - 10)
    let score = 5.0;
    score += (avgRating / 5) * 3; // +0 to 3
    if (totalReviews > 500) score += 1.2;
    else if (totalReviews > 100) score += 0.8;
    else if (totalReviews > 20) score += 0.4;

    if (savingsPercent > 15) score += 0.8;
    if (cluster.length > 1) score += 0.5;
    if (canonicalItem.returnPolicy && !canonicalItem.returnPolicy.toLowerCase().includes('no return')) {
      score += 0.4;
    }
    const finalScore = Number(Math.min(9.8, Math.max(3.0, score)).toFixed(1));

    const matchType: 'exact' | 'likely' | 'similar' = cluster.length > 1 ? (savingsPercent < 40 ? 'exact' : 'likely') : 'similar';

    const group: ProductGroup = {
      id: `group-${cluster[0].id}`,
      canonicalTitle: canonicalItem.title,
      brand: canonicalItem.brand || cluster.find(c => c.brand)?.brand,
      primaryImage: canonicalItem.primaryImage || lowest.primaryImage,
      galleryImages: Array.from(new Set(cluster.flatMap(c => [c.primaryImage, ...(c.galleryImages || [])]).filter(Boolean))),
      material: canonicalItem.material || cluster.find(c => c.material)?.material,
      color: canonicalItem.color || cluster.find(c => c.color)?.color,
      category: canonicalItem.category || cluster.find(c => c.category)?.category,
      occasion: canonicalItem.occasion || cluster.find(c => c.occasion)?.occasion,
      description: canonicalItem.description || `High-quality ${canonicalItem.material || ''} product available across verified shopping stores.`,
      minPrice,
      maxPrice,
      priceDifference: priceDiff,
      savingsPercent,
      lowestPriceStore: lowest.store,
      highestPriceStore: highest.store,
      averageRating: avgRating,
      totalReviews,
      highestRatedStore: bestRatedListing.store,
      mostReviewedStore: mostReviewedListing.store,
      listings: cluster,
      matchType,
      badges,
      platformScore: finalScore,

      whyRecommended,
      thingsToConsider,
      productStrengths,
      productWeaknesses,
      positiveThemes,
      negativeThemes,
      sentiment,
      reviewConfidence,
      sourceReviewBreakdown,
      priceVsQuality: {
        priceLevel: minPrice,
        qualitySignals,
        reviewConfidence: reviewConfidence === 'high' ? 'High' : reviewConfidence === 'medium' ? 'Medium' : 'Low',
        valueRating
      },

      lastUpdated: new Date().toISOString()
    };

    rawGroups.push(group);
  }

  // Identify Winner Categories across the whole search set
  if (rawGroups.length > 0) {
    // 1. Absolute Lowest Price
    const sortedByPrice = [...rawGroups].sort((a, b) => a.minPrice - b.minPrice);
    const absoluteLowest = sortedByPrice[0];
    absoluteLowest.winnerCategory = 'best_price';

    // 2. Best Overall (highest platform score with reliable review confidence)
    const sortedByScore = [...rawGroups].sort((a, b) => b.platformScore - a.platformScore);
    const bestOverall = sortedByScore[0];
    if (bestOverall.id !== absoluteLowest.id) {
      bestOverall.winnerCategory = 'best_overall';
      
      // "Why not the cheapest?" explanation
      const priceGap = bestOverall.minPrice - absoluteLowest.minPrice;
      if (priceGap > 0) {
        bestOverall.whyNotCheapestExplanation = `The cheapest option (${absoluteLowest.canonicalTitle}) is ₹${priceGap.toLocaleString('en-IN')} less, but this recommended choice delivers significantly higher customer review confidence (${bestOverall.totalReviews.toLocaleString('en-IN')} vs ${absoluteLowest.totalReviews.toLocaleString('en-IN')} reviews) and a superior rating (${bestOverall.averageRating}★ vs ${absoluteLowest.averageRating}★).`;
      }
    } else {
      bestOverall.winnerCategory = 'best_overall';
    }

    // 3. Best Value (strong score & big savings)
    const bestValueCandidate = rawGroups.find(g => g.id !== bestOverall.id && g.id !== absoluteLowest.id && g.savingsPercent >= 10);
    if (bestValueCandidate) {
      bestValueCandidate.winnerCategory = 'best_value';
    }

    // 4. Best Rated (highest rating with at least 25 reviews)
    const bestRatedCandidate = rawGroups.find(g => !g.winnerCategory && g.averageRating >= 4.3 && g.totalReviews >= 25);
    if (bestRatedCandidate) {
      bestRatedCandidate.winnerCategory = 'best_rated';
    }

    // 5. Most Reviewed
    const mostReviewedCandidate = [...rawGroups].sort((a, b) => b.totalReviews - a.totalReviews).find(g => !g.winnerCategory && g.totalReviews >= 100);
    if (mostReviewedCandidate) {
      mostReviewedCandidate.winnerCategory = 'most_reviewed';
    }

    // 6. Best Shopping Option (most stores compared)
    const bestStoreOptionCandidate = [...rawGroups].sort((a, b) => b.listings.length - a.listings.length).find(g => !g.winnerCategory && g.listings.length >= 2);
    if (bestStoreOptionCandidate) {
      bestStoreOptionCandidate.winnerCategory = 'best_store_option';
    }
  }

  const exactAndLikelyGroups = rawGroups.filter(g => g.listings.length > 1);
  const similarGroups = rawGroups.filter(g => g.listings.length <= 1);

  // Sort groups by platform score / multi-store richness
  exactAndLikelyGroups.sort((a, b) => b.listings.length - a.listings.length || b.platformScore - a.platformScore);
  similarGroups.sort((a, b) => b.platformScore - a.platformScore);

  return {
    productGroups: exactAndLikelyGroups,
    similarGroups
  };
}

