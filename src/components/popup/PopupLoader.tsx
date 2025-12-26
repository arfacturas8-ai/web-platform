/**
 * Popup Loader Component
 * Loads popups from localStorage and registers them with PopupContext
 */
import { useEffect } from 'react';
import { logger } from '@/utils/logger';
import { usePopup } from '@/contexts/PopupContext';
import type { Popup } from '@/types/popup';

const STORAGE_KEY = 'cafe1973_admin_popups';

export const PopupLoader: React.FC = () => {
  const { registerPopup, unregisterPopup, popups } = usePopup();

  useEffect(() => {
    const loadPopups = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const adminPopups: Popup[] = JSON.parse(stored);

          // Register new/updated popups
          adminPopups.forEach(popup => {
            registerPopup(popup);
          });

          // Unregister removed popups
          const adminIds = new Set(adminPopups.map(p => p.id));
          popups.forEach(existingPopup => {
            if (!adminIds.has(existingPopup.id)) {
              unregisterPopup(existingPopup.id);
            }
          });
        }
      } catch (e) {
        logger.error('Error loading popups:', e);
      }
    };

    // Load initially
    loadPopups();

    // Listen for storage changes (when admin updates popups)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadPopups();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also poll for changes in same tab (storage event doesn't fire in same tab)
    const interval = setInterval(loadPopups, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [registerPopup, unregisterPopup]);

  return null;
};

export default PopupLoader;
