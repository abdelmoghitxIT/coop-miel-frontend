import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifierEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [statut, setStatut] = useState("chargement");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const validerEmail = async () => {
      if (!token) {
        setStatut("erreur");
        setMessage("Le jeton de vérification (token) est manquant.");
        return;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/auth/verifier-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatut("succes");
          setMessage(data.message);
          setTimeout(() => navigate('/login'), 4000);
        } else {
          setStatut("erreur");
          setMessage(data.erreur || "Une erreur est survenue.");
        }
      } catch (err) {
        setStatut("erreur");
        setMessage("Impossible de joindre le serveur.");
      }
    };

    validerEmail();
  }, [token, navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", justifyContent: "center", 
      alignItems: "center", background: "#fdf8f0", fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white", padding: "40px", borderRadius: "12px", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)", textAlign: "center", maxWidth: "450px"
      }}>
        <h2 style={{ color: "#78350f", margin: "0 0 16px" }}>🍯 Coop Nhal Tlemcen</h2>
        
        {statut === "chargement" && (
          <p style={{ color: "#6b6055" }}>🔄 Vérification de votre adresse email en cours...</p>
        )}

        {statut === "succes" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>✅</p>
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "18px" }}>{message}</p>
            <p style={{ color: "#a8977f", fontSize: "14px" }}>Vous allez être redirigé vers la page de connexion...</p>
          </div>
        )}

        {statut === "erreur" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>❌</p>
            <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "18px" }}>Lien invalide ou expiré</p>
            <p style={{ color: "#6b6055", fontSize: "14px" }}>{message}</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: "#b45309", color: "white", border: "none", 
                padding: "10px 20px", borderRadius: "8px", cursor: "pointer", marginTop: "15px", fontWeight: "bold"
              }}
            >
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
