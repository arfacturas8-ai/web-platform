/**
 * Café 1973 - Cart Button
 * Floating cart button with item count
 */
import React from 'react';
import { Link } from '@/lib/router';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const CartButton: React.FC = () => {
  const { cart } = useCart();

  const totalItems = cart?.item_count || 0;
  const totalPrice = cart?.total || 0;

  // Format price for Costa Rica (Colones)
  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString('es-CR')}`;
  };

  return (
    <Link
      to="/cart"
      className="relative flex items-center gap-2 px-3 py-2 bg-forest text-white rounded-full hover:bg-forest/90 transition-all duration-200 active:scale-95"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingBag size={20} />

      {totalItems > 0 && (
        <>
          {/* Item count badge */}
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-espresso text-white text-xs font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
            {totalItems > 99 ? '99+' : totalItems}
          </span>

          {/* Price on larger screens */}
          <span className="hidden sm:inline text-sm font-medium">
            {formatPrice(totalPrice)}
          </span>
        </>
      )}
    </Link>
  );
};
