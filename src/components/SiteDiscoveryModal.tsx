import React, { useState } from 'react';
import { ShoppingSource, AppSettings } from '../types';
import { X, Compass, Plus, Check, Loader2, Sparkles } from 'lucide-react';

interface SiteDiscoveryModalProps {
  settings: AppSettings;
  currentCategory?: string;
  onAddAndEnableSource: (source: ShoppingSource) => void;
  enabledSourceIds: string[];
  onClose: () => void;
}

export const SiteDiscoveryModal: React.FC<SiteDiscoveryModalProps> = ({
  settings,
  currentCategory = 'Ethnic Wear & Sarees',
  onAddAndEnableSource,
  enabledSourceIds,
  onClose
}) => {
  const [categoryInput, setCategoryInput] = useState(currentCategory);
  const [discoveredSites, setDiscoveredSites] = useState<ShoppingSource[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const handleDiscover = async (cat: string) => {
    setIsDiscovering(true);
    try {
      const res = await fetch('/api/sources/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          customApiKey: settings.customApiKey
        })
      });
      const data = await res.json();
      if (data.sources && Array.isArray(data.sources)) {
        setDiscoveredSites(data.sources);
      }
    } catch (e) {
      console.error('Discover error:', e);
    } finally {
      setIsDiscovering(false);
    }
  };

  React.useEffect(() => {
    handleDiscover(currentCategory);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#262626] overflow-hidden text-[#f4f4f4]">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-white">
              DISCOVER SPECIALTY SHOPPING SITES
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-[#1a1a1a] border border-[#303030] text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs font-mono">
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="e.g. Silk Sarees, Shoes, Electronics..."
              className="flex-1 p-2.5 rounded-md border border-[#2a2a2a] bg-[#121212] text-white font-mono text-xs focus:outline-hidden focus:border-[#FF3E00]"
            />
            <button
              onClick={() => handleDiscover(categoryInput)}
              disabled={isDiscovering}
              className="px-4 py-2.5 rounded-md bg-[#FF3E00] hover:bg-[#E03600] disabled:opacity-50 text-black font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              {isDiscovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>DISCOVER</span>
            </button>
          </div>

          {/* List of discovered sites */}
          <div className="space-y-2.5 pt-2 font-mono">
            {isDiscovering ? (
              <div className="py-12 text-center text-zinc-500 font-mono">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF3E00] mb-2" />
                <p className="font-bold uppercase tracking-wider text-xs">Discovering verified ecommerce portals...</p>
              </div>
            ) : (
              discoveredSites.map((site) => {
                const isEnabled = enabledSourceIds.includes(site.id);
                return (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-[#262626] hover:border-[#FF3E00]/60 transition-colors bg-[#121212]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{site.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">({site.domain})</span>
                      </div>
                      <p className="text-zinc-400 text-xs font-sans">{site.description}</p>
                      {site.categorySpecialty && (
                        <div className="flex gap-1 pt-0.5">
                          {site.categorySpecialty.map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded-xs bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-300 font-bold uppercase text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAddAndEnableSource(site)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-[#152518] text-emerald-300 border border-emerald-800'
                          : 'bg-[#FF3E00] hover:bg-[#E03600] text-black'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>ENABLE</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#242424] bg-[#090909] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333333] font-bold text-xs uppercase tracking-wider text-white cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
