import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MotDePasseOublie() {
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
      alignItems: "center", background: "#fdf8f0", fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white", padding: "40px", borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔑</div>
        <h2 style={{ color: "#78350f", margin: "0 0 8px" }}>Mot de passe oublié</h2>
        <p style={{ color: "#6b6055", fontSize: "14px", margin: "0 0 24px" }}>
          Saisissez votre email, nous vous enverrons un lien de réinitialisation.
        </p>

        {envoye ? (
          <div>
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "16px" }}>
              ✅ Email envoyé !
            </p>
            <p style={{ color: "#6b6055", fontSize: "14px" }}>
              Si un compte existe avec cette adresse, vous recevrez un email sous peu.
            </p>
            <button onClick={() => navigate('/login')} style={{
              background: "#b45309", color: "white", border: "none",
              padding: "12px 24px", borderRadius: "8px", cursor: "pointer",
              fontWeight: "bold", fontSize: "15px", marginTop: "16px",
            }}>
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="email" required placeholder="Votre adresse email"
              value={email} onChange={(e) => { setEmail(e.target.value); setErreur(""); }}
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #f0ebe3",
                fontSize: "14px", boxSizing: "border-box",
              }}
            />
            {erreur && <p style={{ color: "#dc2626", fontSize: "14px", margin: "0", fontWeight: "bold" }}>⚠️ {erreur}</p>}
            <button type="submit" disabled={chargement} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#b45309", color: "white", fontWeight: "700", fontSize: "15px",
              cursor: "pointer",
            }}>
              {chargement ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
            <button type="button" onClick={() => navigate('/login')} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#a8977f",
              textDecoration: "underline", marginTop: "8px",
            }}>
              Retour à la connexion
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
