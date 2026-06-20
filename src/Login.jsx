import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLangue } from './LangueContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login() {
  const { handleConnexion } = useAuth();
  const { t } = useLangue();
  const navigate = useNavigate();
  const [mode, setMode] = useState("connexion");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [form, setForm] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    telephone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreur("");
  };

  const handleSubmit = async () => {
    setChargement(true);
    setErreur("");

    const url =
      mode === "connexion"
        ? `${API_URL}/api/auth/connexion`
        : `${API_URL}/api/auth/inscription`;

    const body =
      mode === "connexion"
        ? { email: form.email, mot_de_passe: form.mot_de_passe }
        : form;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.erreur || "Une erreur est survenue");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
        handleConnexion(data.utilisateur);
        navigate('/');
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }

    setChargement(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--page-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes borderGlow { 0%,100% { border-color: rgba(212,168,84,0.15); box-shadow: 0 8px 40px var(--gold-tint); } 50% { border-color: var(--accent); box-shadow: 0 8px 40px rgba(212,168,84,0.18); } }
        .login-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(212,168,84,0.15) !important; outline: none !important; }
      `}</style>

      <div style={{
        background: "var(--card-bg)",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 8px 40px rgba(212,168,84,0.08)",
        border: "1px solid rgba(212,168,84,0.2)",
        animation: "borderGlow 3s ease-in-out infinite",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img
            src="https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo"
            alt="logo"
            className="float"
            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "8px" }}
          />
          <h1 style={{
            margin: 0, fontSize: "22px", fontWeight: "800",
            color: "var(--text-primary)", fontFamily: "'Playfair Display', serif",
          }}>
            التعاونية الفلاحية لتربية النحل كاويت
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--accent)" }}>
            Coopérative apicole
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--page-bg)",
          borderRadius: "10px", padding: "4px", marginBottom: "24px",
        }}>
          {["connexion", "inscription"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErreur(""); }}
              style={{
                flex: 1, padding: "9px", borderRadius: "8px",
                border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "700", fontSize: "13px",
                transition: "all 0.2s",
                background: mode === m ? "var(--card-bg)" : "transparent",
                color: mode === m ? "var(--accent)" : "var(--text-muted)",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {m === "connexion" ? t.seConnecterBtn : t.sInscrire}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "inscription" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                {t.nomComplet}
              </label>
              <input
                className="login-input"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Ahmed Benaissa"
                style={{
                  width: "100%", padding: "12px 14px",
                  borderRadius: "10px", border: "1.5px solid var(--border-input)",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-primary)", background: "var(--page-bg)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              {t.email}
            </label>
            <input
              className="login-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ahmed@example.com"
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: "10px", border: "1.5px solid var(--border-input)",
                fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-primary)", background: "var(--page-bg)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
            </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              {t.motDePasse}
            </label>
            <input
              className="login-input"
              name="mot_de_passe"
              type="password"
              value={form.mot_de_passe}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: "10px", border: "1.5px solid var(--border-input)",
                fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                color: "var(--text-primary)", background: "var(--page-bg)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>

          {mode === "connexion" && (
            <button type="button" onClick={() => navigate('/mot-de-passe-oublie')} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", color: "var(--accent)", fontWeight: "600",
              textAlign: "right", padding: "4px 0 0",
              fontFamily: "'DM Sans', sans-serif",
              alignSelf: "flex-end",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}>
              {t.motDePasseOublie}
            </button>
          )}

          {mode === "inscription" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                {t.telephone}
              </label>
              <input
                className="login-input"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="0555 123 456"
                style={{
                  width: "100%", padding: "12px 14px",
                  borderRadius: "10px", border: "1.5px solid var(--border-input)",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-primary)", background: "var(--page-bg)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
            </div>
          )}

          {erreur && (
            <div style={{
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#dc2626",
              fontFamily: "'DM Sans', sans-serif",
              animation: "fadeIn 0.25s ease",
            }}>
              ⚠️ {erreur}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={chargement}
            onMouseDown={(e) => { if (!chargement) e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            style={{
              width: "100%", padding: "13px",
              borderRadius: "10px", border: "none",
              background: chargement ? "rgba(212,168,84,0.2)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              color: "#0a0a0a", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s, transform 0.1s",
              marginTop: "4px",
            }}
          >
            {chargement
              ? t.chargement
              : mode === "connexion"
              ? t.seConnecterBtn
              : t.creerCompte}
          </button>
        </div>

        <div style={{
          textAlign: "center", margin: "20px 0 0",
          fontSize: "12px", color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: "1.6",
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "14px", color: "var(--text-muted)",
              textDecoration: "underline", display: "block",
              margin: "0 auto 12px",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            {t.retourAccueil}
          </button>
          {t.membreCooperative}<br />
          {t.contactAdmin}
        </div>
      </div>
    </div>
  );
}