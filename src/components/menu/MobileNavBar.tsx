/**
 * Cafe 1973 - Mobile Navigation Bar
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Bottom navigation for mobile devices
 */
import React, { useState } from 'react';
import { Link, useLocation } from '@/lib/router';
import { Home, UtensilsCrossed, CalendarDays, Star, MoreHorizontal, X, Info, Phone, Users, Newspaper, HelpCircle, User } from 'lucide-react';
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
    icon: <Home size={22} strokeWidth={1.5} />,
    label: 'Home',
    labelEs: 'Inicio',
  },
  {
    path: '/menu',
    icon: <UtensilsCrossed size={22} strokeWidth={1.5} />,
    label: 'Menu',
    labelEs: 'Menu',
  },
  {
    path: '/reservations',
    icon: <CalendarDays size={22} strokeWidth={1.5} />,
    label: 'Reserve',
    labelEs: 'Reservar',
  },
  {
    path: '/loyalty',
    icon: <Star size={22} strokeWidth={1.5} />,
    label: 'Rewards',
    labelEs: 'Premios',
  },
];

// More menu items
const moreMenuItems: NavItem[] = [
  { path: '/about', icon: <Info size={20} strokeWidth={1.5} />, label: 'About Us', labelEs: 'Nosotros' },
  { path: '/contact', icon: <Phone size={20} strokeWidth={1.5} />, label: 'Contact', labelEs: 'Contacto' },
  { path: '/events', icon: <Users size={20} strokeWidth={1.5} />, label: 'Events', labelEs: 'Eventos' },
  { path: '/blog', icon: <Newspaper size={20} strokeWidth={1.5} />, label: 'Blog', labelEs: 'Blog' },
  { path: '/faq', icon: <HelpCircle size={20} strokeWidth={1.5} />, label: 'FAQ', labelEs: 'Preguntas' },
  { path: '/account', icon: <User size={20} strokeWidth={1.5} />, label: 'My Account', labelEs: 'Mi Cuenta' },
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
        <div
          className="fixed inset-0 z-[60] bg-forest/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-cream rounded-t-3xl shadow-elevated animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-sand rounded-full" />
            </div>

            <div className="px-6 pb-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-forest">
                  {language === 'es' ? 'Mas opciones' : 'More Options'}
                </h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="w-10 h-10 rounded-full bg-sand/30 flex items-center justify-center hover:bg-sand/50 transition-colors"
                >
                  <X size={20} className="text-forest" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {moreMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-forest text-cream shadow-card'
                          : 'bg-white text-forest hover:bg-sand/30'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] font-medium text-center leading-tight">
                        {language === 'es' ? item.labelEs : item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav
        className="mobile-nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const label = language === 'es' ? item.labelEs : item.label;
            const isCart = item.path === '/cart';

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-forest'
                    : 'text-forest/40 hover:text-forest/70'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active background pill */}
                {isActive && (
                  <span className="absolute inset-0 bg-sand/40 rounded-xl" />
                )}

                {/* Icon with badge for cart */}
                <div className="relative z-10">
                  {item.icon}
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-espresso text-cream text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className={`relative z-10 text-[10px] mt-1.5 font-semibold tracking-wide ${
                  isActive ? 'text-forest' : 'text-forest/40'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMore(true)}
            className="relative flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all text-forest/40 hover:text-forest/70"
          >
            <MoreHorizontal size={22} strokeWidth={1.5} />
            <span className="text-[10px] mt-1.5 font-semibold tracking-wide">
              {language === 'es' ? 'Mas' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
