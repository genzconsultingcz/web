'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CookieConsentContextProps {
  isOpen: boolean;
  openConsent: () => void;
  closeConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextProps | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openConsent = () => setIsOpen(true);
  const closeConsent = () => setIsOpen(false);

  return (
    <CookieConsentContext.Provider value={{ isOpen, openConsent, closeConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
