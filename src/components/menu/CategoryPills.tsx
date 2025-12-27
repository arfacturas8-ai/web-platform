/**
 * Cafe 1973 - Category Pills
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Horizontal scrolling category filter
 */
import React, { useRef, useEffect } from 'react';
import type { Category } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutGrid } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected pill into view
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const pill = selectedRef.current;

      // Calculate scroll position to center the pill
      const scrollLeft = pill.offsetLeft - container.offsetWidth / 2 + pill.offsetWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [selectedCategory]);

  // Sort categories by display_order
  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order);

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1"
      role="tablist"
      aria-label="Menu categories"
    >
      {/* All button */}
      <button
        ref={selectedCategory === null ? selectedRef : null}
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
          selectedCategory === null
            ? 'bg-forest text-cream shadow-card scale-105'
            : 'bg-white text-forest border-2 border-sand-light hover:border-forest hover:bg-sand/10'
        }`}
        role="tab"
        aria-selected={selectedCategory === null}
      >
        <LayoutGrid size={16} />
        {language === 'es' ? 'Todo' : 'All'}
      </button>

      {/* Category pills */}
      {sortedCategories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const name = language === 'es' && category.name_es
          ? category.name_es
          : category.name;

        return (
          <button
            key={category.id}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              isSelected
                ? 'bg-forest text-cream shadow-card scale-105'
                : 'bg-white text-forest border-2 border-sand-light hover:border-forest hover:bg-sand/10'
            }`}
            role="tab"
            aria-selected={isSelected}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
