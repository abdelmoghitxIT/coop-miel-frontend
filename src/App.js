import { useState, useEffect } from 'react';
import CatalogueMiel from './cataloguemiel';
import Login from './Login';
import Dashboard from './Dashboard';
import MesCommandes from './MesCommandes';
import DetailProduit from './DetailProduit';
import VerifierEmail from './VerifierEmail';
import ResetPassword from './ResetPassword';
import APropos from './APropos'; 

function App() {
  const [utilisateur, setUtilisateur] = useState(() => {
    const u = localStorage.getItem('utilisateur');
    return u ? JSON.parse(u) : null;
  });
  
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherDashboard, setAfficherDashboard] = useState(false);
  const [afficherCommandes, setAfficherCommandes] = useState(false);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [panier, setPanier] = useState([]);
const [afficherAPropos, setAfficherAPropos] = useState(false);
  // Nouveaux états pour la gestion des liens d'authentification par email
  const [pageSpeciale, setPageSpeciale] = useState(null); // 'verification' ou 'reset'
  const [tokenMail, setTokenMail] = useState('');

  // Détection automatique des paramètres de l'URL au démarrage de l'application
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (path === '/verifier-email' && token) {
      setTokenMail(token);
      setPageSpeciale('verification');
    } else if (path === '/reset-password' && token) {
      setTokenMail(token);
      setPageSpeciale('reset');
    }
  }, []);

  const handleConnexion = (u) => {
    setUtilisateur(u);
    setAfficherLogin(false);
    if (u.role === 'admin') setAfficherDashboard(true);
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
    setAfficherDashboard(false);
  };

  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const existant = prev.find((p) => p.id === produit.id);
      if (existant) {
        return prev.map((p) => p.id === produit.id ? { ...p, qte: p.qte + 1 } : p);
      }
      return [...prev, { ...produit, qte: 1 }];
    });
  };

  // Fonction pour nettoyer l'URL et rediriger proprement vers la connexion
  const réinitialiserNavigationSpeciale = () => {
    window.history.replaceState({}, '', '/'); // Efface le '/verifier-email?token=...' de la barre d'adresse
    setPageSpeciale(null);
    setTokenMail('');
    setAfficherLogin(true);
  };

  // 1. RENDU DES PAGES SPÉCIALES (LIENS EMAILS)
  if (pageSpeciale === 'verification') {
    return (
      <VerifierEmail 
        token={tokenMail} 
        onRetourConnexion={réinitialiserNavigationSpeciale} 
      />
    );
  }

  if (pageSpeciale === 'reset') {
    return (
      <ResetPassword 
        token={tokenMail} 
        onRetourConnexion={réinitialiserNavigationSpeciale} 
      />
    );
  }

  // 2. RENDU DES ÉCRANS STANDARD
  if (afficherLogin) {
    return <Login onConnexion={handleConnexion} onAnnuler={() => setAfficherLogin(false)} />;
  }
if (afficherAPropos) {
    return <APropos onRetour={() => setAfficherAPropos(false)} />;
  }
  if (afficherCommandes && utilisateur) {
    return (
      <MesCommandes
        utilisateur={utilisateur}
        onRetour={() => setAfficherCommandes(false)}
        isAr={false}
      />
    );
  }

  if (afficherDashboard && utilisateur?.role === 'admin') {
    return <Dashboard utilisateur={utilisateur} onRetour={() => setAfficherDashboard(false)} onDeconnexion={handleDeconnexion} />;
  }

  if (produitSelectionne) {
    return (
      <DetailProduit
        produitId={produitSelectionne}
        onRetour={() => setProduitSelectionne(null)}
        onAjouterPanier={ajouterAuPanier}
      />
    );
  }

  // 3. ÉCRAN PAR DÉFAUT : CATALOGUE
  return (
    <CatalogueMiel
      utilisateur={utilisateur}
      onDeconnexion={handleDeconnexion}
      onDemanderConnexion={() => setAfficherLogin(true)}
      onDashboard={() => setAfficherDashboard(true)}
      onMesCommandes={() => setAfficherCommandes(true)}
      onVoirProduit={(id) => setProduitSelectionne(id)}
      panier={panier}
      setPanier={setPanier}
      onAllerAPropos={() => setAfficherAPropos(true)}
    />
  );
}

export default App;