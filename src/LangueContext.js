import { createContext, useContext, useState } from 'react';
import translations from './translations';

const LangueContext = createContext();

export function LangueProvider({ children }) {
  const [langue, setLangue] = useState('fr');
  const t = translations[langue];
  const isAr = langue === 'ar';

  const toggleLangue = () => {
    setLangue(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  return (
    <LangueContext.Provider value={{ langue, t, isAr, toggleLangue }}>
      {children}
    </LangueContext.Provider>
  );
}

export function useLangue() {
  return useContext(LangueContext);
}