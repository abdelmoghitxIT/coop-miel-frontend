import { useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { t, isAr } = useLangue();
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmationMdp, setConfirmationMdp] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (nouveauMdp !== confirmationMdp) {
      setErreur(isAr ? "كلمتا المرور غير متطابقتين" : "Les mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token, 
          nouveau_mot_de_passe: nouveauMdp 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t.motDePasseReinitialise);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setErreur(data.erreur || "Une erreur est survenue.");
      }
    } catch (err) {
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
          border: "1px solid rgba(212,168,84,0.2)",
        }}>
        <h2 style={{ color: "#d4a854", margin: "0 0 8px", textAlign: "center" }}>{t.nouveauMotDePasse}</h2>
        <p style={{ color: "#a09080", textAlign: "center", fontSize: "14px", marginBottom: "24px" }}>
          {t.choisirMotDePasse}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#f5f0e8", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
              {t.nouveauMotDePasse}
            </label>
            <input 
              type="password" 
              required
              value={nouveauMdp}
              onChange={(e) => setNouveauMdp(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.1)", background: "#0a0a0a", color: "#f5f0e8", outline: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "#d4a854"; e.target.style.boxShadow = "0 0 0 3px rgba(212,168,84,0.15)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#f5f0e8", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
              {t.confirmerMotDePasse}
            </label>
            <input 
              type="password" 
              required
              value={confirmationMdp}
              onChange={(e) => setConfirmationMdp(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.1)", background: "#0a0a0a", color: "#f5f0e8", outline: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "#d4a854"; e.target.style.boxShadow = "0 0 0 3px rgba(212,168,84,0.15)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {erreur && <p style={{ color: "#dc2626", fontSize: "14px", margin: "0", fontWeight: "bold" }}>⚠️ {erreur}</p>}
          {message && <p style={{ color: "#16a34a", fontSize: "14px", margin: "0", fontWeight: "bold" }}>{message}</p>}

          <button 
            type="submit" 
            disabled={chargement}
            style={{
              background: "linear-gradient(135deg, #d4a854, #c49a3c)", color: "#0a0a0a", border: "none", 
              padding: "12px", borderRadius: "8px", cursor: "pointer", 
              fontWeight: "bold", fontSize: "16px", marginTop: "8px"
            }}
          >
            {chargement ? t.modificationEnCours : t.enregistrerMotDePasse}
          </button>
        </form>
      </div>
    </div>
  );
}
