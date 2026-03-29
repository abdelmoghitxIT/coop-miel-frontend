import { useState } from "react";

export default function Login({ onConnexion, onAnnuler }) {
  const [mode, setMode] = useState("connexion"); // "connexion" ou "inscription"
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
        ? "http://localhost:5000/api/auth/connexion"
        : "http://localhost:5000/api/auth/inscription";

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
        onConnexion(data.utilisateur);
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }

    setChargement(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .login-input:focus { border-color: #b45309 !important; outline: none; }
      `}</style>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 8px 40px rgba(180,120,0,0.12)",
          border: "1px solid #f0ebe3",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🍯</div>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "800",
              color: "#1c1008",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Nhal Tlemcen
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#a57c3a" }}>
            Coopérative apicole
          </p>
        </div>

        {/* Tabs connexion / inscription */}
        <div
          style={{
            display: "flex",
            background: "#fdf8f0",
            borderRadius: "10px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          {["connexion", "inscription"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErreur(""); }}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "700",
                fontSize: "13px",
                transition: "all 0.2s",
                background: mode === m ? "white" : "transparent",
                color: mode === m ? "#b45309" : "#a8977f",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {m === "connexion" ? "Se connecter" : "S'inscrire"}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "inscription" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                Nom complet
              </label>
              <input
                className="login-input"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Ahmed Benaissa"
                style={{
                  width: "100%", padding: "12px 14px",
                  borderRadius: "10px", border: "1.5px solid #e5ddd0",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "#1c1008", background: "white",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              Adresse email
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
                borderRadius: "10px", border: "1.5px solid #e5ddd0",
                fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                color: "#1c1008", background: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              Mot de passe
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
                borderRadius: "10px", border: "1.5px solid #e5ddd0",
                fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                color: "#1c1008", background: "white",
              }}
            />
          </div>

          {mode === "inscription" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                Téléphone (optionnel)
              </label>
              <input
                className="login-input"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="0555 123 456"
                style={{
                  width: "100%", padding: "12px 14px",
                  borderRadius: "10px", border: "1.5px solid #e5ddd0",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "#1c1008", background: "white",
                }}
              />
            </div>
          )}

          {/* Message d'erreur */}
          {erreur && (
            <div
              style={{
                background: "#fee2e2", border: "1px solid #fecaca",
                borderRadius: "8px", padding: "10px 14px",
                fontSize: "13px", color: "#dc2626",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ⚠️ {erreur}
            </div>
          )}

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            disabled={chargement}
            style={{
              width: "100%", padding: "13px",
              borderRadius: "10px", border: "none",
              background: chargement ? "#d4b483" : "#b45309",
              color: "white", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s",
              marginTop: "4px",
            }}
          >
            {chargement
              ? "Chargement..."
              : mode === "connexion"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </div>

        {/* Note admin */}
        <p
          style={{
            textAlign: "center", margin: "20px 0 0",
            fontSize: "12px", color: "#a8977f",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: "1.6",
          }}
        >
          {onAnnuler && (
  <button
    onClick={onAnnuler}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      color: "#a8977f",
      textDecoration: "underline",
      display: "block",
      margin: "16px auto 0",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    ← Retour au catalogue
  </button>
)}
          Vous êtes un membre de la coopérative ?<br />
          Contactez l'administrateur pour votre accès.
        </p>
      </div>
    </div>
  );
}
