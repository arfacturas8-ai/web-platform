/**
 * Café 1973 | Bakery - Admin Sidebar
 * Clean sidebar focused on restaurant management
 */
import React, { useState } from 'react';
import { Link, useLocation } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Store,
  BarChart3,
  Settings,
  Users,
  Package,
  DollarSign,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Coffee,
  Gift,
  Grid3X3,
  Megaphone,
  PanelTop,
  CreditCard,
  FileText,
  MapPin,
  QrCode,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  labelEs: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    to: '/admin',
    label: 'Dashboard',
    labelEs: 'Panel',
    icon: <LayoutDashboard size={20} />,
  },
  {
    to: '/admin/reservations',
    label: 'Reservations',
    labelEs: 'Reservaciones',
    icon: <CalendarDays size={20} />,
  },
  {
    to: '/admin/tables',
    label: 'Tables',
    labelEs: 'Mesas',
    icon: <Grid3X3 size={20} />,
  },
  {
    to: '/admin/menu',
    label: 'Menu',
    labelEs: 'Menú',
    icon: <UtensilsCrossed size={20} />,
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    labelEs: 'Clientes',
    icon: <Users size={20} />,
  },
  {
    to: '/admin/loyalty',
    label: 'Loyalty',
    labelEs: 'Lealtad',
    icon: <Gift size={20} />,
  },
  {
    to: '/admin/inventory',
    label: 'Inventory',
    labelEs: 'Inventario',
    icon: <Package size={20} />,
  },
  {
    to: '/admin/finance',
    label: 'Finance',
    labelEs: 'Finanzas',
    icon: <DollarSign size={20} />,
  },
  {
    to: '/admin/branches',
    label: 'Branches',
    labelEs: 'Sucursales',
    icon: <Store size={20} />,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    labelEs: 'Analíticas',
    icon: <BarChart3 size={20} />,
  },
  {
    to: '/admin/feedback',
    label: 'Feedback',
    labelEs: 'Comentarios',
    icon: <MessageSquare size={20} />,
  },
  {
    to: '/admin/popups',
    label: 'Popups',
    labelEs: 'Popups',
    icon: <Megaphone size={20} />,
  },
  {
    to: '/admin/content',
    label: 'Content',
    labelEs: 'Contenido',
    icon: <PanelTop size={20} />,
  },
  {
    to: '/admin/gift-cards',
    label: 'Gift Cards',
    labelEs: 'Tarjetas Regalo',
    icon: <CreditCard size={20} />,
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    labelEs: 'Reportes',
    icon: <FileText size={20} />,
  },
  {
    to: '/admin/delivery-map',
    label: 'Delivery Map',
    labelEs: 'Mapa Delivery',
    icon: <MapPin size={20} />,
  },
  {
    to: '/admin/qr-codes',
    label: 'QR Codes',
    labelEs: 'Códigos QR',
    icon: <QrCode size={20} />,
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    labelEs: 'Configuración',
    icon: <Settings size={20} />,
  },
];

export const Sidebar: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'bg-forest text-white min-h-screen transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sand rounded-xl flex items-center justify-center flex-shrink-0">
            <Coffee size={20} className="text-forest" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg leading-tight">Café 1973</h1>
              <p className="text-white/60 text-xs">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.to);
          const label = language === 'es' ? item.labelEs : item.label;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? label : undefined}
            >
              <span className={cn('flex-shrink-0', active && 'text-sand')}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate flex-1">{label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-sand text-forest text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {active && !collapsed && !item.badge && (
                <span className="ml-auto w-1.5 h-1.5 bg-sand rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronDown size={18} className="rotate-90" />
              <span>{language === 'es' ? 'Colapsar' : 'Collapse'}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
