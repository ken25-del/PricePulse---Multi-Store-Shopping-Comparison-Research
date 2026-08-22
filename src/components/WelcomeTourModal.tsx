import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Search,
  Scale,
  BellRing,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Smartphone,
  SlidersHorizontal,
  Lock,
  Layers,
  HelpCircle,
  X,
  Compass,
  TrendingDown,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { AppSettings } from '../types';

interface WelcomeTourModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onStartSearch?: (sampleQuery?: string) => void;
  onToggleDoNotShowAgain?: (dontShow: boolean) => void;
}

type TabType = 'why_not_extensions' | 'features_tour' | 'quick_start';

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({
  settings,
  isOpen,
  onClose,
  onStartSearch,
  onToggleDoNotShowAgain
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('why_not_extensions');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const isHindi = settings.language === 'hi';

  const handleEnterApp = (query?: string) => {
    if (onToggleDoNotShowAgain) {
      onToggleDoNotShowAgain(dontShowAgain);
    }
    onClose();
    if (query && onStartSearch) {
      onStartSearch(query);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontShowAgain(checked);
    if (onToggleDoNotShowAgain) {
      onToggleDoNotShowAgain(checked);
    }
  };

  return (
    <div
      id="welcome-tour-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="welcome-tour-modal-container"
        className="relative w-full max-w-4xl bg-white dark:bg-[#0e0e0e] border border-zinc-200 dark:border-[#2b2b2b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-900 dark:text-zinc-100 font-sans transition-colors"
      >
        {/* Top Gradient Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF3E00] via-amber-500 to-[#FF3E00]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-zinc-200 dark:border-[#222222] bg-zinc-50/90 dark:bg-[#121212]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FF3E00]/10 dark:bg-[#FF3E00]/15 border border-[#FF3E00]/30 text-[#FF3E00] text-[10px] font-mono font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              <span>{isHindi ? 'प्राइसपल्स में आपका स्वागत है' : 'WELCOME TO PRICEPULSE'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span>{isHindi ? 'ब्राउज़र एक्सटेंशन से क्यों बेहतर है?' : 'Why We Are Different From Browser Extensions'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal">
              {isHindi
                ? 'बिना किसी एक्सटेंशन इंस्टॉलेशन या प्राइवेसी रिस्क के सभी प्रमुख भारतीय स्टोर्स पर लाइव कीमतें और AI समीक्षाएं देखें।'
                : 'Zero installation, zero tracking permissions, and instant simultaneous search across top stores.'}
            </p>
          </div>

          <button
            id="close-welcome-tour-btn"
            type="button"
            onClick={() => handleEnterApp()}
            className="self-end sm:self-center p-2 rounded-lg bg-zinc-100 dark:bg-[#1a1a1a] hover:bg-zinc-200 dark:hover:bg-[#282828] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-[#333333] transition-colors cursor-pointer"
            title="Close / Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-3 border-b border-zinc-200 dark:border-[#222222] bg-zinc-100/50 dark:bg-[#101010] flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('why_not_extensions')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'why_not_extensions'
                ? 'border-[#FF3E00] text-[#FF3E00]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isHindi ? 'एक्सटेंशन vs प्राइसपल्स' : 'Extensions vs PricePulse'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('features_tour')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'features_tour'
                ? 'border-[#FF3E00] text-[#FF3E00]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isHindi ? 'एप्लिकेशन फीचर्स वॉकथ्रू' : 'Features Walkthrough'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quick_start')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'quick_start'
                ? 'border-[#FF3E00] text-[#FF3E00]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isHindi ? '3 आसान स्टेप्स' : '3-Step Quick Guide'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-[#0b0b0b]">
          
          {/* TAB 1: WHY NOT EXTENSIONS? */}
          {activeTab === 'why_not_extensions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#262626] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {isHindi ? '100% प्राइवेसी & 0 एक्सटेंशन रिस्क' : '100% Privacy & Zero Permissions'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {isHindi
                      ? 'एक्सटेंशन आपकी ब्राउजिंग हिस्ट्री और डेटा ट्रैक करते हैं। प्राइसपल्स में कोई प्लगइन या अनुमति की जरूरत नहीं है।'
                      : 'Extensions demand "read and change data on all websites" permissions. PricePulse runs entirely standalone in your browser.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#262626] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/20 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {isHindi ? 'एक साथ सभी स्टोर्स स्कैन' : 'Simultaneous Multi-Store Scan'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {isHindi
                      ? 'एक्सटेंशन तभी काम करता है जब आप किसी एक स्टोर पर हों। यहाँ एक सर्च से Amazon, Flipkart, Myntra, Meesho, Ajio सब एक साथ चेक होते हैं।'
                      : 'Extensions only check prices AFTER you open a store page. PricePulse queries all top Indian stores at the same time.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#262626] space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {isHindi ? 'मोबाइल और डेस्कटॉप दोनों पर' : 'Works on Mobile & Desktop'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {isHindi
                      ? 'ब्राउज़र एक्सटेंशन मोबाइल फोन (Chrome/Safari) में नहीं चलते। प्राइसपल्स हर डिवाइस पर सुपर फास्ट चलता है।'
                      : 'Chrome extensions cannot run on standard mobile browsers. PricePulse works seamlessly across all phones, tablets, and PCs.'}
                  </p>
                </div>
              </div>

              {/* Direct Side-by-Side Comparison Table */}
              <div className="rounded-xl border border-zinc-200 dark:border-[#262626] overflow-hidden bg-white dark:bg-[#111111]">
                <div className="p-3.5 bg-zinc-100 dark:bg-[#171717] border-b border-zinc-200 dark:border-[#262626] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    {isHindi ? 'तुलनात्मक अंतर' : 'Feature Comparison Breakdown'}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {isHindi ? 'पारदर्शी विश्लेषण' : 'Transparent Comparison'}
                  </span>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-[#202020] text-xs">
                  {/* Row 1 */}
                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-semibold text-zinc-800 dark:text-zinc-300">
                      {isHindi ? 'ब्राउज़र अनुमति / इंस्टॉलेशन' : 'Installation & Permissions'}
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'भारी एक्सटेंशन व डेटा एक्सेस' : 'Risky full-browser access'}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'शून्य इंस्टॉलेशन, वेब-नेटिव' : 'Zero install, pure web app'}</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="p-3 grid grid-cols-12 gap-2 items-center bg-zinc-50/70 dark:bg-[#131313]">
                    <div className="col-span-4 font-semibold text-zinc-800 dark:text-zinc-300">
                      {isHindi ? 'मल्टी-स्टोर डिस्कवरी' : 'Cross-Store Scanning'}
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>{isHindi ? 'केवल वर्तमान पेज पर सीमित' : 'Waits until you visit 1 page'}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? '7+ स्टोर्स एक क्लिक में' : '7+ stores scanned at once'}</span>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-semibold text-zinc-800 dark:text-zinc-300">
                      {isHindi ? 'AI समीक्षा & खरीदार सारांश' : 'AI Review Synthesis'}
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>{isHindi ? 'केवल मूल रेटिंग स्टार' : 'Basic star rating only'}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'विस्तृत फायदे, नुकसान व समझ' : 'Deep pros/cons & sentiment'}</span>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="p-3 grid grid-cols-12 gap-2 items-center bg-zinc-50/70 dark:bg-[#131313]">
                    <div className="col-span-4 font-semibold text-zinc-800 dark:text-zinc-300">
                      {isHindi ? 'प्राइस ड्रॉप वॉच' : 'Price Drop Alerts'}
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>{isHindi ? 'ईमेल साइन-अप / ट्रैकिंग' : 'Requires account / emails'}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'लोकल ब्राउज़र वॉच, तुरंत अलर्ट' : 'Private browser watch & alerts'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FEATURES WALKTHROUGH */}
          {activeTab === 'features_tour' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feature 1 */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#282828] space-y-2 hover:border-[#FF3E00]/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#FF3E00] font-mono font-black text-xs uppercase tracking-wider">
                    <Search className="w-4 h-4" />
                    <span>01. Multi-Store Search</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {isHindi ? 'समानांतर स्टोर सर्च' : 'Unified Cross-Store Engine'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isHindi
                      ? 'Amazon, Flipkart, Myntra, Meesho, Ajio, Croma, और Tata CLiQ पर एक साथ खोजें। हिंदी, हिंग्लिश और अंग्रेजी में सर्च समर्थित है।'
                      : 'Search once in conversational Hinglish or English to discover live verified pricing across Amazon, Flipkart, Myntra, Meesho, and Ajio.'}
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#282828] space-y-2 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>02. AI Review Synthesizer</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {isHindi ? 'AI समीक्षा और खरीदार सारांश' : 'AI Review & Sentiment Matrix'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isHindi
                      ? 'हजारों खरीदारों की समीक्षाओं का निचोड़: क्या अच्छा है, क्या कमियां हैं, फैब्रिक क्वालिटी और फिटिंग कैसी है—तुरंत जानें।'
                      : 'Aggregates real verified buyer ratings into scannable pros, common durability issues, authentic value scores, and purchase recommendations.'}
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#282828] space-y-2 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono font-black text-xs uppercase tracking-wider">
                    <Scale className="w-4 h-4" />
                    <span>03. Side-by-Side Matrix</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {isHindi ? 'साइड-बाय-साइड तुलना' : 'Deep Side-by-Side Comparison'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isHindi
                      ? '2 से 4 उत्पादों को एक साथ रखकर उनकी डिलीवरी फीस, रिटर्न पॉलिसी, स्पेक्स और सबसे कम कीमत वाले स्टोर की तुलना करें।'
                      : 'Compare 2 to 4 products side-by-side with delivery timeframes, return windows, warranty terms, and store-specific discounts.'}
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#282828] space-y-2 hover:border-amber-400/50 transition-colors">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono font-black text-xs uppercase tracking-wider">
                    <BellRing className="w-4 h-4" />
                    <span>04. Price Watch & Alerts</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {isHindi ? 'प्राइस ड्रॉप वॉच & अलर्ट्स' : 'Smart Price Drop Monitoring'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isHindi
                      ? 'किसी भी उत्पाद पर "Track Price" दबाएं और टारगेट प्राइस सेट करें। ऐप खोलते ही कीमत गिरने पर आपको तुरंत अलर्ट मिलेगा।'
                      : 'Track specific store listings, log historical price movements, set discount targets, and receive instant alerts when prices drop.'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: QUICK START GUIDE */}
          {activeTab === 'quick_start' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#242424]">
                  <div className="w-7 h-7 rounded-full bg-[#FF3E00] text-black font-black font-mono flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {isHindi ? 'खोज बॉक्स में टाइप करें' : 'Type what you want in plain language'}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                      {isHindi
                        ? 'उदाहरण: "Banarasi silk saree under 3000" या "Headphones with noise cancellation under 4000"'
                        : 'E.g., "Wireless noise cancelling earbuds under 3000" or "Pure cotton kurta set with dupatta"'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#242424]">
                  <div className="w-7 h-7 rounded-full bg-[#FF3E00] text-black font-black font-mono flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {isHindi ? 'कीमतें व AI समीक्षाएं जांचें' : 'Inspect verified store prices & AI sentiment'}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                      {isHindi
                        ? 'देखें किस स्टोर पर सबसे कम कीमत है, डिलीवरी चार्ज क्या है, और खरीदारों ने क्या रेटिंग दी है।'
                        : 'See exact savings, buyer pros and cons, delivery charges, and return policies across all stores.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#242424]">
                  <div className="w-7 h-7 rounded-full bg-[#FF3E00] text-black font-black font-mono flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {isHindi ? 'सीधे स्टोर से खरीदें या प्राइस ट्रैक करें' : 'Buy directly or track price drops'}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                      {isHindi
                        ? 'बेस्ट ऑफर वाले स्टोर पर सीधे चेकआउट करें या भविष्य में डिस्काउंट अलर्ट पाने के लिए "Track Price" दबाएं।'
                        : 'Click "Buy on Store" to checkout directly on the best store, or add to Price Watch for drop notifications.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Primary CTA */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-[#222222] bg-zinc-50 dark:bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={handleCheckboxChange}
              className="rounded-xs border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-[#FF3E00] focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span>{isHindi ? 'भविष्य में यह वेलकम गाइड स्वतः न दिखाएं' : 'Don\'t show this welcome guide automatically next time'}</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="enter-app-primary-btn"
              type="button"
              onClick={() => handleEnterApp()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#FF3E00] hover:bg-[#E03600] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              <span>{isHindi ? 'शुरू करें — एप्लिकेशन में जाएं' : 'Enter PricePulse — Start Comparing'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
