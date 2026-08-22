import React, { useState } from 'react';
import { ShoppingSource, WebsiteAnalysisResult, AppSettings } from '../types';
import { X, Plus, Globe, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface AddSourceModalProps {
  settings: AppSettings;
  onAddSource: (source: ShoppingSource) => void;
  onClose: () => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  settings,
  onAddSource,
  onClose
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg('');
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/sources/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          customApiKey: settings.customApiKey
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to analyze shopping website.');
      } else {
        setAnalysisResult(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while analyzing domain.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!analysisResult) return;

    const newSource: ShoppingSource = {
      id: `custom-${analysisResult.domain.replace(/[^a-z0-9]/g, '-')}`,
      name: analysisResult.siteName || analysisResult.domain,
      domain: analysisResult.domain,
      logo: analysisResult.logo || '',
      color: '#FF3E00',
      description: `User-added store (${analysisResult.domain}) with verified public catalog access.`,
      status: 'supported',
      enabled: true,
      isCustom: true,
      categorySpecialty: analysisResult.categoryDetected ? [analysisResult.categoryDetected] : ['General Ecommerce']
    };

    onAddSource(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg flex flex-col bg-[#0d0d0d] rounded-xl shadow-2xl border border-[#262626] overflow-hidden text-[#f4f4f4]">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#FF3E00]" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-white">
              ADD CUSTOM SHOPPING SOURCE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-[#1a1a1a] border border-[#303030] text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          <p className="text-zinc-400">
            Enter any public ecommerce website or online store domain to analyze compatibility with PricePulse multi-store research.
          </p>

          <form onSubmit={handleAnalyze} className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. nalli.com or https://karagiri.com"
              disabled={isAnalyzing}
              className="flex-1 p-2.5 rounded-md border border-[#2a2a2a] bg-[#121212] text-white font-mono text-xs focus:outline-hidden focus:border-[#FF3E00]"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !urlInput.trim()}
              className="px-4 py-2.5 rounded-md bg-[#FF3E00] hover:bg-[#E03600] disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              <span>ANALYZE</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 rounded-md bg-[#201010] text-rose-300 border border-rose-900 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {analysisResult && (
            <div className="p-4 rounded-lg border border-[#2a2a2a] bg-[#141414] space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{analysisResult.siteName}</span>
                </div>
                <span className="px-2 py-0.5 rounded-xs bg-[#1f3020] text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                  COMPATIBILITY: {analysisResult.compatibilityScore}%
                </span>
              </div>

              <p className="text-zinc-400 text-xs font-sans">
                {analysisResult.message}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-zinc-300">
                <div>DOMAIN: <strong className="text-white">{analysisResult.domain}</strong></div>
                <div>PUBLIC CATALOG: <strong className="text-white">{analysisResult.supportsPublicCatalog ? 'YES' : 'LIMITED'}</strong></div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="w-full py-2.5 rounded-sm bg-[#FF3E00] hover:bg-[#E03600] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD {analysisResult.siteName.toUpperCase()} TO SOURCES</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
