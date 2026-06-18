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
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px rgba(180,83,9,0.15); }
          50% { box-shadow: 0 0 20px rgba(180,83,9,0.3); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: #f0ebe3; }
          50% { border-color: #d97706; }
        }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #fdf8f0; }
        ::-webkit-scrollbar-thumb { background: #d4b483; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #b45309; }
        ::selection { background: #b45309; color: white; }
        *:focus-visible {
          outline: 2px solid #b45309;
          outline-offset: 2px;
          border-radius: 4px;
        }
        .fade-in { animation: fadeIn 0.4s ease; }
        .fade-in-up { animation: fadeInUp 0.5s ease both; }
        .fade-in-down { animation: fadeInDown 0.4s ease; }
        .slide-in-right { animation: slideInRight 0.35s ease-out both; }
        .slide-in-up { animation: slideInUp 0.4s ease both; }
        .pulse { animation: pulse 1.5s infinite; }
        .float { animation: float 3s ease-in-out infinite; }
        .glow { animation: glow 2s ease-in-out infinite; }
        .scale-in { animation: scaleIn 0.3s ease both; }
        .shimmer-pulse { animation: shimmerPulse 1.8s ease-in-out infinite; }
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(180,83,9,0.12); }
        .skeleton {
          background: linear-gradient(90deg, #f0ebe3 25%, #f8f4ef 50%, #f0ebe3 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .card-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .card-stagger > *:nth-child(2) { animation-delay: 80ms; }
        .card-stagger > *:nth-child(3) { animation-delay: 160ms; }
        .card-stagger > *:nth-child(4) { animation-delay: 240ms; }
        .card-stagger > *:nth-child(5) { animation-delay: 320ms; }
        .card-stagger > *:nth-child(6) { animation-delay: 400ms; }
        .card-stagger > *:nth-child(7) { animation-delay: 480ms; }
        .card-stagger > *:nth-child(8) { animation-delay: 560ms; }
        .card-stagger > *:nth-child(9) { animation-delay: 640ms; }
        .card-stagger > *:nth-child(10) { animation-delay: 720ms; }
        .card-stagger > *:nth-child(11) { animation-delay: 800ms; }
        .card-stagger > *:nth-child(12) { animation-delay: 880ms; }
        @media (max-width: 700px) {
          .r-hide { display: none !important; }
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
