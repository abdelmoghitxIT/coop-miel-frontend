import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';

export default function VerifierEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { t, isAr } = useLangue();
  const [statut, setStatut] = useState("chargement");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const validerEmail = async () => {
      if (!token) {
        setStatut("erreur");
        setMessage(isAr ? "رمز التحقق مفقود." : "Le jeton de vérification (token) est manquant.");
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
          setMessage(data.erreur || (isAr ? "حدث خطأ ما." : "Une erreur est survenue."));
        }
      } catch (err) {
        setStatut("erreur");
        setMessage(t.erreurServeur);
      }
    };

    validerEmail();
  }, [token, navigate, isAr, t]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", justifyContent: "center", 
      alignItems: "center", background: "#fdf8f0", fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white", padding: "40px", borderRadius: "12px", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)", textAlign: "center", maxWidth: "450px"
      }}>
        <h2 style={{ color: "#78350f", margin: "0 0 16px" }}>{t.verificationEmail}</h2>
        
        {statut === "chargement" && (
          <p style={{ color: "#6b6055" }}>{t.verificationEnCours}</p>
        )}

        {statut === "succes" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>✅</p>
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "18px" }}>{message}</p>
            <p style={{ color: "#a8977f", fontSize: "14px" }}>{t.redirectionConnexion}</p>
          </div>
        )}

        {statut === "erreur" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>❌</p>
            <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "18px" }}>{t.lienInvalide}</p>
            <p style={{ color: "#6b6055", fontSize: "14px" }}>{message}</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: "#b45309", color: "white", border: "none", 
                padding: "10px 20px", borderRadius: "8px", cursor: "pointer", marginTop: "15px", fontWeight: "bold"
              }}
            >
              {t.retourConnexion}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
