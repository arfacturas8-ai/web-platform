/**
 * Popup Context
 * Global popup management for Cafe 1973
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { useLocation } from '@/lib/router';
import { useLanguage } from './LanguageContext';
import type {
  Popup,
  PopupDisplayState,
  PopupContextState,
  DEFAULT_POPUP_FREQUENCY,
} from '@/types/popup';

const STORAGE_KEY = 'cafe1973_popup_states';
const SESSION_KEY = 'cafe1973_popup_session';

interface PopupContextType {
  popups: Popup[];
  activePopup: Popup | null;
  showPopup: (popup: Popup) => void;
  hidePopup: () => void;
  dismissPopup: (popupId: string) => void;
  trackConversion: (popupId: string) => void;
  triggerPopup: (triggerId: string) => void;
  registerPopup: (popup: Popup) => void;
  unregisterPopup: (popupId: string) => void;
  getPopupStats: (popupId: string) => PopupDisplayState | undefined;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Helper to check if popup should display based on targeting
const checkTargeting = (popup: Popup, pathname: string, language: string, isMobile: boolean): boolean => {
  const { targeting } = popup;
  if (!targeting) return true;

  // Check pages
  if (targeting.pages && targeting.pages.length > 0) {
    const matchesPage = targeting.pages.some(pattern => {
      if (pattern === '*') return true;
      if (pattern.endsWith('*')) {
        return pathname.startsWith(pattern.slice(0, -1));
      }
      return pathname === pattern;
    });
    if (!matchesPage) return false;
  }

  // Check excluded pages
  if (targeting.excludePages && targeting.excludePages.length > 0) {
    const isExcluded = targeting.excludePages.some(pattern => {
      if (pattern.endsWith('*')) {
        return pathname.startsWith(pattern.slice(0, -1));
      }
      return pathname === pattern;
    });
    if (isExcluded) return false;
  }

  // Check devices
  if (targeting.devices && targeting.devices.length > 0) {
    const deviceType = isMobile ? 'mobile' : 'desktop';
    if (!targeting.devices.includes(deviceType)) return false;
  }

  // Check languages
  if (targeting.languages && targeting.languages.length > 0) {
    if (!targeting.languages.includes(language)) return false;
  }

  return true;
};

// Helper to check scheduling
const checkSchedule = (popup: Popup): boolean => {
  const { schedule } = popup;
  if (!schedule) return true;

  const now = new Date();

  if (schedule.startDate && new Date(schedule.startDate) > now) return false;
  if (schedule.endDate && new Date(schedule.endDate) < now) return false;

  if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
    if (!schedule.daysOfWeek.includes(now.getDay())) return false;
  }

  if (schedule.startTime || schedule.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    if (schedule.startTime) {
      const [h, m] = schedule.startTime.split(':').map(Number);
      if (currentTime < h * 60 + m) return false;
    }
    if (schedule.endTime) {
      const [h, m] = schedule.endTime.split(':').map(Number);
      if (currentTime > h * 60 + m) return false;
    }
  }

  return true;
};

// Helper to check frequency limits
const checkFrequency = (popup: Popup, state: PopupDisplayState | undefined, sessionCount: number): boolean => {
  const frequency = popup.frequency || {
    maxDisplaysPerSession: 1,
    maxDisplaysPerDay: 3,
    cooldownMinutes: 5,
  };

  if (!state) return true;

  // Check if dismissed
  if (state.dismissed) return false;

  // Check session limit
  if (frequency.maxDisplaysPerSession !== undefined) {
    if (sessionCount >= frequency.maxDisplaysPerSession) return false;
  }

  // Check total limit
  if (frequency.maxDisplaysTotal !== undefined) {
    if (state.displayCount >= frequency.maxDisplaysTotal) return false;
  }

  // Check cooldown
  if (frequency.cooldownMinutes !== undefined && state.lastDisplayed) {
    const lastDisplay = new Date(state.lastDisplayed);
    const cooldownEnd = new Date(lastDisplay.getTime() + frequency.cooldownMinutes * 60 * 1000);
    if (new Date() < cooldownEnd) return false;
  }

  // Check daily limit
  if (frequency.maxDisplaysPerDay !== undefined && state.lastDisplayed) {
    const lastDisplay = new Date(state.lastDisplayed);
    const today = new Date();
    if (lastDisplay.toDateString() === today.toDateString()) {
      // Same day - would need to track daily count separately
      // For now, we'll use a simple check
    }
  }

  return true;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [displayStates, setDisplayStates] = useState<Record<string, PopupDisplayState>>({});
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});

  const location = useLocation();
  const { language } = useLanguage();
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const exitIntentRef = useRef<((e: MouseEvent) => void) | null>(null);
  const timerRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Load display states from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDisplayStates(JSON.parse(stored));
      }

      // Initialize session counts
      const sessionStored = sessionStorage.getItem(SESSION_KEY);
      if (sessionStored) {
        setSessionCounts(JSON.parse(sessionStored));
      }
    } catch (e) {
      logger.error('Error loading popup states:', e);
    }
  }, []);

  // Save display states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(displayStates));
    } catch (e) {
      logger.error('Error saving popup states:', e);
    }
  }, [displayStates]);

  // Save session counts
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionCounts));
    } catch (e) {
      logger.error('Error saving session counts:', e);
    }
  }, [sessionCounts]);

  // Find eligible popup for current context
  const findEligiblePopup = useCallback((trigger: string, extra?: any): Popup | null => {
    const eligible = popups
      .filter(p => p.active)
      .filter(p => p.trigger.type === trigger)
      .filter(p => checkTargeting(p, location.pathname, language, isMobile))
      .filter(p => checkSchedule(p))
      .filter(p => checkFrequency(p, displayStates[p.id], sessionCounts[p.id] || 0))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return eligible[0] || null;
  }, [popups, location.pathname, language, isMobile, displayStates, sessionCounts]);

  // Setup trigger listeners when location changes
  useEffect(() => {
    // Clear existing timers
    Object.values(timerRefs.current).forEach(clearTimeout);
    timerRefs.current = {};

    // Clear scroll listener
    if (scrollListenerRef.current) {
      window.removeEventListener('scroll', scrollListenerRef.current);
      scrollListenerRef.current = null;
    }

    // Clear exit intent listener
    if (exitIntentRef.current) {
      document.removeEventListener('mouseout', exitIntentRef.current);
      exitIntentRef.current = null;
    }

    // Clear inactivity timer
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = null;
    }

    // Don't setup triggers if there's already an active popup
    if (activePopup) return;

    // Setup triggers for each popup
    popups.filter(p => p.active).forEach(popup => {
      if (!checkTargeting(popup, location.pathname, language, isMobile)) return;
      if (!checkSchedule(popup)) return;
      if (!checkFrequency(popup, displayStates[popup.id], sessionCounts[popup.id] || 0)) return;

      const { trigger } = popup;

      switch (trigger.type) {
        case 'page_load':
          // Show immediately or with small delay
          timerRefs.current[popup.id] = setTimeout(() => {
            if (!activePopup) showPopup(popup);
          }, (trigger.delay || 0) * 1000);
          break;

        case 'time_delay':
          timerRefs.current[popup.id] = setTimeout(() => {
            if (!activePopup) showPopup(popup);
          }, (trigger.delay || 5) * 1000);
          break;

        case 'scroll_depth':
          const scrollHandler = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= (trigger.scrollDepth || 50)) {
              if (!activePopup) showPopup(popup);
              if (scrollListenerRef.current) {
                window.removeEventListener('scroll', scrollListenerRef.current);
              }
            }
          };
          scrollListenerRef.current = scrollHandler;
          window.addEventListener('scroll', scrollHandler, { passive: true });
          break;

        case 'exit_intent':
          const exitHandler = (e: MouseEvent) => {
            if (e.clientY <= 0 && !activePopup) {
              showPopup(popup);
              if (exitIntentRef.current) {
                document.removeEventListener('mouseout', exitIntentRef.current);
              }
            }
          };
          exitIntentRef.current = exitHandler;
          document.addEventListener('mouseout', exitHandler);
          break;

        case 'inactivity':
          const resetInactivity = () => {
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
            inactivityRef.current = setTimeout(() => {
              if (!activePopup) showPopup(popup);
            }, (trigger.inactivityTime || 30) * 1000);
          };
          ['mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivity, { passive: true });
          });
          resetInactivity();
          break;
      }
    });

    return () => {
      Object.values(timerRefs.current).forEach(clearTimeout);
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
      }
      if (exitIntentRef.current) {
        document.removeEventListener('mouseout', exitIntentRef.current);
      }
      if (inactivityRef.current) {
        clearTimeout(inactivityRef.current);
      }
    };
  }, [location.pathname, popups, activePopup, language, isMobile]);

  const showPopup = useCallback((popup: Popup) => {
    setActivePopup(popup);

    // Update display state
    setDisplayStates(prev => ({
      ...prev,
      [popup.id]: {
        popupId: popup.id,
        displayCount: (prev[popup.id]?.displayCount || 0) + 1,
        lastDisplayed: new Date().toISOString(),
        dismissed: false,
        converted: prev[popup.id]?.converted || false,
      },
    }));

    // Update session count
    setSessionCounts(prev => ({
      ...prev,
      [popup.id]: (prev[popup.id] || 0) + 1,
    }));

    // Track view if enabled
    if (popup.trackViews) {
      // Could send to analytics here
      logger.info(`[Popup View] ${popup.id} - ${popup.name}`);
    }
  }, []);

  const hidePopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  const dismissPopup = useCallback((popupId: string) => {
    setDisplayStates(prev => ({
      ...prev,
      [popupId]: {
        ...prev[popupId],
        popupId,
        displayCount: prev[popupId]?.displayCount || 1,
        lastDisplayed: prev[popupId]?.lastDisplayed || new Date().toISOString(),
        dismissed: true,
      },
    }));
    setActivePopup(null);
  }, []);

  const trackConversion = useCallback((popupId: string) => {
    setDisplayStates(prev => ({
      ...prev,
      [popupId]: {
        ...prev[popupId],
        popupId,
        displayCount: prev[popupId]?.displayCount || 1,
        converted: true,
      },
    }));

    const popup = popups.find(p => p.id === popupId);
    if (popup?.trackClicks) {
      logger.info(`[Popup Conversion] ${popupId} - ${popup.name}`);
    }
  }, [popups]);

  const triggerPopup = useCallback((triggerId: string) => {
    const popup = popups.find(p =>
      p.active &&
      p.trigger.type === 'button_click' &&
      p.trigger.elementSelector === triggerId
    );
    if (popup && !activePopup) {
      showPopup(popup);
    }
  }, [popups, activePopup, showPopup]);

  const registerPopup = useCallback((popup: Popup) => {
    setPopups(prev => {
      const exists = prev.find(p => p.id === popup.id);
      if (exists) {
        return prev.map(p => p.id === popup.id ? popup : p);
      }
      return [...prev, popup];
    });
  }, []);

  const unregisterPopup = useCallback((popupId: string) => {
    setPopups(prev => prev.filter(p => p.id !== popupId));
  }, []);

  const getPopupStats = useCallback((popupId: string) => {
    return displayStates[popupId];
  }, [displayStates]);

  return (
    <PopupContext.Provider
      value={{
        popups,
        activePopup,
        showPopup,
        hidePopup,
        dismissPopup,
        trackConversion,
        triggerPopup,
        registerPopup,
        unregisterPopup,
        getPopupStats,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider');
  }
  return context;
};

export default PopupContext;
