import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara",
  "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf","Tindouf",
  "Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah",
  "In Guezzam","Touggourt","Djanet","El M'Ghair","El Menia",
];

export default function FormulaireCommande({ panier, utilisateur, onAnnuler, onSuccess, t, isAr }) {
  const [nom, setNom] = useState(utilisateur?.nom || "");
  const [telephone, setTelephone] = useState(utilisateur?.telephone || "");
  const [wilaya, setWilaya] = useState("");
  const [adresseDetails, setAdresseDetails] = useState("");
  const [fraisLivraison, setFraisLivraison] = useState(null);
  const [chargementFrais, setChargementFrais] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const sousTotal = panier.reduce((sum, item) => sum + Number(item.prix) * item.qte, 0);
  const frais = fraisLivraison ? Number(fraisLivraison.prix) : 0;
  const total = sousTotal + frais;

  useEffect(() => {
    if (!wilaya) { setFraisLivraison(null); return; }
    setChargementFrais(true);
    fetch(`${API_URL}/api/frais-livraison/${encodeURIComponent(wilaya)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setFraisLivraison(data))
      .catch(() => setFraisLivraison(null))
      .finally(() => setChargementFrais(false));
  }, [wilaya]);

  const handleCommander = async () => {
    if (!nom.trim()) { setErreur("Veuillez entrer votre nom"); return; }
    if (!telephone.trim()) { setErreur("Veuillez entrer votre téléphone"); return; }
    if (!wilaya) { setErreur("Veuillez sélectionner votre wilaya de livraison"); return; }

    setChargement(true);
    setErreur("");

    try {
      const res = await fetch(`${API_URL}/api/commandes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: utilisateur?.id || null,
          nom_client: nom,
          telephone_client: telephone,
          adresse_livraison: `${wilaya}${adresseDetails ? ' - ' + adresseDetails : ''}`,
          wilaya,
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
        const produitsList = panier.map(p => `• ${p.nom} × ${p.qte} = ${(Number(p.prix) * p.qte).toLocaleString()} DA`).join('\n');

onSuccess(data.commande, {
  nom: nom,
  telephone: telephone,
  adresse: `${wilaya}${adresseDetails ? ' - ' + adresseDetails : ''}`,
  total: total.toLocaleString(),
  produits: produitsList,
});
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }
    setChargement(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1.5px solid #e5ddd0", fontSize: "14px",
    color: "#1c1008", outline: "none",
    fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
    direction: isAr ? "rtl" : "ltr",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap');`}</style>

      <div style={{
        background: "white", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
        direction: isAr ? "rtl" : "ltr",
        fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#1c1008" }}>
            {t ? t.finaliserCommande : "Finaliser la commande"}
          </h2>
          <button onClick={onAnnuler} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6b6055" }}>✕</button>
        </div>

        {/* Récapitulatif */}
        <div style={{ background: "#fdf8f0", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {t ? t.recapitulatif : "Récapitulatif"}
          </p>
          {panier.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe3" }}>
              <span style={{ fontSize: "13px", color: "#1c1008" }}>{item.nom} × {item.qte}</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#92400e" }}>
                {(Number(item.prix) * item.qte).toLocaleString()} DA
              </span>
            </div>
          ))}
          {wilaya && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe3" }}>
              <span style={{ fontSize: "13px", color: "#1c1008" }}>
                {t ? t.fraisLivraison || "Frais de livraison" : "Frais de livraison"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#92400e" }}>
                {chargementFrais ? "..." : `${frais.toLocaleString()} DA`}
              </span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#1c1008" }}>
              {t ? t.total : "Total"}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#92400e" }}>
              {total.toLocaleString()} DA
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {t ? t.nomComplet : "Nom complet"} *
            </label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ahmed Benaissa"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {t ? t.telephone : "Téléphone"} *
            </label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="0555 123 456"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {t ? t.adresseLivraison : "Adresse de livraison"} *
            </label>
            <select
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              style={inputStyle}
            >
              <option value="">{t ? t.selectionnezWilaya : "Sélectionnez votre wilaya"}</option>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#a8977f", display: "block", marginBottom: "4px" }}>
              {t ? t.adresseDetails || "Rue, commune (optionnel)" : "Rue, commune (optionnel)"}
            </label>
            <input
              value={adresseDetails}
              onChange={(e) => setAdresseDetails(e.target.value)}
              placeholder="Ex: Rue Larbi Ben M'hidi"
              style={inputStyle}
            />
          </div>

          {/* Paiement */}

          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "10px", padding: "12px 14px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "20px" }}>💵</span>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#166534" }}>
                {t ? t.paiementLivraison : "Paiement à la livraison"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a" }}>
                {t ? t.paiementDesc : "Vous payez en cash à la réception de votre commande"}
              </p>
            </div>
          </div>

          {erreur && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#dc2626" }}>
              ⚠️ {erreur}
            </div>
          )}

          <button
            onClick={handleCommander}
            disabled={chargement}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: chargement ? "#d4b483" : "#b45309",
              color: "white", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
            }}
          >
            {chargement ? (t ? t.envoi : "Envoi en cours...") : (t ? t.confirmerCommande : "Confirmer la commande")}
          </button>

          <button onClick={onAnnuler} style={{
            width: "100%", padding: "12px", borderRadius: "12px",
            border: "1.5px solid #e5ddd0", background: "white",
            color: "#6b6055", fontWeight: "600", fontSize: "14px", cursor: "pointer",
          }}>
            {t ? t.annuler : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}