import { useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
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
      setErreur("Les mots de passe ne correspondent pas.");
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
        setMessage("✅ Votre mot de passe a été réinitialisé ! Redirection...");
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
      alignItems: "center", background: "#fdf8f0", fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white", padding: "40px", borderRadius: "12px", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px"
      }}>
        <h2 style={{ color: "#78350f", margin: "0 0 8px", textAlign: "center" }}>🔑 Nouveau mot de passe</h2>
        <p style={{ color: "#6b6055", textAlign: "center", fontSize: "14px", marginBottom: "24px" }}>
          Choisissez un mot de passe sécurisé (minimum 8 caractères, 1 majuscule, 1 chiffre).
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#1c1008", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
              Nouveau mot de passe
            </label>
            <input 
              type="password" 
              required
              value={nouveauMdp}
              onChange={(e) => setNouveauMdp(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f0ebe3" }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#1c1008", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
              Confirmer le mot de passe
            </label>
            <input 
              type="password" 
              required
              value={confirmationMdp}
              onChange={(e) => setConfirmationMdp(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f0ebe3" }}
            />
          </div>

          {erreur && <p style={{ color: "#dc2626", fontSize: "14px", margin: "0", fontWeight: "bold" }}>⚠️ {erreur}</p>}
          {message && <p style={{ color: "#16a34a", fontSize: "14px", margin: "0", fontWeight: "bold" }}>{message}</p>}

          <button 
            type="submit" 
            disabled={chargement}
            style={{
              background: "#b45309", color: "white", border: "none", 
              padding: "12px", borderRadius: "8px", cursor: "pointer", 
              fontWeight: "bold", fontSize: "16px", marginTop: "8px"
            }}
          >
            {chargement ? "Modification en cours..." : "Enregistrer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
