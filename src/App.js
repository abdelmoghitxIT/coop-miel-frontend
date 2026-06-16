import { Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Accueil from './Accueil';
import CatalogueMiel from './cataloguemiel';
import Login from './Login';
import Dashboard from './Dashboard';
import MesCommandes from './MesCommandes';
import DetailProduit from './DetailProduit';
import VerifierEmail from './VerifierEmail';
import ResetPassword from './ResetPassword';
import APropos from './APropos';
import MotDePasseOublie from './MotDePasseOublie';
import MonProfil from './MonProfil';

function App() {
  const { utilisateur } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/catalogue" element={<CatalogueMiel />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      <Route path="/mon-profil" element={
        utilisateur ? <MonProfil /> : <Login />
      } />
      <Route path="/dashboard" element={
        utilisateur?.role === 'admin' ? <Dashboard /> : <Login />
      } />
      <Route path="/mes-commandes" element={
        utilisateur ? <MesCommandes /> : <Login />
      } />
      <Route path="/produit/:id" element={<DetailProduit />} />
      <Route path="/verifier-email" element={<VerifierEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/a-propos" element={<APropos />} />
    </Routes>
  );
}

export default App;
