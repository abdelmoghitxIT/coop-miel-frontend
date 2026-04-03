import { useState } from 'react';
import CatalogueMiel from './cataloguemiel';
import Login from './Login';
import Dashboard from './Dashboard';
import DetailProduit from './DetailProduit';

function App() {
  const [utilisateur, setUtilisateur] = useState(() => {
    const u = localStorage.getItem('utilisateur');
    return u ? JSON.parse(u) : null;
  });
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherDashboard, setAfficherDashboard] = useState(false);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [panier, setPanier] = useState([]);

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

  if (afficherLogin) {
    return <Login onConnexion={handleConnexion} onAnnuler={() => setAfficherLogin(false)} />;
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

  return (
    <CatalogueMiel
      utilisateur={utilisateur}
      onDeconnexion={handleDeconnexion}
      onDemanderConnexion={() => setAfficherLogin(true)}
      onDashboard={() => setAfficherDashboard(true)}
      onVoirProduit={(id) => setProduitSelectionne(id)}
      panier={panier}
      setPanier={setPanier}
    />
  );
}

export default App;