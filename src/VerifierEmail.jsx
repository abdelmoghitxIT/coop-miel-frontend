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
        alignItems: "center", background: "#0a0a0a", fontFamily: "sans-serif"
      }}>
        <div style={{
          background: "#141414", padding: "40px", borderRadius: "12px", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)", textAlign: "center", maxWidth: "450px",
          border: "1px solid rgba(212,168,84,0.2)",
        }}>
        <h2 style={{ color: "#d4a854", margin: "0 0 16px" }}>{t.verificationEmail}</h2>
        
        {statut === "chargement" && (
          <p style={{ color: "#a09080" }}>{t.verificationEnCours}</p>
        )}

        {statut === "succes" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>✅</p>
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "18px" }}>{message}</p>
            <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "14px" }}>{t.redirectionConnexion}</p>
          </div>
        )}

        {statut === "erreur" && (
          <div>
            <p style={{ fontSize: "48px", margin: "0" }}>❌</p>
            <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "18px" }}>{t.lienInvalide}</p>
            <p style={{ color: "#a09080", fontSize: "14px" }}>{message}</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: "linear-gradient(135deg, #d4a854, #c49a3c)", color: "#0a0a0a", border: "none", 
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
