import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLangue } from './LangueContext';
import BeeSpinner from './BeeSpinner';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const STATUTS = {
  en_attente: { label: "En attente", labelAr: "في الانتظار", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "⏳" },
  confirmee: { label: "Confirmée", labelAr: "مؤكدة", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: "✅" },
  en_livraison: { label: "En livraison", labelAr: "قيد التوصيل", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: "🚚" },
  livree: { label: "Livrée", labelAr: "تم التسليم", color: "#16a34a", bg: "rgba(22,163,74,0.1)", icon: "🎉" },
  annulee: { label: "Annulée", labelAr: "ملغاة", color: "#dc2626", bg: "rgba(220,38,38,0.1)", icon: "❌" },
};

export default function MesCommandes() {
  const { utilisateur } = useAuth();
  const { isAr } = useLangue();
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commandeOuverte, setCommandeOuverte] = useState(null);
  const [annulationEnCours, setAnnulationEnCours] = useState(null);

  const annulerCommande = async (id) => {
    if (!window.confirm(isAr ? 'Êtes-vous sûr de vouloir annuler cette commande ?' : 'Es-tu sûr de vouloir annuler cette commande ?')) return;
    setAnnulationEnCours(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/commandes/${id}/annuler`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCommandes((prev) => prev.map((c) => c.id === id ? { ...c, statut: 'annulee' } : c));
      } else {
        alert(data.erreur || (isAr ? 'Erreur lors de l\'annulation' : 'Erreur lors de l\'annulation'));
      }
    } catch {
      alert(isAr ? 'Impossible de contacter le serveur' : 'Impossible de contacter le serveur');
    } finally {
      setAnnulationEnCours(null);
    }
  };

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
      minHeight: "100vh", background: "var(--page-bg)",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap'); *{box-sizing:border-box}`}</style>

      {/* Navbar */}
      <header style={{
        background: "var(--header-bg)", borderBottom: "1px solid rgba(212,168,84,0.15)",
        padding: "0 32px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {isAr ? "طلباتي" : "Mes Commandes"}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--accent)" }}>
              {utilisateur?.nom}
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/')}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          style={{
          background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a", border: "none",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
          fontSize: "13px", fontWeight: "700",
          transition: "all 0.2s",
        }}>
          {isAr ? "العودة إلى الكتالوج →" : "← Retour au catalogue"}
        </button>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        <h2 style={{
          margin: "0 0 24px", fontSize: "24px", fontWeight: "800", color: "var(--text-primary)",
          fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
        }}>
          {isAr ? `مرحباً ${utilisateur?.nom} 👋` : `Bonjour ${utilisateur?.nom} 👋`}
        </h2>

        {chargement ? (
          <BeeSpinner size={48} text={isAr ? "جاري التحميل..." : "Chargement..."} />
        ) : commandes.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--border)",
            animation: "fadeInUp 0.4s ease",
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px", opacity: 0.8 }}>🛒</div>
            <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 8px" }}>
              {isAr ? "لا توجد طلبات بعد" : "Aucune commande pour l'instant"}
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
              {isAr ? "تصفح منتجاتنا وضع طلبك الأول !" : "Parcourez nos produits et passez votre première commande !"}
            </p>
        <button onClick={() => navigate('/')}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              style={{
              marginTop: "24px", background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a",
              border: "none", borderRadius: "10px", padding: "14px 28px",
              cursor: "pointer", fontWeight: "700", fontSize: "14px",
              transition: "all 0.2s",
            }}>
              {isAr ? "تصفح المنتجات 🍯" : "Voir les produits 🍯"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {commandes.map((c, index) => {
              const statut = STATUTS[c.statut] || STATUTS.en_attente;
              const isOpen = commandeOuverte === c.id;
              return (
                <div key={c.id} className="fade-in-up card-glass" style={{
                  background: "var(--card-bg)", borderRadius: "16px",
                  border: "1px solid var(--border)", overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  animationDelay: `${index * 0.05}s`,
                }}
                  onMouseEnter={(e) => { if (!isOpen) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,168,84,0.08)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}>
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
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--text-primary)" }}>
                          {isAr ? `طلب رقم #${c.id}` : `Commande #${c.id}`}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                          {new Date(c.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: isAr ? "row-reverse" : "row" }}>
                      <span style={{
                        padding: "5px 14px", borderRadius: "20px", fontSize: "13px",
                        fontWeight: "700", background: statut.bg, color: statut.color,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}>
                        {isAr ? statut.labelAr : statut.label}
                      </span>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent-light)" }}>
                        {Number(c.total).toLocaleString()} DA
                      </span>
                      <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Détails commande */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px", background: "var(--page-bg)", animation: "fadeInUp 0.25s ease" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        <div style={{ background: "var(--card-bg)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border)" }}>
                          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase" }}>
                            {isAr ? "عنوان التوصيل" : "Adresse de livraison"}
                          </p>
                          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)" }}>
                            {c.adresse_livraison || "—"}
                          </p>
                        </div>
                        <div style={{ background: "var(--card-bg)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border)" }}>
                          <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase" }}>
                            {isAr ? "تاريخ الطلب" : "Date de commande"}
                          </p>
                          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)" }}>
                            {new Date(c.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ")}
                          </p>
                        </div>
                      </div>

                      {/* Tracking Yalidine */}
                      {c.tracking_number && (
                        <div style={{ background: "var(--card-bg)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border)", marginBottom: "12px" }}>
                          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase" }}>
                            {isAr ? "تتبع الشحنة" : "Suivi de livraison"} 🚚
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>
                              {isAr ? "رقم التتبع" : "Tracking"}:
                            </span>
                            <code style={{ fontSize: "14px", fontWeight: "800", color: "var(--accent)", background: "var(--gold-tint)", padding: "2px 10px", borderRadius: "6px" }}>
                              {c.tracking_number}
                            </code>
                            <a
                              href={`https://tracking.yalidine.com/${c.tracking_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                                style={{
                                marginLeft: "auto", fontSize: "12px", fontWeight: "700", color: "#0a0a0a",
                                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", padding: "6px 14px", borderRadius: "8px",
                                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px",
                                transition: "all 0.2s",
                              }}
                            >
                              {isAr ? "تتبع 🚚" : "Suivre 🚚"}
                            </a>
                          </div>
                          {c.yalidine_status && (
                            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                              {isAr ? "الحالة" : "Statut Yalidine"}: <strong>{c.yalidine_status}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bouton annulation */}
                      {['en_attente', 'confirmee'].includes(c.statut) && (
                        <button
                          onClick={() => annulerCommande(c.id)}
                          disabled={annulationEnCours === c.id}
                          onMouseEnter={(e) => { if (annulationEnCours !== c.id) { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(220,38,38,0.25)"; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                          style={{
                            width: "100%", marginBottom: "12px", padding: "10px",
                            borderRadius: "10px", border: "1.5px solid #dc2626",
                            background: annulationEnCours === c.id ? "rgba(220,38,38,0.1)" : "var(--card-bg)",
                            color: "#dc2626", fontWeight: "700", fontSize: "13px",
                            cursor: annulationEnCours === c.id ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.2s",
                          }}
                        >
                          {annulationEnCours === c.id
                            ? (isAr ? "جاري الإلغاء..." : "Annulation en cours...")
                            : (isAr ? "❌ إلغاء الطلب" : "❌ Annuler la commande")}
                        </button>
                      )}

                      {/* Produits */}
                      {c.produits && c.produits[0] && (
                        <div style={{ background: "var(--card-bg)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border)" }}>
                          <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase" }}>
                            {isAr ? "المنتجات" : "Produits commandés"}
                          </p>
                          {c.produits.map((p, i) => p && (
                            <div key={i} style={{
                              display: "flex", justifyContent: "space-between",
                              padding: "6px 0", borderBottom: i < c.produits.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                              flexDirection: isAr ? "row-reverse" : "row",
                            }}>
                              <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                {p.nom} × {p.quantite}
                              </span>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent-light)" }}>
                                {(Number(p.prix) * p.quantite).toLocaleString()} DA
                              </span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", flexDirection: isAr ? "row-reverse" : "row" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                              {isAr ? "المجموع" : "Total"}
                            </span>
                            <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent-light)" }}>
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