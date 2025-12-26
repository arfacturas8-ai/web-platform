import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { useNavigate } from '@/lib/router';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getImageUrl, API_URL } from '../utils/constants';
import { ShoppingCart, Search, Filter, X, Plus, Minus } from 'lucide-react';
import CurrencyToggle from '../components/ui/CurrencyToggle';
import { LanguageSelector } from '../components/LanguageSelector';

interface MenuItem {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
}

const OnlineMenu: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cart, addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);

  const t = {
    en: {
      title: "Order Online",
      search: "Search menu...",
      allCategories: "All Categories",
      addToCart: "Add to Cart",
      viewCart: "View Cart",
      items: "items",
      unavailable: "Unavailable",
      quantity: "Quantity",
      close: "Close",
      itemDetails: "Item Details",
      price: "Price",
    },
    es: {
      title: "Ordenar en Línea",
      search: "Buscar en el menú...",
      allCategories: "Todas las Categorías",
      addToCart: "Agregar al Carrito",
      viewCart: "Ver Carrito",
      items: "artículos",
      unavailable: "No Disponible",
      quantity: "Cantidad",
      close: "Cerrar",
      itemDetails: "Detalles del Artículo",
      price: "Precio",
    },
    it: {
      title: "Ordina Online",
      search: "Cerca nel menu...",
      allCategories: "Tutte le Categorie",
      addToCart: "Aggiungi al Carrello",
      viewCart: "Vedi Carrello",
      items: "articoli",
      unavailable: "Non Disponibile",
      quantity: "Quantità",
      close: "Chiudi",
      itemDetails: "Dettagli Articolo",
      price: "Prezzo",
    },
    de: {
      title: "Online Bestellen",
      search: "Menü durchsuchen...",
      allCategories: "Alle Kategorien",
      addToCart: "In den Warenkorb",
      viewCart: "Warenkorb Anzeigen",
      items: "Artikel",
      unavailable: "Nicht Verfügbar",
      quantity: "Menge",
      close: "Schließen",
      itemDetails: "Artikeldetails",
      price: "Preis",
    },
    fr: {
      title: "Commander en Ligne",
      search: "Rechercher dans le menu...",
      allCategories: "Toutes les Catégories",
      addToCart: "Ajouter au Panier",
      viewCart: "Voir le Panier",
      items: "articles",
      unavailable: "Indisponible",
      quantity: "Quantité",
      close: "Fermer",
      itemDetails: "Détails de l'Article",
      price: "Prix",
    },
    sv: {
      title: "Beställ Online",
      search: "Sök i menyn...",
      allCategories: "Alla Kategorier",
      addToCart: "Lägg i Varukorg",
      viewCart: "Visa Varukorg",
      items: "artiklar",
      unavailable: "Ej Tillgänglig",
      quantity: "Antal",
      close: "Stäng",
      itemDetails: "Artikeldetaljer",
      price: "Pris",
    },
  };

  const translations = t[language as keyof typeof t];

  // Helper function to get localized text from database items
  const getLocalizedText = (
    textEs: string | undefined,
    textEn: string,
    field: 'name' | 'description' = 'name'
  ): string => {
    // For languages other than Spanish and English, fall back to English
    if (language === 'es' && textEs) return textEs;
    return textEn;
  };

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu/categories`);
      setCategories(response.data);
    } catch (error) {
      logger.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/menu/items`);
      setMenuItems(response.data);
    } catch (error) {
      logger.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: MenuItem) => {
    try {
      await addToCart(item.id, itemQuantity);
      setSelectedItem(null);
      setItemQuantity(1);
    } catch (error) {
      logger.error('Error adding to cart:', error);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_es.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">{translations.title}</h1>
              <LanguageSelector variant="compact" />
              <CurrencyToggle showRate />
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="relative bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {translations.viewCart}
              {cart && cart.item_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.item_count}
                </span>
              )}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={translations.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">{translations.allCategories}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getLocalizedText(category.name_es, category.name_en)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.image_url && (
                  <img
                    src={getImageUrl(item.image_url)}
                    alt={getLocalizedText(item.name_es, item.name_en)}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {getLocalizedText(item.name_es, item.name_en)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getLocalizedText(item.description_es, item.description_en, 'description')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-600">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setItemQuantity(1);
                      }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      {translations.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getLocalizedText(selectedItem.name_es, selectedItem.name_en)}
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedItem.image_url && (
                <img
                  src={getImageUrl(selectedItem.image_url)}
                  alt={getLocalizedText(selectedItem.name_es, selectedItem.name_en)}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <p className="text-gray-600 mb-4">
                {getLocalizedText(selectedItem.description_es, selectedItem.description_en, 'description')}
              </p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-amber-600">
                  {formatPrice(selectedItem.price)}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.quantity}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              >
                {translations.addToCart} - {formatPrice(selectedItem.price * itemQuantity)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineMenu;
