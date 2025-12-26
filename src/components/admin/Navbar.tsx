import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { BranchSelector } from './BranchSelector';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">
            Welcome, {user?.first_name || user?.username}
          </h1>
          <BranchSelector />
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button variant="outline" onClick={logout}>
            {t('logout')}
          </Button>
        </div>
      </div>
    </header>
  );
};
