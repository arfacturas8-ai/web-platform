import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@/lib/router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Play, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { API_URL } from '../utils/constants';
import CurrencyToggle from '../components/ui/CurrencyToggle';
import { LanguageSelector } from '../components/LanguageSelector';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface MenuItem {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  price: number;
  image_url: string;
  gallery: GalleryItem[];
  video_url?: string;
  is_available: boolean;
  is_featured: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
  description_en?: string;
  description_es?: string;
  image_url?: string;
  banner_url?: string;
}

const MenuExperience: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const t = {
    en: {
      menu: 'Our Menu',
      exploreMenu: 'Explore Our Menu',
      viewAll: 'View All',
      back: 'Back',
      featured: 'Featured',
      items: 'items',
      selectCategory: 'Select a category to explore our delicious offerings',
      shareProduct: 'Share',
      seeMore: 'See more'
    },
    es: {
      menu: 'Nuestro Menú',
      exploreMenu: 'Explora Nuestro Menú',
      viewAll: 'Ver Todo',
      back: 'Volver',
      featured: 'Destacado',
      items: 'artículos',
      selectCategory: 'Selecciona una categoría para explorar nuestras deliciosas opciones',
      shareProduct: 'Compartir',
      seeMore: 'Ver más'
    },
    it: {
      menu: 'Il Nostro Menu',
      exploreMenu: 'Esplora il Nostro Menu',
      viewAll: 'Vedi Tutto',
      back: 'Indietro',
      featured: 'In Evidenza',
      items: 'articoli',
      selectCategory: 'Seleziona una categoria per esplorare le nostre deliziose offerte',
      shareProduct: 'Condividi',
      seeMore: 'Vedi altro'
    },
    de: {
      menu: 'Unsere Speisekarte',
      exploreMenu: 'Entdecken Sie Unsere Speisekarte',
      viewAll: 'Alle Anzeigen',
      back: 'Zurück',
      featured: 'Empfohlen',
      items: 'Artikel',
      selectCategory: 'Wählen Sie eine Kategorie, um unsere köstlichen Angebote zu entdecken',
      shareProduct: 'Teilen',
      seeMore: 'Mehr sehen'
    },
    fr: {
      menu: 'Notre Menu',
      exploreMenu: 'Explorez Notre Menu',
      viewAll: 'Voir Tout',
      back: 'Retour',
      featured: 'À la Une',
      items: 'articles',
      selectCategory: 'Sélectionnez une catégorie pour explorer nos délicieuses offres',
      shareProduct: 'Partager',
      seeMore: 'Voir plus'
    },
    sv: {
      menu: 'Vår Meny',
      exploreMenu: 'Utforska Vår Meny',
      viewAll: 'Visa Alla',
      back: 'Tillbaka',
      featured: 'Utvald',
      items: 'artiklar',
      selectCategory: 'Välj en kategori för att utforska våra läckra erbjudanden',
      shareProduct: 'Dela',
      seeMore: 'Se mer'
    }
  };
  const texts = t[language as keyof typeof t] || t.es;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const itemId = searchParams.get('item');

    if (categorySlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) setSelectedCategory(cat);
    }

    if (itemId && menuItems.length > 0) {
      const item = menuItems.find(i => i.id === itemId);
      if (item) {
        setSelectedItem(item);
        const cat = categories.find(c => c.id === item.category_id);
        if (cat) setSelectedCategory(cat);
      }
    }
  }, [searchParams, categories, menuItems]);

  const fetchData = async () => {
    try {
      const [catRes, itemsRes] = await Promise.all([
        axios.get(`${API_URL}/menu/categories`),
        axios.get(`${API_URL}/menu/items`)
      ]);
      setCategories(catRes.data);
      setMenuItems(itemsRes.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSearchParams({ category: category.slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentGalleryIndex(0);
    setSearchParams({ category: selectedCategory?.slug || '', item: item.id });
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
      setSearchParams(selectedCategory ? { category: selectedCategory.slug } : {});
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setSearchParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextGalleryImage = () => {
    if (selectedItem?.gallery) {
      setCurrentGalleryIndex((prev) =>
        prev === selectedItem.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevGalleryImage = () => {
    if (selectedItem?.gallery) {
      setCurrentGalleryIndex((prev) =>
        prev === 0 ? selectedItem.gallery.length - 1 : prev - 1
      );
    }
  };

  const getCategoryItems = (categoryId: string) => {
    return menuItems.filter(item => item.category_id === categoryId && item.is_available);
  };

  const getName = (item: { name_en: string; name_es?: string }) =>
    language === 'es' && item.name_es ? item.name_es : item.name_en;

  const getDescription = (item: { description_en?: string; description_es?: string }) =>
    language === 'es' && item.description_es ? item.description_es : item.description_en;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Cargando menú...</p>
        </div>
      </div>
    );
  }

  // ========== CATEGORY GRID VIEW (HOME) ==========
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-stone-900">
        {/* Hero Header */}
        <header className="relative">
          <div
            className="h-[50vh] md:h-[60vh] bg-cover bg-center relative"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1600')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-stone-900" />

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
              >
                {texts.exploreMenu}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg md:text-xl max-w-2xl mb-6"
              >
                {texts.selectCategory}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <LanguageSelector variant="compact" className="bg-white/10 backdrop-blur-sm rounded-full" />
                <CurrencyToggle showRate className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2" />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Categories Grid */}
        <main className="px-4 md:px-8 py-12 -mt-20 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleCategorySelect(category)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-amber-500/20">
                    <img
                      src={category.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'}
                      alt={getName(category)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {getName(category)}
                      </h2>
                      <p className="text-white/60 text-sm mb-4">
                        {getCategoryItems(category.id).length} {texts.items}
                      </p>
                      <div className="flex items-center text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{texts.viewAll}</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-white/40 text-sm">
          <p>Baker's Bakery & Café</p>
        </footer>
      </div>
    );
  }

  // ========== CATEGORY DETAIL VIEW ==========
  if (selectedCategory && !selectedItem) {
    const items = getCategoryItems(selectedCategory.id);

    return (
      <div className="min-h-screen bg-stone-900">
        {/* Category Banner */}
        <header className="relative">
          <div
            className="h-[40vh] md:h-[50vh] bg-cover bg-center relative"
            style={{ backgroundImage: `url('${selectedCategory.banner_url || selectedCategory.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600'}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-900" />

            {/* Navigation */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/60 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">{texts.back}</span>
              </button>
              <div className="flex items-center gap-2">
                <LanguageSelector variant="compact" className="bg-black/40 backdrop-blur-sm rounded-full" />
                <CurrencyToggle showRate className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-2" />
              </div>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold text-white mb-2"
              >
                {getName(selectedCategory)}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-lg"
              >
                {items.length} {texts.items}
              </motion.p>
            </div>
          </div>
        </header>

        {/* Products Grid */}
        <main className="px-4 md:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleItemSelect(item)}
                  className="group cursor-pointer"
                >
                  <div className="bg-stone-800/60 backdrop-blur rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'}
                        alt={getName(item)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.is_featured && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {texts.featured}
                        </span>
                      )}
                      {item.gallery && item.gallery.length > 1 && (
                        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          +{item.gallery.length - 1} fotos
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {getName(item)}
                      </h3>
                      <p className="text-stone-400 text-sm line-clamp-2 mb-4 min-h-[40px]">
                        {getDescription(item)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-400">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-stone-500 text-sm group-hover:text-amber-400 transition-colors">
                          {texts.seeMore} →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Other Categories */}
        <section className="px-4 md:px-8 py-12 border-t border-stone-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Otras Categorías</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {categories.filter(c => c.id !== selectedCategory.id).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="flex-shrink-0 relative w-40 h-24 rounded-xl overflow-hidden group"
                >
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'}
                    alt={getName(category)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                    {getName(category)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ========== PRODUCT DETAIL VIEW ==========
  if (selectedItem) {
    const gallery = selectedItem.gallery?.length > 0
      ? selectedItem.gallery
      : [{ type: 'image' as const, url: selectedItem.image_url }];
    const currentMedia = gallery[currentGalleryIndex];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-stone-900 overflow-y-auto"
        >
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Gallery Section */}
            <div className="relative h-[50vh] lg:h-screen lg:w-1/2 lg:sticky lg:top-0 bg-black">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Main Image/Video */}
              <div className="relative h-full w-full">
                {currentMedia.type === 'video' ? (
                  <div className="relative h-full flex items-center justify-center bg-black">
                    <video
                      src={currentMedia.url}
                      className="max-w-full max-h-full"
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  <img
                    src={currentMedia.url || selectedItem.image_url}
                    alt={getName(selectedItem)}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Gallery Navigation */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevGalleryImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextGalleryImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentGalleryIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx === currentGalleryIndex
                              ? 'bg-white w-8'
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails (Desktop) */}
              {gallery.length > 1 && (
                <div className="hidden lg:flex absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex gap-2 overflow-x-auto">
                    {gallery.map((media, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentGalleryIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentGalleryIndex
                            ? 'border-amber-500 opacity-100'
                            : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img
                          src={media.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {media.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 lg:w-1/2 p-6 md:p-10 lg:p-16">
              <div className="max-w-lg">
                {/* Category */}
                <button
                  onClick={handleBack}
                  className="text-amber-400 text-sm font-medium mb-4 hover:text-amber-300 transition-colors"
                >
                  ← {getName(selectedCategory!)}
                </button>

                {/* Featured Badge */}
                {selectedItem.is_featured && (
                  <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1 rounded-full mb-4">
                    {texts.featured}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {getName(selectedItem)}
                </h1>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-bold text-amber-400">
                    {formatPrice(selectedItem.price)}
                  </span>
                  <div className="mt-3">
                    <CurrencyToggle showRate />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-10">
                  <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-3">
                    Descripción
                  </h3>
                  <p className="text-stone-300 text-lg leading-relaxed">
                    {getDescription(selectedItem) || 'Delicioso producto preparado con los mejores ingredientes.'}
                  </p>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: getName(selectedItem),
                        text: getDescription(selectedItem) || '',
                        url: window.location.href
                      });
                    }
                  }}
                  className="flex items-center gap-3 bg-stone-800 hover:bg-stone-700 text-white py-3 px-6 rounded-xl transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>{texts.shareProduct}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default MenuExperience;
