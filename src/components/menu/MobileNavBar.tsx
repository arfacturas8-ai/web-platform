/**
 * Café 1973 - Mobile Navigation Bar
 * Bottom navigation for mobile devices
 */
import React, { useState } from 'react';
import { Link, useLocation } from '@/lib/router';
import { Home, UtensilsCrossed, CalendarDays, ShoppingBag, MoreHorizontal, X, Gift, Users, Info, Phone, HelpCircle, Newspaper, Star, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  labelEs: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    icon: <Home size={22} />,
    label: 'Home',
    labelEs: 'Inicio',
  },
  {
    path: '/menu',
    icon: <UtensilsCrossed size={22} />,
    label: 'Menu',
    labelEs: 'Menú',
  },
  {
    path: '/reservations',
    icon: <CalendarDays size={22} />,
    label: 'Reserve',
    labelEs: 'Reservar',
  },
  {
    path: '/loyalty',
    icon: <Star size={22} />,
    label: 'Rewards',
    labelEs: 'Premios',
  },
];

// More menu items
const moreMenuItems: NavItem[] = [
  { path: '/about', icon: <Info size={20} />, label: 'About Us', labelEs: 'Nosotros' },
  { path: '/contact', icon: <Phone size={20} />, label: 'Contact', labelEs: 'Contacto' },
  { path: '/events', icon: <Users size={20} />, label: 'Events', labelEs: 'Eventos' },
  { path: '/blog', icon: <Newspaper size={20} />, label: 'Blog', labelEs: 'Blog' },
  { path: '/faq', icon: <HelpCircle size={20} />, label: 'FAQ', labelEs: 'Preguntas' },
  { path: '/account', icon: <User size={20} />, label: 'My Account', labelEs: 'Mi Cuenta' },
];

export const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { cart } = useCart();
  const [showMore, setShowMore] = useState(false);

  const totalItems = cart?.item_count || 0;

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pb-24 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-forest">
                {language === 'es' ? 'Más opciones' : 'More Options'}
              </h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-2 rounded-full hover:bg-sand/30 transition-colors"
              >
                <X size={20} className="text-forest" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {moreMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-forest text-white' : 'hover:bg-sand/30 text-forest'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {language === 'es' ? item.labelEs : item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sand-200 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const label = language === 'es' ? item.labelEs : item.label;
            const isCart = item.path === '/cart';

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isActive ? 'text-forest' : 'text-forest/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon with badge for cart */}
                <div className="relative">
                  {item.icon}
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-espresso text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-forest' : 'text-forest/50'}`}>
                  {label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-forest rounded-full" />
                )}
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMore(true)}
            className="relative flex flex-col items-center justify-center w-16 h-full transition-colors text-forest/50 hover:text-forest"
          >
            <MoreHorizontal size={22} />
            <span className="text-[10px] mt-1 font-medium">
              {language === 'es' ? 'Más' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
