import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const STATUTS = {
  en_attente: { label: "En attente", labelAr: "في الانتظار", color: "#f59e0b", bg: "#fef3c7", icon: "⏳" },
  confirmee: { label: "Confirmée", labelAr: "مؤكدة", color: "#3b82f6", bg: "#eff6ff", icon: "✅" },
  en_livraison: { label: "En livraison", labelAr: "قيد التوصيل", color: "#8b5cf6", bg: "#f5f3ff", icon: "🚚" },
  livree: { label: "Livrée", labelAr: "تم التسليم", color: "#16a34a", bg: "#dcfce7", icon: "🎉" },
  annulee: { label: "Annulée", labelAr: "ملغاة", color: "#dc2626", bg: "#fee2e2", icon: "❌" },
};

export default function MesCommandes({ utilisateur, onRetour, isAr }) {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commandeOuverte, setCommandeOuverte] = useState(null);

  useEffect(() => {
    if (!utilisateur?.id) return;
    fetch(`${API_URL}/api/commandes/client/${utilisateur.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCommandes(Array.isArray(data) ? data : []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [utilisateur]);

  return (
    <div style={{
      minHeight: "100vh", background: "#fdf8f0",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap'); *{box-sizing:border-box}`}</style>

      {/* Navbar */}
      <header style={{
        background: "white", borderBottom: "1px solid #f0ebe3",
        padding: "0 32px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(180,120,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#1c1008", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {isAr ? "طلباتي" : "Mes Commandes"}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#a57c3a" }}>
              {utilisateur?.nom}
            </p>
          </div>
        </div>
        <button onClick={onRetour} style={{
          background: "#b45309", color: "white", border: "none",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
          fontSize: "13px", fontWeight: "700",
        }}>
          {isAr ? "العودة إلى الكتالوج →" : "← Retour au catalogue"}
        </button>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        <h2 style={{
          margin: "0 0 24px", fontSize: "24px", fontWeight: "800", color: "#1c1008",
          fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
        }}>
          {isAr ? `مرحباً ${utilisateur?.nom} 👋` : `Bonjour ${utilisateur?.nom} 👋`}
        </h2>

        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px", fontSize: "40px" }}>🍯</div>
        ) : commandes.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "white", borderRadius: "16px", border: "1px solid #f0ebe3",
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛒</div>
            <p style={{ fontSize: "18px", fontWeight: "700", color: "#1c1008", margin: "0 0 8px" }}>
              {isAr ? "لا توجد طلبات بعد" : "Aucune commande pour l'instant"}
            </p>
            <p style={{ fontSize: "14px", color: "#a8977f", margin: 0 }}>
              {isAr ? "تصفح منتجاتنا وضع طلبك الأول !" : "Parcourez nos produits et passez votre première commande !"}
            </p>
            <button onClick={onRetour} style={{
              marginTop: "20px", background: "#b45309", color: "white",
              border: "none", borderRadius: "10px", padding: "12px 24px",
              cursor: "pointer", fontWeight: "700", fontSize: "14px",
            }}>
              {isAr ? "تصفح المنتجات 🍯" : "Voir les produits 🍯"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {commandes.map((c) => {
              const statut = STATUTS[c.statut] || STATUTS.en_attente;
              const isOpen = commandeOuverte === c.id;
              return (
                <div key={c.id} style={{
                  background: "white", borderRadius: "16px",
                  border: "1px solid #f0ebe3", overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {/* En-tête commande */}
                  <div
                    onClick={() => setCommandeOuverte(isOpen ? null : c.id)}
                    style={{
                      padding: "18px 20px", display: "flex",
                      justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer",
                      flexDirection: isAr ? "row-reverse" : "row",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: isAr ? "row-reverse" : "row" }}>
                      <span style={{ fontSize: "24px" }}>{statut.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1c1008" }}>
                          {isAr ? `طلب رقم #${c.id}` : `Commande #${c.id}`}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#a8977f" }}>
                          {new Date(c.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: isAr ? "row-reverse" : "row" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
                        fontWeight: "700", background: statut.bg, color: statut.color,
                      }}>
                        {isAr ? statut.labelAr : statut.label}
                      </span>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#92400e" }}>
                        {Number(c.total).toLocaleString()} DA
                      </span>
                      <span style={{ fontSize: "18px", color: "#a8977f" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Détails commande */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #f0ebe3", padding: "16px 20px", background: "#fdf8f0" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        <div style={{ background: "white", borderRadius: "10px", padding: "12px", border: "1px solid #f0ebe3" }}>
                          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase" }}>
                            {isAr ? "عنوان التوصيل" : "Adresse de livraison"}
                          </p>
                          <p style={{ margin: 0, fontSize: "13px", color: "#1c1008" }}>
                            {c.adresse_livraison || "—"}
                          </p>
                        </div>
                        <div style={{ background: "white", borderRadius: "10px", padding: "12px", border: "1px solid #f0ebe3" }}>
                          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase" }}>
                            {isAr ? "تاريخ الطلب" : "Date de commande"}
                          </p>
                          <p style={{ margin: 0, fontSize: "13px", color: "#1c1008" }}>
                            {new Date(c.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ")}
                          </p>
                        </div>
                      </div>

                      {/* Produits */}
                      {c.produits && c.produits[0] && (
                        <div style={{ background: "white", borderRadius: "10px", padding: "12px", border: "1px solid #f0ebe3" }}>
                          <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase" }}>
                            {isAr ? "المنتجات" : "Produits commandés"}
                          </p>
                          {c.produits.map((p, i) => p && (
                            <div key={i} style={{
                              display: "flex", justifyContent: "space-between",
                              padding: "6px 0", borderBottom: i < c.produits.length - 1 ? "1px solid #f8f4ef" : "none",
                              flexDirection: isAr ? "row-reverse" : "row",
                            }}>
                              <span style={{ fontSize: "13px", color: "#1c1008" }}>
                                {p.nom} × {p.quantite}
                              </span>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "#92400e" }}>
                                {(Number(p.prix) * p.quantite).toLocaleString()} DA
                              </span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", flexDirection: isAr ? "row-reverse" : "row" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1c1008" }}>
                              {isAr ? "المجموع" : "Total"}
                            </span>
                            <span style={{ fontSize: "16px", fontWeight: "800", color: "#92400e" }}>
                              {Number(c.total).toLocaleString()} DA
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}