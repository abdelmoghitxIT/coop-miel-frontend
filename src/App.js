import { Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
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
  const { theme, toggleTheme } = useTheme();

  const toggleBtnStyle = {
    position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
    width: "48px", height: "48px", borderRadius: "50%",
    border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #d4a854, #c49a3c)",
    color: "#0a0a0a", fontSize: "22px",
    boxShadow: "0 4px 16px rgba(212,168,84,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <button
        onClick={toggleTheme}
        style={toggleBtnStyle}
        title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,168,84,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,168,84,0.3)'; }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <style>{`
        /* ===== CSS VARIABLES — THEMING ===== */
        :root[data-theme="dark"] {
          --page-bg: #0a0a0a;
          --card-bg: #141414;
          --glass-bg: rgba(255,255,255,0.04);
          --glass-hover: rgba(255,255,255,0.07);
          --text-primary: #f5f0e8;
          --text-secondary: #a09080;
          --text-muted: rgba(245,240,232,0.4);
          --accent: #d4a854;
          --accent-light: #e8c97a;
          --accent-dark: #c49a3c;
          --border: rgba(255,255,255,0.06);
          --border-input: rgba(255,255,255,0.1);
          --gold-tint: rgba(212,168,84,0.06);
          --gold-tint-strong: rgba(212,168,84,0.1);
          --header-bg: rgba(10,10,10,0.85);
          --shadow: rgba(0,0,0,0.4);
          --shadow-gold: rgba(212,168,84,0.15);
          --scrollbar-track: #0a0a0a;
          --scrollbar-thumb: rgba(212,168,84,0.3);
        }
        :root[data-theme="light"] {
          --page-bg: #fdf8f0;
          --card-bg: #ffffff;
          --glass-bg: #ffffff;
          --glass-hover: #fef9ee;
          --text-primary: #1c1008;
          --text-secondary: #6b6055;
          --text-muted: #a8977f;
          --accent: #b45309;
          --accent-light: #92400e;
          --accent-dark: #78350f;
          --border: #f0ebe3;
          --border-input: #e5ddd0;
          --gold-tint: #fef9ee;
          --gold-tint-strong: #fdf3d8;
          --header-bg: rgba(255,255,255,0.95);
          --shadow: rgba(0,0,0,0.04);
          --shadow-gold: rgba(180,83,9,0.12);
          --scrollbar-track: #fdf8f0;
          --scrollbar-thumb: #d4b483;
        }

        /* ===== KEYFRAMES ===== */
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
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 12px var(--shadow-gold); }
          50% { box-shadow: 0 0 28px var(--shadow-gold); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmerPulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderGlow {
          0%,100% { border-color: var(--border); }
          50% { border-color: var(--accent); }
        }

        /* ===== RESET & BASE ===== */
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* ===== SCROLLBAR ===== */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
        ::selection { background: var(--accent); color: var(--page-bg); }
        *:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 6px;
        }

        /* ===== UTILITY ANIMATIONS ===== */
        .fade-in { animation: fadeIn 0.4s ease; }
        .fade-in-up { animation: fadeInUp 0.55s ease both; }
        .fade-in-down { animation: fadeInDown 0.4s ease; }
        .slide-in-right { animation: slideInRight 0.35s ease-out both; }
        .slide-in-up { animation: slideInUp 0.4s ease both; }
        .pulse { animation: pulse 1.5s infinite; }
        .float { animation: float 3s ease-in-out infinite; }
        .glow { animation: glow 2.5s ease-in-out infinite; }
        .scale-in { animation: scaleIn 0.35s ease both; }
        .shimmer-pulse { animation: shimmerPulse 1.8s ease-in-out infinite; }

        /* ===== GLASS CARD ===== */
        .card-glass {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .card-glass:hover {
          background: var(--glass-hover);
          border-color: var(--accent);
          opacity: 1;
          box-shadow: 0 12px 40px var(--shadow);
          transform: translateY(-3px);
        }

        /* ===== GLOW BUTTON ===== */
        .btn-gold {
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          font-weight: 700;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .btn-gold:hover {
          background: var(--gold-tint);
          border-color: var(--accent);
          box-shadow: 0 0 24px var(--shadow-gold);
          transform: translateY(-1px);
        }
        .btn-gold-filled {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          border: none;
          color: var(--page-bg);
          font-weight: 700;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .btn-gold-filled:hover {
          box-shadow: 0 4px 20px var(--shadow-gold);
          transform: translateY(-2px);
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border-input);
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.25s ease;
        }
        .btn-ghost:hover {
          border-color: var(--accent);
          color: var(--text-primary);
          background: var(--glass-bg);
        }

        /* ===== TEXT UTILITIES ===== */
        .text-gold { color: var(--accent); }
        .text-light { color: var(--text-primary); }
        .text-muted { color: var(--text-secondary); }
        .text-xxs { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
        .text-xs { font-size: 12px; }
        .text-sm { font-size: 13px; }
        .text-base { font-size: 14px; }
        .text-lg { font-size: 16px; }
        .text-xl { font-size: 20px; }
        .text-2xl { font-size: 24px; }
        .font-display { font-family: 'Playfair Display', 'Amiri', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-amiri { font-family: 'Amiri', serif; }

        /* ===== BORDERS ===== */
        .border-gold { border: 1px solid var(--accent); }
        .border-glass { border: 1px solid var(--border); }
        .border-glow { animation: borderGlow 3s ease-in-out infinite; }

        /* ===== LAYOUT ===== */
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 40px var(--shadow); }
        .skeleton {
          background: linear-gradient(90deg, var(--glass-bg) 25%, var(--glass-hover) 50%, var(--glass-bg) 75%);
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
        .r-hide { display: none !important; }
        @media (max-width: 700px) { .r-hide { display: none !important; } }
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
