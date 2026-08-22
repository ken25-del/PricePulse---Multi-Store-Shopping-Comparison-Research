import React from 'react';
import { ShoppingBag, Heart, Scale, Settings, Moon, Sun, Globe, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../lib/i18n';

interface NavbarProps {
  settings: AppSettings;
  wishlistCount: number;
  compareCount: number;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onResetSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  wishlistCount,
  compareCount,
  onOpenWishlist,
  onOpenCompare,
  onOpenSettings,
  onToggleTheme,
  onToggleLanguage,
  onResetSearch
}) => {
  const t = translations[settings.language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#080808]/95 backdrop-blur-md transition-colors text-[#f4f4f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          id="nav-brand-btn"
          onClick={onResetSearch}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-[#FF3E00] text-black flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-sm">
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-white uppercase">
                {t.appTitle}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold bg-[#1a1a1a] text-[#FF3E00] px-2 py-0.5 rounded-sm border border-[#333333]">
                MULTI-STORE
              </span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 hidden sm:block">
              {settings.language === 'hi' ? 'स्मार्ट खरीदारी और मूल्य तुलना' : 'Real-Time Price & Review Intelligence'}
            </p>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* AI Active Indicator */}
          {settings.aiEnabled && (
            <div 
              title="AI Review & Intent Intelligence Active"
              className="hidden md:flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[#161616] text-[#FF3E00] border border-[#2a2a2a]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI CORE</span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            id="nav-lang-btn"
            onClick={onToggleLanguage}
            title="Switch Language"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#202020] rounded-md transition-colors border border-[#2a2a2a]"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF3E00]" />
            <span>{settings.language === 'en' ? 'HI' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-btn"
            onClick={onToggleTheme}
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#202020] rounded-md transition-colors border border-[#2a2a2a]"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF3E00]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Compare Button */}
          <button
            id="nav-compare-btn"
            onClick={onOpenCompare}
            title="Side-by-Side Compare Tray"
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
              compareCount > 0
                ? 'bg-white text-black border-white shadow-sm'
                : 'text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#202020] border-[#2a2a2a]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.compareTray}</span>
            {compareCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black rounded-sm bg-[#FF3E00] text-black">
                {compareCount}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            id="nav-wishlist-btn"
            onClick={onOpenWishlist}
            title="Saved Items"
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
              wishlistCount > 0
                ? 'bg-[#FF3E00] text-black border-[#FF3E00] shadow-sm'
                : 'text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#202020] border-[#2a2a2a]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-black stroke-black' : ''}`} />
            <span className="hidden sm:inline">{t.wishlist}</span>
            {wishlistCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black rounded-sm bg-black text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            id="nav-settings-btn"
            onClick={onOpenSettings}
            title="Application & AI Settings"
            className="p-2 text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#202020] rounded-md transition-colors border border-[#2a2a2a]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

