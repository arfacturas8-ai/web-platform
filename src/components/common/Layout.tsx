import React from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { SocialLinks } from '@/components/SocialLinks';
import { IntegrationHub } from '@/components/IntegrationHub';
import { useSettings } from '@/hooks/useSettings';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const { data: settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold">
                Café 1973
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t('home')}
                </Link>
                <Link
                  to="/menu"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t('menu')}
                </Link>
                <Link
                  to="/reservations"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t('reservations')}
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <SocialLinks iconSize={18} />
              </div>
              <LanguageToggle />
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 mt-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Integration Hub */}
          <div className="mb-8">
            <IntegrationHub
              settings={{
                tripAdvisorUrl: settings?.tripadvisor_url,
                tripAdvisorRating: settings?.tripadvisor_rating,
                openTableRestaurantId: settings?.opentable_restaurant_id,
                openTableEnabled: settings?.opentable_enabled,
                wazeAddress: settings?.waze_address || settings?.address,
                businessLatitude: settings?.business_latitude,
                businessLongitude: settings?.business_longitude,
                address: settings?.address,
                facebookUrl: settings?.facebook_url,
                instagramUrl: settings?.instagram_url,
                twitterUrl: settings?.twitter_url,
              }}
              variant="compact"
            />
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Café 1973. All rights reserved.
            </div>
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
};
