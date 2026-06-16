import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    const u = localStorage.getItem('utilisateur');
    return u ? JSON.parse(u) : null;
  });
  const [panier, setPanier] = useState([]);

  const handleConnexion = (u) => {
    localStorage.setItem('utilisateur', JSON.stringify(u));
    setUtilisateur(u);
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
    setPanier([]);
  };

  return (
    <AuthContext.Provider value={{
      utilisateur, setUtilisateur,
      panier, setPanier,
      handleConnexion, handleDeconnexion,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
