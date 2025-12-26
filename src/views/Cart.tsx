/**
 * Café 1973 | Bakery - Cart Page
 * Mobile-first shopping cart
 */
import React from 'react';
import { logger } from '@/utils/logger';
import { useNavigate, Link } from '@/lib/router';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Coffee
} from 'lucide-react';

const translations = {
  en: {
    cart: 'Cart',
    items: 'items',
    clear: 'Clear',
    emptyCart: 'Your cart is empty',
    emptyCartMessage: 'Explore our menu and add your favorite items',
    viewMenu: 'View Menu',
    continueShopping: 'Continue shopping',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout'
  },
  es: {
    cart: 'Carrito',
    items: 'artículos',
    clear: 'Vaciar',
    emptyCart: 'Tu carrito está vacío',
    emptyCartMessage: 'Explora nuestro menú y agrega tus productos favoritos',
    viewMenu: 'Ver Menú',
    continueShopping: 'Seguir comprando',
    subtotal: 'Subtotal',
    tax: 'Impuesto',
    total: 'Total',
    proceedToCheckout: 'Proceder al Pago'
  },
  it: {
    cart: 'Carrello',
    items: 'articoli',
    clear: 'Svuota',
    emptyCart: 'Il tuo carrello è vuoto',
    emptyCartMessage: 'Esplora il nostro menu e aggiungi i tuoi prodotti preferiti',
    viewMenu: 'Vedi Menu',
    continueShopping: 'Continua a fare acquisti',
    subtotal: 'Subtotale',
    tax: 'Tassa',
    total: 'Totale',
    proceedToCheckout: 'Procedi al Pagamento'
  },
  de: {
    cart: 'Warenkorb',
    items: 'Artikel',
    clear: 'Leeren',
    emptyCart: 'Ihr Warenkorb ist leer',
    emptyCartMessage: 'Erkunden Sie unsere Speisekarte und fügen Sie Ihre Lieblingsartikel hinzu',
    viewMenu: 'Menü ansehen',
    continueShopping: 'Weiter einkaufen',
    subtotal: 'Zwischensumme',
    tax: 'Steuer',
    total: 'Gesamt',
    proceedToCheckout: 'Zur Kasse gehen'
  },
  fr: {
    cart: 'Panier',
    items: 'articles',
    clear: 'Vider',
    emptyCart: 'Votre panier est vide',
    emptyCartMessage: 'Explorez notre menu et ajoutez vos produits préférés',
    viewMenu: 'Voir le Menu',
    continueShopping: 'Continuer les achats',
    subtotal: 'Sous-total',
    tax: 'Taxe',
    total: 'Total',
    proceedToCheckout: 'Procéder au Paiement'
  },
  sv: {
    cart: 'Varukorg',
    items: 'artiklar',
    clear: 'Töm',
    emptyCart: 'Din varukorg är tom',
    emptyCartMessage: 'Utforska vår meny och lägg till dina favoritprodukter',
    viewMenu: 'Se Meny',
    continueShopping: 'Fortsätt handla',
    subtotal: 'Delsumma',
    tax: 'Moms',
    total: 'Totalt',
    proceedToCheckout: 'Gå till Kassan'
  }
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();

  // Get translations for current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Format price for Costa Rica
  const formatPrice = (price: number) => `₡${price.toLocaleString('es-CR')}`;

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      logger.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      logger.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center pb-24">
        <FloatingLanguageSelector />
        <div className="spinner"></div>
        <MobileNavBar />
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f3] pb-24">
        <FloatingLanguageSelector />
        <header className="sticky top-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-b border-sand-200">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-forest">
              {t.cart}
            </h1>
            <p className="text-xs text-forest/60">Café 1973 | Bakery</p>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-24 h-24 bg-sand/30 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-forest/40" />
          </div>
          <h2 className="text-xl font-bold text-forest mb-2">
            {t.emptyCart}
          </h2>
          <p className="text-forest/60 mb-8 max-w-xs">
            {t.emptyCartMessage}
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
          >
            {t.viewMenu}
            <ChevronRight size={18} />
          </Link>
        </div>

        <MobileNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-40">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-b border-sand-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-forest">
                {t.cart}
              </h1>
              <p className="text-xs text-forest/60">
                {cart.item_count} {t.items}
              </p>
            </div>
            <button
              onClick={() => clearCart()}
              className="text-sm text-forest/60 hover:text-espresso transition-colors"
            >
              {t.clear}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <main className="px-4 py-6">
        <div className="space-y-4">
          {cart.items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4">
                {/* Product Image Placeholder */}
                <div className="w-20 h-20 bg-sand/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Coffee size={24} className="text-sand" />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-forest truncate">
                    {item.menu_item_name}
                  </h3>
                  <p className="text-sm text-espresso font-bold mt-1">
                    {formatPrice(item.menu_item_price)}
                  </p>

                  {item.special_instructions && (
                    <p className="text-xs text-forest/60 mt-1 truncate">
                      {item.special_instructions}
                    </p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-sand/30 text-forest flex items-center justify-center hover:bg-sand/50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold text-forest">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center hover:bg-forest/90 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-forest/40 hover:text-espresso transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <Link
          to="/menu"
          className="flex items-center justify-center gap-2 mt-6 text-forest/60 hover:text-forest transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">{t.continueShopping}</span>
        </Link>
      </main>

      {/* Fixed Bottom - Order Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-sand-200 px-4 py-4 safe-area-bottom z-30">
        <div className="max-w-lg mx-auto">
          {/* Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-forest/70">
              <span>{t.subtotal}</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-forest/70">
              <span>{t.tax}</span>
              <span>{formatPrice(cart.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-forest pt-2 border-t border-sand/50">
              <span>{t.total}</span>
              <span className="text-espresso">{formatPrice(cart.total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-forest text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-forest/90 transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={20} />
            <span>{t.proceedToCheckout}</span>
          </button>
        </div>
      </div>

      <MobileNavBar />
    </div>
  );
};

export default Cart;
