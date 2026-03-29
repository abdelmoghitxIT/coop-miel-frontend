import { useState } from 'react';
import CatalogueMiel from './cataloguemiel';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [utilisateur, setUtilisateur] = useState(() => {
    const u = localStorage.getItem('utilisateur');
    return u ? JSON.parse(u) : null;
  });

  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherDashboard, setAfficherDashboard] = useState(false);

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

  if (afficherLogin) {
    return <Login onConnexion={handleConnexion} onAnnuler={() => setAfficherLogin(false)} />;
  }

  if (afficherDashboard && utilisateur?.role === 'admin') {
    return <Dashboard utilisateur={utilisateur} onRetour={() => setAfficherDashboard(false)} onDeconnexion={handleDeconnexion} />;
  }

  return (
    <CatalogueMiel
      utilisateur={utilisateur}
      onDeconnexion={handleDeconnexion}
      onDemanderConnexion={() => setAfficherLogin(true)}
      onDashboard={() => setAfficherDashboard(true)}
    />
  );
}

export default App;