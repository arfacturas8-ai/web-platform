/**
 * Café 1973 - Category Pills
 * Horizontal scrolling category filter
 */
import React, { useRef, useEffect } from 'react';
import type { Category } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';

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
      const containerRect = container.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();

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
      className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2"
      role="tablist"
      aria-label="Menu categories"
    >
      {/* All button */}
      <button
        ref={selectedCategory === null ? selectedRef : null}
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          selectedCategory === null
            ? 'bg-forest text-white shadow-md'
            : 'bg-sand/30 text-forest hover:bg-sand/50'
        }`}
        role="tab"
        aria-selected={selectedCategory === null}
      >
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
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isSelected
                ? 'bg-forest text-white shadow-md'
                : 'bg-sand/30 text-forest hover:bg-sand/50'
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
