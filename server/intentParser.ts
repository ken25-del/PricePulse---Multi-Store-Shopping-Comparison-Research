import { SearchIntent } from '../src/types';

export function parseSearchIntent(query: string): SearchIntent {
  const lower = query.toLowerCase().trim();
  let cleanKeywords = lower;
  let category: string | undefined;
  let material: string | undefined;
  let color: string | undefined;
  let minBudget: number | undefined;
  let maxBudget: number | undefined;
  let occasion: string | undefined;
  let ratingThreshold: number | undefined;
  let returnRequired: boolean | undefined;
  let deliveryPreference: string | undefined;
  let brand: string | undefined;
  let languageDetected: 'en' | 'hi' | 'hinglish' = 'en';

  // Language detection
  if (/[\u0900-\u097F]/.test(query)) {
    languageDetected = 'hi';
  } else if (/\b(ke liye|ke andar|chahiye|mein|wali|bhai ki|shaadi|me|ka|ki|sasta|achha)\b/i.test(query)) {
    languageDetected = 'hinglish';
  }

  // Budget extraction (e.g. "under ₹2000", "₹2000 ke andar", "under 3000", "below 1500", "2000 se 5000", "between 1000 and 3000", "₹5000")
  const betweenMatch = lower.match(/(?:between|se)\s*₹?\s*(\d{2,7})\s*(?:and|to|se|-)\s*₹?\s*(\d{2,7})/i);
  if (betweenMatch) {
    minBudget = parseInt(betweenMatch[1], 10);
    maxBudget = parseInt(betweenMatch[2], 10);
    cleanKeywords = cleanKeywords.replace(betweenMatch[0], '');
  } else {
    const underMatch = lower.match(/(?:under|below|less than|within|ke andar|se kam|tak)\s*₹?\s*(\d{2,7})/i) ||
                       lower.match(/₹?\s*(\d{2,7})\s*(?:ke andar|se kam|tak|under|below)/i) ||
                       lower.match(/under\s*₹?(\d{2,7})/i);
    if (underMatch) {
      maxBudget = parseInt(underMatch[1], 10);
      cleanKeywords = cleanKeywords.replace(underMatch[0], '');
    }
  }

  // Material extraction
  const materials = [
    'silk', 'cotton', 'banarasi', 'kanjivaram', 'chanderi', 'tussar', 'organza', 
    'georgette', 'chiffon', 'linen', 'crepe', 'satin', 'velvet', 'khadi', 
    'leather', 'denim', 'wool', 'polyester', 'nylon', 'brass', 'silver', 'gold'
  ];
  for (const m of materials) {
    if (new RegExp(`\\b${m}\\b`, 'i').test(cleanKeywords)) {
      material = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  // Category detection
  const categories = [
    { name: 'Storage & SSD', regex: /\b(ssd|solid state drive|hard disk|hard drive|hdd|nvme|pendrive|pen drive|flash drive|usb drive|sd card|memory card|sandisk|crucial|seagate|western digital|wd elements)\b/i },
    { name: 'Smartphone', regex: /\b(phone|smartphone|mobile|iphone|oneplus|samsung|redmi|realme|pixel|फ़ोन|मोबाइल)\b/i },
    { name: 'Headphones', regex: /\b(headphones|earphones|earbuds|tws|headset|airdopes|airpods|neckband|हेडफ़ोन)\b/i },
    { name: 'Laptop', regex: /\b(laptop|macbook|notebook|computer|लैपटॉप)\b/i },
    { name: 'Tablet', regex: /\b(tablet|ipad|tab|galaxy tab)\b/i },
    { name: 'Watch', regex: /\b(watch|smartwatch|smart watch|फिटनेस बैंड|घड़ी)\b/i },
    { name: 'Shoes', regex: /\b(shoes|sneakers|footwear|sandals|boots|running shoes|जूते|स्नीकर्स)\b/i },
    { name: 'Kitchen & Appliances', regex: /\b(air fryer|fryer|cooker|kettle|mixer|grinder|blender|oven|cookware|kitchen|kitchenware|कढ़ाई|मिक्सर)\b/i },
    { name: 'Shirt', regex: /\b(shirt|t-shirt|tshirt|polo|शर्ट|टी-शर्ट)\b/i },
    { name: 'Jeans & Trousers', regex: /\b(jeans|denim|trouser|trousers|pants|जींस|पैंट)\b/i },
    { name: 'Kurta', regex: /\b(kurta|kurti|anarkali|कुर्ता|कुर्ती)\b/i },
    { name: 'Saree', regex: /\b(saree|sari|साड़ी)\b/i },
    { name: 'Lehenga', regex: /\b(lehenga|घाघरा|लहंगा)\b/i },
    { name: 'Dress', regex: /\b(dress|gown|frock|ड्रेस)\b/i },
    { name: 'Handbag & Luggage', regex: /\b(handbag|bag|purse|tote|backpack|suitcase|luggage|बैग)\b/i },
    { name: 'Beauty & Grooming', regex: /\b(perfume|deodorant|lipstick|skincare|serum|hair dryer|shaver|trimer)\b/i },
    { name: 'Jewelry', regex: /\b(jewelry|jewellery|necklace|earrings|bangles|jhumka|गहने)\b/i },
  ];
  for (const cat of categories) {
    if (cat.regex.test(query)) {
      category = cat.name;
      break;
    }
  }

  // Occasion extraction
  const occasions = [
    { name: 'Teej', regex: /\b(teej|तीज)\b/i },
    { name: 'Wedding', regex: /\b(wedding|shaadi|marriage|विवाह|शादी)\b/i },
    { name: 'Diwali', regex: /\b(diwali|deepavali|दिवाली)\b/i },
    { name: 'Karwa Chauth', regex: /\b(karwa chauth|karwachauth|करवा चौथ)\b/i },
    { name: 'Party', regex: /\b(party|evening|reception|पार्टी)\b/i },
    { name: 'Puja', regex: /\b(puja|pooja|festival|festive|त्योहार|पूजा)\b/i },
    { name: 'Casual', regex: /\b(casual|daily wear|office|college)\b/i }
  ];
  for (const occ of occasions) {
    if (occ.regex.test(query)) {
      occasion = occ.name;
      break;
    }
  }

  // Color extraction
  const colors = [
    'red', 'green', 'blue', 'pink', 'yellow', 'gold', 'black', 'white', 'maroon',
    'purple', 'orange', 'grey', 'silver', 'magenta', 'turquoise', 'cream', 'beige',
    'लाल', 'हरा', 'नीला', 'गुलाबी', 'पीला', 'काला', 'सफेद'
  ];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(cleanKeywords)) {
      color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Rating requirement
  const ratingMatch = lower.match(/(\d(?:\.\d)?)\s*(?:star|\+|rated|rating)/i) ||
                      lower.match(/(?:good|best|top)\s*reviews/i);
  if (ratingMatch) {
    ratingThreshold = ratingMatch[1] ? parseFloat(ratingMatch[1]) : 4.0;
  }

  // Return policy requirement
  if (/\b(return|returnable|returns available|easy return|replacement)\b/i.test(lower)) {
    returnRequired = true;
  }

  // Delivery preference
  if (/\b(fast delivery|same day|next day|express delivery|free delivery)\b/i.test(lower)) {
    deliveryPreference = 'Fast / Free Delivery';
  }

  // Clean remaining keywords for search engines
  const stopWordsRegex = /\b(ke liye|ke andar|chahiye|mein|wali|bhai ki|shaadi|me|ka|ki|sasta|achha|best|top|under|below|for|with|buy|online|in|to|the|a|an|please|give|find|show|me)\b/gi;
  let finalKeywords = cleanKeywords
    .replace(stopWordsRegex, ' ')
    .replace(/[₹$,!?;:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!finalKeywords) {
    finalKeywords = query;
  }

  return {
    rawQuery: query,
    extractedKeywords: finalKeywords,
    category,
    material,
    color,
    minBudget,
    maxBudget,
    occasion,
    ratingThreshold,
    returnRequired,
    deliveryPreference,
    brand,
    languageDetected
  };
}
