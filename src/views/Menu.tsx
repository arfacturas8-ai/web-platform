/**
 * Café 1973 - Menu Page
 * Bisqueria-inspired design with Cafe 1973 brand colors
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
import { Search, X, Coffee, ChevronLeft, Filter } from 'lucide-react';
import { Link } from '@/lib/router';
import type { MenuItem } from '@/types/menu';

const translations = {
  en: {
    searchPlaceholder: 'Search our menu...',
    noProductsFound: 'No products found',
    clearSearch: 'Clear search',
    ourMenu: 'Our Menu',
    allCategories: 'All Categories',
    browseAll: 'Browse all our delicious offerings',
    items: 'items',
    featured: 'Featured',
  },
  es: {
    searchPlaceholder: 'Buscar en nuestro menú...',
    noProductsFound: 'No se encontraron productos',
    clearSearch: 'Limpiar búsqueda',
    ourMenu: 'Nuestro Menú',
    allCategories: 'Todas las Categorías',
    browseAll: 'Explora todas nuestras deliciosas opciones',
    items: 'productos',
    featured: 'Destacado',
  },
  it: {
    searchPlaceholder: 'Cerca nel nostro menu...',
    noProductsFound: 'Nessun prodotto trovato',
    clearSearch: 'Cancella ricerca',
    ourMenu: 'Il Nostro Menu',
    allCategories: 'Tutte le Categorie',
    browseAll: 'Scopri tutte le nostre deliziose offerte',
    items: 'prodotti',
    featured: 'In Evidenza',
  },
  de: {
    searchPlaceholder: 'Unser Menü durchsuchen...',
    noProductsFound: 'Keine Produkte gefunden',
    clearSearch: 'Suche löschen',
    ourMenu: 'Unser Menü',
    allCategories: 'Alle Kategorien',
    browseAll: 'Entdecken Sie alle unsere köstlichen Angebote',
    items: 'Produkte',
    featured: 'Empfohlen',
  },
  fr: {
    searchPlaceholder: 'Rechercher dans notre menu...',
    noProductsFound: 'Aucun produit trouvé',
    clearSearch: 'Effacer la recherche',
    ourMenu: 'Notre Menu',
    allCategories: 'Toutes les Catégories',
    browseAll: 'Découvrez toutes nos délicieuses offres',
    items: 'produits',
    featured: 'En Vedette',
  },
  sv: {
    searchPlaceholder: 'Sök i vår meny...',
    noProductsFound: 'Inga produkter hittades',
    clearSearch: 'Rensa sökning',
    ourMenu: 'Vår Meny',
    allCategories: 'Alla Kategorier',
    browseAll: 'Bläddra bland alla våra läckra erbjudanden',
    items: 'produkter',
    featured: 'Utvalt',
  },
};

// Helper to get localized item text (for menu items from database)
const getLocalizedText = (language: string, textEs: string | undefined, textEn: string) => {
  if (language === 'es' && textEs) return textEs;
  return textEn;
};

export const Menu: React.FC = () => {
  const { language } = useLanguage();
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

  // Get selected category info
  const selectedCategoryInfo = selectedCategory
    ? categories?.find(c => c.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="navbar">
        <div className="container">
          <div className="nav-container">
            {/* Back / Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="nav-icon-btn"
                aria-label="Back to home"
              >
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-forest">Café 1973</h1>
                <p className="text-xs text-forest/60">Moravia, Costa Rica</p>
              </div>
            </div>

            {/* Actions */}
            <div className="nav-extra">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="nav-icon-btn"
                aria-label="Search"
              >
                {showSearch ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar - expandable */}
          {showSearch && (
            <div className="pb-4 animate-fade-in-down">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={menuT.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-12"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-forest py-12 md:py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sand/20 rounded-full text-sand text-sm font-medium mb-4">
              <Coffee size={16} />
              <span>Est. 1973</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-3">
              {menuT.ourMenu}
            </h2>
            <p className="text-cream/70 max-w-md mx-auto">
              {menuT.browseAll}
            </p>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b border-sand-light py-4">
        <div className="container">
          {categories && (
            <CategoryPills
              categories={categories.filter(c => c.is_active)}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="section py-8 md:py-12">
        <div className="container">
          {/* Selected Category Header */}
          {selectedCategoryInfo && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold text-forest">
                  {getLocalizedText(language, selectedCategoryInfo.name_es, selectedCategoryInfo.name)}
                </h3>
                <span className="px-3 py-1 bg-sand/20 rounded-full text-sm text-forest/70">
                  {filteredItems?.length || 0} {menuT.items}
                </span>
              </div>
              {selectedCategoryInfo.description && (
                <p className="text-forest/60">
                  {getLocalizedText(language, selectedCategoryInfo.description_es, selectedCategoryInfo.description)}
                </p>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-8">
              {/* Category Pills Skeleton */}
              <div className="flex gap-3 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 flex-shrink-0" width={100} rounded="full" />
                ))}
              </div>
              {/* Menu Items Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonMenuItem key={i} />
                ))}
              </div>
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="space-y-12">
              {selectedCategory ? (
                // Single category view
                <section className="animate-fade-in-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <section key={categoryId} className="animate-fade-in-up">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-1 h-8 bg-sand rounded-full" />
                          <h3 className="text-xl md:text-2xl font-bold text-forest">
                            {categoryName}
                          </h3>
                          <span className="px-3 py-1 bg-forest/5 rounded-full text-sm text-forest/60">
                            {items.length} {menuT.items}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCategorySelect(categoryId)}
                          className="text-sm font-medium text-forest hover:text-sand-dark transition-colors flex items-center gap-1"
                        >
                          View all
                          <ChevronLeft size={16} className="rotate-180" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(items as MenuItem[]).slice(0, 4).map((item: MenuItem, index: number) => (
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
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-sand/20 rounded-full flex items-center justify-center mb-6">
                <Search size={32} className="text-forest/40" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-2">
                {menuT.noProductsFound}
              </h3>
              <p className="text-forest/60 mb-6 max-w-sm">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Try selecting a different category or check back later.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline"
                >
                  {menuT.clearSearch}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav Spacer */}
      <div className="bottom-nav-spacer" />

      {/* Mobile Bottom Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Menu;
