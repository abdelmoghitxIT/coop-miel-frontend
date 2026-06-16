import { Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
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
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .fade-in { animation: fadeIn 0.3s ease; }
        .fade-in-up { animation: fadeInUp 0.4s ease; }
        .slide-in-right { animation: slideInRight 0.3s ease-out; }
        .slide-in-up { animation: slideInUp 0.3s ease; }
        .pulse { animation: pulse 1.5s infinite; }
        .skeleton {
          background: linear-gradient(90deg, #f0ebe3 25%, #f8f4ef 50%, #f0ebe3 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>
      <Routes>
        <Route path="/" element={<CatalogueMiel />} />
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
    </div>
  );
}

export default App;
