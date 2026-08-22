import React, { useState } from 'react';
import { AppSettings, ShoppingSource } from '../types';
import { translations } from '../lib/i18n';
import { X, Settings, Sparkles, Key, Trash2, CheckCircle2, AlertCircle, Database, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  customSources: ShoppingSource[];
  onRemoveCustomSource: (id: string) => void;
  onClearHistory: () => void;
  onClearWishlist: () => void;
  onClearAllData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  customSources,
  onRemoveCustomSource,
  onClearHistory,
  onClearWishlist,
  onClearAllData,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'privacy' | 'sources' | 'about'>('general');
  const [apiKeyInput, setApiKeyInput] = useState(settings.customApiKey || '');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const t = translations[settings.language];

  const handleSaveApiKey = () => {
    onUpdateSettings({ customApiKey: apiKeyInput.trim() || undefined });
    setKeyTestResult({ success: true, message: 'API key saved in local browser storage.' });
  };

  const handleClearApiKey = () => {
    setApiKeyInput('');
    onUpdateSettings({ customApiKey: undefined });
    setKeyTestResult(null);
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setKeyTestResult({ success: false, message: 'Please enter an API key to test.' });
      return;
    }

    setIsTestingKey(true);
    setKeyTestResult(null);

    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: keyToTest,
          provider: settings.aiProvider
        })
      });
      const data = await res.json();
      setKeyTestResult({
        success: data.success,
        message: data.message || (data.success ? 'API key verified successfully!' : 'Validation failed.')
      });
      if (data.success) {
        onUpdateSettings({ customApiKey: keyToTest });
      }
    } catch (err: any) {
      setKeyTestResult({
        success: false,
        message: err.message || 'Network error while validating key.'
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0d0d0d] rounded-xl shadow-2xl border border-zinc-200 dark:border-[#262626] overflow-hidden text-zinc-900 dark:text-[#f4f4f4] transition-colors">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-[#242424] bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
              SETTINGS & ENGINE CONFIG
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] border border-zinc-300 dark:border-[#303030] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-[#242424] px-5 text-xs font-mono font-bold uppercase tracking-wider overflow-x-auto bg-zinc-50 dark:bg-[#0a0a0a]">
          {[
            { id: 'general', label: 'GENERAL' },
            { id: 'ai', label: 'AI ENGINE' },
            { id: 'privacy', label: 'PRIVACY' },
            { id: 'sources', label: `CUSTOM STORES (${customSources.length})` },
            { id: 'about', label: 'TRANSPARENCY' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#FF3E00] text-[#FF3E00]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  LANGUAGE (भाषा)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`p-2.5 rounded-md border text-center font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      settings.language === 'en'
                        ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-zinc-900 dark:text-white'
                        : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-[#383838]'
                    }`}
                  >
                    English (Default)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ language: 'hi' })}
                    className={`p-2.5 rounded-md border text-center font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      settings.language === 'hi'
                        ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-zinc-900 dark:text-white'
                        : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-[#383838]'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  CURRENCY
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['INR', 'USD', 'EUR'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => onUpdateSettings({ currency: curr as any })}
                      className={`p-2 rounded-md border text-center font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        settings.currency === curr
                          ? 'border-[#FF3E00] bg-[#FF3E00]/10 text-zinc-900 dark:text-white'
                          : 'border-zinc-300 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-[#383838]'
                      }`}
                    >
                      {curr === 'INR' ? '₹ INR' : curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-[#383838]">
                  <div>
                    <span className="font-mono font-bold uppercase text-zinc-900 dark:text-white block">AUTO-DISCOVER SPECIALTY STORES</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Suggests verified niche stores (e.g. Nalli, Karagiri, Rare Rabbit)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoDiscoverSources}
                    onChange={(e) => onUpdateSettings({ autoDiscoverSources: e.target.checked })}
                    className="accent-[#FF3E00] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* AI Settings Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#2a2a2a] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF3E00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white text-xs">
                    AI IS 100% OPTIONAL
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                    Core multi-store shopping search, price comparisons, and rating filters work completely without AI.
                    Enabling AI unlocks natural-language intent parsing, cross-store review synthesis, and purchase risk verdicts.
                  </p>
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-[#383838]">
                <div>
                  <span className="font-mono font-bold uppercase text-zinc-900 dark:text-white block">ENABLE AI INTELLIGENCE LAYER</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Enables review synthesis & "Should I Buy This?" analysis</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.aiEnabled}
                  onChange={(e) => onUpdateSettings({ aiEnabled: e.target.checked })}
                  className="accent-[#FF3E00] w-4 h-4 cursor-pointer"
                />
              </label>

              {settings.aiEnabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1">
                      AI MODEL PROVIDER
                    </label>
                    <select
                      value={settings.aiProvider}
                      onChange={(e) => onUpdateSettings({ aiProvider: e.target.value as any })}
                      className="w-full p-2.5 rounded-md border border-zinc-300 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-zinc-900 dark:text-white font-mono text-xs focus:outline-hidden focus:border-[#FF3E00]"
                    >
                      <option value="gemini">Google Gemini (Recommended - Flash)</option>
                      <option value="openai">OpenAI (GPT-4o)</option>
                      <option value="anthropic">Anthropic (Claude 3.5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1">
                      PERSONAL API KEY (OPTIONAL)
                    </label>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                      If left empty, the application uses the pre-configured server environment key.
                      Your custom key is saved exclusively in your local browser and never logged.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIzaSy... / sk-..."
                        className="flex-1 p-2.5 rounded-md border border-zinc-300 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-zinc-900 dark:text-white font-mono text-xs focus:outline-hidden focus:border-[#FF3E00]"
                      />
                      <button
                        onClick={handleTestKey}
                        disabled={isTestingKey || !apiKeyInput.trim()}
                        className="px-3.5 py-2.5 rounded-md bg-[#FF3E00] hover:bg-[#E03600] disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {isTestingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                        <span>TEST & SAVE</span>
                      </button>
                    </div>

                    {apiKeyInput && (
                      <button
                        onClick={handleClearApiKey}
                        className="mt-1.5 text-[11px] text-rose-500 dark:text-rose-400 hover:underline font-mono font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Clear Stored Key
                      </button>
                    )}

                    {keyTestResult && (
                      <div className={`mt-2 p-2.5 rounded-md text-xs font-mono flex items-center gap-2 ${
                        keyTestResult.success
                          ? 'bg-emerald-50 dark:bg-[#102015] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-[#201010] text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {keyTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                        <span>{keyTestResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Privacy & Storage Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#262626]">
                <h4 className="font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white text-xs mb-1">
                  PRIVACY-FIRST ARCHITECTURE
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  PricePulse operates with zero account requirement. All searches, wishlist items, and custom sources reside solely in your browser's local storage.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
                  <div>
                    <span className="font-mono font-bold uppercase text-zinc-900 dark:text-white block">CLEAR SEARCH HISTORY</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Removes recent search suggestions</span>
                  </div>
                  <button
                    onClick={onClearHistory}
                    className="px-3 py-1.5 rounded-sm border border-zinc-300 dark:border-[#333333] hover:bg-zinc-200 dark:hover:bg-[#1e1e1e] font-mono font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]">
                  <div>
                    <span className="font-mono font-bold uppercase text-zinc-900 dark:text-white block">CLEAR SAVED WISHLIST</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Removes all bookmarked product comparisons</span>
                  </div>
                  <button
                    onClick={onClearWishlist}
                    className="px-3 py-1.5 rounded-sm border border-rose-200 dark:border-[#401515] hover:bg-rose-50 dark:hover:bg-[#251010] text-rose-600 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Clear Wishlist
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-[#201010]">
                  <div>
                    <span className="font-mono font-bold uppercase text-rose-900 dark:text-rose-200 block">RESET ALL APPLICATION DATA</span>
                    <span className="text-rose-600 dark:text-rose-400 text-[11px]">Purges all local preferences, keys, and cached data</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all data and settings?')) {
                        onClearAllData();
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Stores Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  USER ADDED CUSTOM STORES ({customSources.length})
                </span>
              </div>

              {customSources.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-300 dark:border-[#2a2a2a] rounded-lg font-mono">
                  <Database className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600 mb-2" />
                  <p className="font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">No custom stores added yet.</p>
                  <p className="text-[11px] mt-0.5 text-zinc-500">Use "Add Store" on the search bar to validate and add any ecommerce website.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customSources.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-[#262626] bg-zinc-50 dark:bg-[#121212]"
                    >
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white tracking-tight">{s.name}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{s.domain}</div>
                      </div>
                      <button
                        onClick={() => onRemoveCustomSource(s.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer"
                        title="Remove Store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-3 leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#262626] text-xs">
                <strong className="font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white block mb-1">
                  PRICEPULSE SHOPPING RESEARCH PLATFORM
                </strong>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Built for independent, transparent consumer research across top shopping marketplaces and direct brand stores.
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <h5 className="font-mono font-bold uppercase tracking-wider text-[#FF3E00]">DATA ATTRIBUTION & TRANSPARENCY:</h5>
                <p>• All product information, prices, and ratings are aggregated directly from publicly accessible web product pages.</p>
                <p>• We never fabricate prices or ratings. When data is unavailable for a platform, it is clearly noted.</p>
                <p>• No internal payment processing: Clicking "Buy" opens the original verified seller page directly.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-[#242424] bg-zinc-50 dark:bg-[#090909] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
