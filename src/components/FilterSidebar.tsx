import React from 'react';
import { FilterState, ShoppingSource } from '../types';
import { translations } from '../lib/i18n';
import { RotateCcw, Star } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableStores: ShoppingSource[];
  availableMaterials: string[];
  availableColors: string[];
  language: 'en' | 'hi';
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  availableStores,
  availableMaterials,
  availableColors,
  language,
  onReset
}) => {
  const t = translations[language];

  const handleStoreToggle = (storeName: string) => {
    const exists = filters.selectedStores.includes(storeName);
    const updated = exists
      ? filters.selectedStores.filter(s => s !== storeName)
      : [...filters.selectedStores, storeName];
    onChange({ ...filters, selectedStores: updated });
  };

  const handleMaterialToggle = (mat: string) => {
    const exists = filters.materials.includes(mat);
    const updated = exists
      ? filters.materials.filter(m => m !== mat)
      : [...filters.materials, mat];
    onChange({ ...filters, materials: updated });
  };

  const handleColorToggle = (col: string) => {
    const exists = filters.colors.includes(col);
    const updated = exists
      ? filters.colors.filter(c => c !== col)
      : [...filters.colors, col];
    onChange({ ...filters, colors: updated });
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-5 bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#242424] rounded-xl p-4.5 text-xs text-zinc-900 dark:text-[#f4f4f4] shadow-xs transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-[#242424]">
        <h3 className="font-mono font-black uppercase tracking-wider text-xs text-zinc-900 dark:text-white">
          {t.filterTitle}
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3E00] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-2 text-[11px]">
          MAX BUDGET: <span className="text-[#FF3E00] font-black font-mono-num">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </label>
        <input
          type="range"
          min="500"
          max="25000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#FF3E00] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>₹500</span>
          <span>₹10,000</span>
          <span>₹25,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-2 text-[11px]">
          MINIMUM RATING
        </label>
        <div className="grid grid-cols-3 gap-1.5 font-mono">
          {[0, 3.5, 4.0].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChange({ ...filters, minRating: rate })}
              className={`py-1.5 px-2 rounded-sm font-bold flex items-center justify-center gap-1 border transition-colors ${
                filters.minRating === rate
                  ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                  : 'bg-zinc-100 dark:bg-[#161616] border-zinc-300 dark:border-[#292929] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#202020] hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {rate === 0 ? (
                'ALL'
              ) : (
                <>
                  <span>{rate}</span>
                  <Star className="w-3 h-3 fill-current" />
                  <span>+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stores */}
      {availableStores.length > 0 && (
        <div>
          <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-2 text-[11px]">
            SHOPPING STORES
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 font-mono text-[11px]">
            {availableStores.map((store) => {
              const isSelected = filters.selectedStores.includes(store.name);
              return (
                <label
                  key={store.id}
                  className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleStoreToggle(store.name)}
                    className="rounded-xs text-[#FF3E00] focus:ring-[#FF3E00] accent-[#FF3E00]"
                  />
                  <span className="truncate">{store.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Materials */}
      {availableMaterials.length > 0 && (
        <div>
          <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-2 text-[11px]">
            MATERIAL / FABRIC
          </label>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {availableMaterials.slice(0, 8).map((mat) => {
              const isSelected = filters.materials.includes(mat);
              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterialToggle(mat)}
                  className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                    isSelected
                      ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                      : 'bg-zinc-100 dark:bg-[#161616] text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-[#2a2a2a] hover:bg-zinc-200 dark:hover:bg-[#202020] hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {mat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Colors */}
      {availableColors.length > 0 && (
        <div>
          <label className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-2 text-[11px]">
            COLORS
          </label>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {availableColors.slice(0, 8).map((col) => {
              const isSelected = filters.colors.includes(col);
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleColorToggle(col)}
                  className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                    isSelected
                      ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                      : 'bg-zinc-100 dark:bg-[#161616] text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-[#2a2a2a] hover:bg-zinc-200 dark:hover:bg-[#202020] hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {col}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-[#242424] font-mono text-[11px]">
        <label className="flex items-center justify-between cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
          <span className="uppercase tracking-wider">IN STOCK ONLY</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded-xs text-[#FF3E00] focus:ring-[#FF3E00] accent-[#FF3E00]"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
          <span className="uppercase tracking-wider">RETURN AVAILABLE</span>
          <input
            type="checkbox"
            checked={filters.returnAvailableOnly}
            onChange={(e) => onChange({ ...filters, returnAvailableOnly: e.target.checked })}
            className="rounded-xs text-[#FF3E00] focus:ring-[#FF3E00] accent-[#FF3E00]"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
          <span className="uppercase tracking-wider">DISCOUNT &gt;20%</span>
          <input
            type="checkbox"
            checked={filters.discountOnly}
            onChange={(e) => onChange({ ...filters, discountOnly: e.target.checked })}
            className="rounded-xs text-[#FF3E00] focus:ring-[#FF3E00] accent-[#FF3E00]"
          />
        </label>
      </div>
    </aside>
  );
};

