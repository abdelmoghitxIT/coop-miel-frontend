import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MotDePasseOublie() {
  const { t } = useLangue();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoye(false);
    setChargement(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/mot-de-passe-oublie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnvoye(true);
      } else {
        setErreur(data.erreur || "Une erreur est survenue.");
      }
    } catch {
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  };

  return (
      <div style={{
        minHeight: "100vh", display: "flex", justifyContent: "center",
        alignItems: "center", background: "#0a0a0a", fontFamily: "sans-serif"
      }}>
        <div style={{
          background: "#141414", padding: "40px", borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px",
          textAlign: "center", border: "1px solid rgba(212,168,84,0.2)",
        }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔑</div>
        <h2 style={{ color: "#d4a854", margin: "0 0 8px" }}>{t.motDePasseOublie}</h2>
        <p style={{ color: "#a09080", fontSize: "14px", margin: "0 0 24px" }}>
          {t.saisirEmail}
        </p>

        {envoye ? (
          <div>
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "16px" }}>
              {t.emailEnvoye}
            </p>
            <p style={{ color: "#a09080", fontSize: "14px" }}>
              {t.siCompteExiste}
            </p>
            <button onClick={() => navigate('/login')} style={{
              background: "linear-gradient(135deg, #d4a854, #c49a3c)", color: "#0a0a0a", border: "none",
              padding: "12px 24px", borderRadius: "8px", cursor: "pointer",
              fontWeight: "bold", fontSize: "15px", marginTop: "16px",
            }}>
              {t.retourConnexion}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="email" required placeholder={t.votreEmail}
              value={email} onChange={(e) => { setEmail(e.target.value); setErreur(""); }}
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.1)",
                fontSize: "14px", boxSizing: "border-box", background: "#0a0a0a", color: "#f5f0e8", outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#d4a854"; e.target.style.boxShadow = "0 0 0 3px rgba(212,168,84,0.15)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
            {erreur && <p style={{ color: "#dc2626", fontSize: "14px", margin: "0", fontWeight: "bold" }}>⚠️ {erreur}</p>}
            <button type="submit" disabled={chargement} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: chargement ? "rgba(212,168,84,0.2)" : "linear-gradient(135deg, #d4a854, #c49a3c)", color: "#0a0a0a", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
            }}>
              {chargement ? t.envoi : t.envoyerLien}
            </button>
            <button type="button" onClick={() => navigate('/login')} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#d4a854",
              textDecoration: "underline", marginTop: "8px",
            }}>
              {t.retourConnexion}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
