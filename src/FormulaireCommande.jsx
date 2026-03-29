import { useState } from "react";

export default function FormulaireCommande({ panier, utilisateur, onAnnuler, onSuccess }) {
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState(utilisateur?.telephone || "");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const total = panier.reduce((sum, item) => sum + Number(item.prix) * item.qte, 0);

  const handleCommander = async () => {
    if (!adresse.trim()) {
      setErreur("Veuillez entrer votre adresse de livraison");
      return;
    }
    if (!telephone.trim()) {
      setErreur("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setChargement(true);
    setErreur("");

    try {
      const res = await fetch("process.env.REACT_APP_API_URL/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: utilisateur.id,
          adresse_livraison: adresse + " — Tél: " + telephone,
          items: panier.map((p) => ({
            id: p.id,
            prix: p.prix,
            quantite: p.qte,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.erreur || "Une erreur est survenue");
      } else {
        onSuccess(data.commande);
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }

    setChargement(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .cmd-input:focus { border-color: #b45309 !important; outline: none; }
      `}</style>

      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "32px",
        width: "100%",
        maxWidth: "480px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{
            margin: 0, fontSize: "22px", fontWeight: "800",
            color: "#1c1008", fontFamily: "'Playfair Display', serif",
          }}>
            Finaliser la commande
          </h2>
          <button onClick={onAnnuler} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6b6055" }}>
            ✕
          </button>
        </div>

        {/* Résumé commande */}
        <div style={{ background: "#fdf8f0", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Récapitulatif
          </p>
          {panier.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe3" }}>
              <span style={{ fontSize: "13px", color: "#1c1008" }}>
                {item.nom} × {item.qte}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#92400e" }}>
                {(Number(item.prix) * item.qte).toLocaleString()} DA
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#1c1008" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#92400e" }}>
              {total.toLocaleString()} DA
            </span>
          </div>
        </div>

        {/* Formulaire livraison */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              Nom complet
            </label>
            <input
              value={utilisateur?.nom || ""}
              disabled
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #e5ddd0", fontSize: "14px",
                background: "#f9f6f1", color: "#a8977f",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              Téléphone
            </label>
            <input
              className="cmd-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="0555 123 456"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #e5ddd0", fontSize: "14px",
                color: "#1c1008", fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              Adresse de livraison
            </label>
            <textarea
              className="cmd-input"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Ex: Rue Larbi Ben M'hidi, Tlemcen"
              rows={3}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "10px",
                border: "1.5px solid #e5ddd0", fontSize: "14px",
                color: "#1c1008", fontFamily: "'DM Sans', sans-serif",
                resize: "none",
              }}
            />
          </div>

          {/* Mode de paiement */}
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "10px", padding: "12px 14px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "20px" }}>💵</span>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#166534" }}>
                Paiement à la livraison
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a" }}>
                Vous payez en cash à la réception de votre commande
              </p>
            </div>
          </div>

          {/* Erreur */}
          {erreur && (
            <div style={{
              background: "#fee2e2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#dc2626",
            }}>
              ⚠️ {erreur}
            </div>
          )}

          {/* Boutons */}
          <button
            onClick={handleCommander}
            disabled={chargement}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: chargement ? "#d4b483" : "#b45309",
              color: "white", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {chargement ? "Envoi en cours..." : "Confirmer la commande"}
          </button>

          <button
            onClick={onAnnuler}
            style={{
              width: "100%", padding: "12px", borderRadius: "12px",
              border: "1.5px solid #e5ddd0", background: "white",
              color: "#6b6055", fontWeight: "600", fontSize: "14px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
