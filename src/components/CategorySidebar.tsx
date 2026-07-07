import { HIERARCHICAL_CATEGORIES } from "../data/categories";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function CategorySidebar({ onViewAll }: { onViewAll?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayedCategories = HIERARCHICAL_CATEGORIES.slice(3);

  return (
    <div 
      onMouseLeave={() => {
        setActiveCategory(null);
        setHoverIndex(null);
      }}
      className="hidden lg:block w-64 h-[385px] relative group/sidebar"
    >
      {/* Sidebar Box */}
      <div className="w-full h-full bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="py-2 overflow-y-auto flex-1 min-h-0 relative custom-sidebar-scrollbar">
          {displayedCategories.map((category, idx) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.name}
                onMouseEnter={() => {
                  setActiveCategory(category);
                  setHoverIndex(idx);
                }}
                className="relative"
              >
                <button
                  className={`w-full flex items-center justify-between px-6 py-2.5 hover:bg-emerald-50 group transition-colors text-left ${activeCategory?.name === category.name ? 'bg-emerald-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${activeCategory?.name === category.name ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-transparent group-hover:bg-white group-hover:text-emerald-600 group-hover:border-emerald-100'}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${activeCategory?.name === category.name ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-700'}`}>
                      {category.name}
                    </span>
                  </div>
                  {category.subCategories && (
                    <ChevronRight className={`w-3 h-3 transition-colors ${activeCategory?.name === category.name ? 'text-emerald-400' : 'text-gray-300 group-hover:text-emerald-400'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onViewAll}
          className="w-full px-6 py-3 text-center text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors border-t border-gray-50 bg-white"
        >
          View All Categories
        </button>
      </div>

      {/* Flyout Menu - Positioned outside the overflow-hidden box */}
      {activeCategory && activeCategory.subCategories && (
        <div 
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => {
            setActiveCategory(null);
            setHoverIndex(null);
          }}
          className="absolute left-full top-0 w-[500px] bg-white border border-gray-100 shadow-xl rounded-r-xl z-[150] p-6 grid grid-cols-2 gap-8 h-[385px] overflow-y-auto custom-sidebar-scrollbar"
        >
          {activeCategory.subCategories.map((sub: any) => (
            <div key={sub.name} className="space-y-3">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">
                {sub.name}
              </h3>
              <div className="flex flex-col gap-2">
                {sub.childCategories.map((child: string) => (
                  <button 
                    key={child}
                    className="text-[10px] font-medium text-gray-500 hover:text-emerald-600 transition-colors text-left"
                  >
                    {child}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
