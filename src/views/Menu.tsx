/**
 * Café 1973 - Menu Page
 * Mobile-first design inspired by Bisqueria
 * Moravia, Costa Rica
 */
import React, { useState, useEffect, useRef } from 'react';
import { useCategories, useMenuItems } from '@/hooks/useMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackPageView, trackCategoryFilter } from '@/utils/analytics';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CategoryPills } from '@/components/menu/CategoryPills';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { SkeletonMenuItem, Skeleton } from '@/components/ui/skeleton';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Search, X } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

const translations = {
  en: {
    searchPlaceholder: 'Search menu...',
    noProductsFound: 'No products found',
    clearSearch: 'Clear search',
  },
  es: {
    searchPlaceholder: 'Buscar en el menú...',
    noProductsFound: 'No se encontraron productos',
    clearSearch: 'Limpiar búsqueda',
  },
  it: {
    searchPlaceholder: 'Cerca nel menu...',
    noProductsFound: 'Nessun prodotto trovato',
    clearSearch: 'Cancella ricerca',
  },
  de: {
    searchPlaceholder: 'Menü durchsuchen...',
    noProductsFound: 'Keine Produkte gefunden',
    clearSearch: 'Suche löschen',
  },
  fr: {
    searchPlaceholder: 'Rechercher dans le menu...',
    noProductsFound: 'Aucun produit trouvé',
    clearSearch: 'Effacer la recherche',
  },
  sv: {
    searchPlaceholder: 'Sök i menyn...',
    noProductsFound: 'Inga produkter hittades',
    clearSearch: 'Rensa sökning',
  },
};

// Helper to get localized item text (for menu items from database)
const getLocalizedText = (language: string, textEs: string | undefined, textEn: string) => {
  // Database only stores es/en, so for other languages fallback to English
  if (language === 'es' && textEs) return textEs;
  return textEn;
};

export const Menu: React.FC = () => {
  const { t, language } = useLanguage();
  const menuT = translations[language as keyof typeof translations] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems(selectedCategory || undefined);

  const isLoading = categoriesLoading || itemsLoading;

  // Track page view on mount
  useEffect(() => {
    trackPageView('/menu', 'Menu');
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Handle category selection with tracking
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const categoryName = categoryId
      ? categories?.find(c => c.id === categoryId)?.name || 'Unknown'
      : 'All';
    trackCategoryFilter(categoryId, categoryName);
  };

  // Filter items by search query
  const filteredItems = menuItems?.filter((item: MenuItem) => {
    if (!searchQuery.trim()) return item.is_available;
    const query = searchQuery.toLowerCase();
    const name = getLocalizedText(language, item.name_es, item.name).toLowerCase();
    const description = getLocalizedText(language, item.description_es, item.description || '').toLowerCase();
    return item.is_available && (name.includes(query) || description.includes(query));
  });

  // Group items by category for display
  const groupedItems = filteredItems?.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
    const categoryId = item.category_id;
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-b border-sand-200">
        <div className="px-4 py-4">
          {/* Top row - Logo and actions */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-forest">Café 1973</h1>
              <p className="text-xs text-forest/60">Moravia, Costa Rica</p>
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sand/30 text-forest transition-colors hover:bg-sand/50"
              aria-label="Search"
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Search bar - expandable */}
          {showSearch && (
            <div className="animate-fade-in mb-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={menuT.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Pills - horizontal scroll */}
          {categories && (
            <CategoryPills
              categories={categories.filter(c => c.is_active)}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-8">
            {/* Category Pills Skeleton */}
            <div className="flex gap-2 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 flex-shrink-0" width={80} rounded="full" />
              ))}
            </div>
            {/* Menu Items Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <SkeletonMenuItem key={i} />
              ))}
            </div>
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="space-y-8">
            {selectedCategory ? (
              // Single category view
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item: MenuItem, index: number) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ) : (
              // All categories view - grouped
              Object.entries(groupedItems || {}).map(([categoryId, items]) => {
                const category = categories?.find(c => c.id === categoryId);
                if (!category || !items.length) return null;

                const categoryName = getLocalizedText(language, category.name_es, category.name);

                return (
                  <section key={categoryId} className="animate-fade-in">
                    <h2 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
                      <span className="w-8 h-0.5 bg-sand rounded-full"></span>
                      {categoryName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(items as MenuItem[]).map((item: MenuItem, index: number) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-sand/30 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-forest/40" />
            </div>
            <p className="text-forest/60 mb-2">
              {menuT.noProductsFound}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-forest underline underline-offset-2 text-sm"
              >
                {menuT.clearSearch}
              </button>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Menu;
