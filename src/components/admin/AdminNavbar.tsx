/**
 * Café 1973 | Bakery - Admin Navbar
 * Top navigation bar for admin panel
 */
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { BranchSelector } from './BranchSelector';
import {
  LogOut,
  Bell,
  Search,
  Globe,
  User
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-white border-b border-sand/30 px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side - Search & Branch */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="text"
              placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
              className="w-64 pl-10 pr-4 py-2 bg-[#faf8f3] rounded-xl text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <BranchSelector />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 px-3 py-2 text-forest/70 hover:text-forest hover:bg-[#faf8f3] rounded-xl transition-colors"
          >
            <Globe size={18} />
            <span className="text-sm font-medium uppercase">{language}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-forest/70 hover:text-forest hover:bg-[#faf8f3] rounded-xl transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-espresso rounded-full" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-sand/30">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-forest">
                {user?.first_name || user?.username}
              </p>
              <p className="text-xs text-forest/60">
                {user?.role || 'Admin'}
              </p>
            </div>
            <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-forest/70 hover:text-espresso hover:bg-espresso/10 rounded-xl transition-colors"
              title={language === 'es' ? 'Cerrar sesión' : 'Logout'}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
