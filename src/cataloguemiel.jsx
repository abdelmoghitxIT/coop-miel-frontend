import { useState, useMemo, useEffect } from "react";
import FormulaireCommande from './FormulaireCommande';
import { useLangue } from './LangueContext';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const CATEGORIES = (t) => [
  { id: "tous", label: t.tousLesProduits },
  { id: "miels", label: t.miels },
  { id: "pollen", label: t.pollen },
  { id: "cire & propolis", label: t.cire },
  { id: "coffrets", label: t.coffrets },
];

function CarteProduit({ produit, onAjouterPanier, onVoirProduit, t, isAr }) {
  const [ajoute, setAjoute] = useState(false);

  const handleAjouter = (e) => {
    e.stopPropagation();
    onAjouterPanier(produit);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1500);
  };

  const stockFaible = produit.stock_quantite < 10;

  return (
    <div
      onClick={() => onVoirProduit && onVoirProduit(produit.id)}
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f0ebe3",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(180,120,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <div style={{
        height: "160px",
        background: "repeating-linear-gradient(45deg,#fef9ee,#fef9ee 10px,#fdf3d8 10px,#fdf3d8 20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "52px",
        overflow: "hidden",
      }}>
        {produit.images && produit.images[0] ? (
          <img
            src={produit.images[0]}
            alt={produit.nom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <>
            {produit.categorie_nom?.toLowerCase().includes("miel") && "🍯"}
            {produit.categorie_nom?.toLowerCase().includes("pollen") && "🌼"}
            {produit.categorie_nom?.toLowerCase().includes("cire") && "🕯️"}
            {produit.categorie_nom?.toLowerCase().includes("coffret") && "🎁"}
          </>
        )}
      </div>

      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1c1008", lineHeight: "1.3", textAlign: isAr ? "right" : "left" }}>
          {produit.nom}
        </h3>

        <p style={{ margin: 0, fontSize: "13px", color: "#6b6055", lineHeight: "1.6", flex: 1, textAlign: isAr ? "right" : "left" }}>
          {produit.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: isAr ? "row-reverse" : "row" }}>
          <span style={{ fontSize: "22px", fontWeight: "800", color: "#92400e" }}>
            {Number(produit.prix).toLocaleString("fr-DZ")} DA
          </span>
          <span style={{
            fontSize: "11px",
            color: stockFaible ? "#dc2626" : "#16a34a",
            background: stockFaible ? "#fee2e2" : "#dcfce7",
            padding: "2px 8px", borderRadius: "20px", fontWeight: "600",
          }}>
            {stockFaible ? t.reste + " " + produit.stock_quantite : t.enStock}
          </span>
        </div>

        <button
          onClick={handleAjouter}
          disabled={produit.stock_quantite === 0}
          style={{
            width: "100%", padding: "11px", borderRadius: "10px", border: "none",
            cursor: produit.stock_quantite === 0 ? "not-allowed" : "pointer",
            fontWeight: "700", fontSize: "14px", transition: "all 0.2s",
            background: ajoute ? "#16a34a" : produit.stock_quantite === 0 ? "#e5e7eb" : "#b45309",
            color: produit.stock_quantite === 0 ? "#9ca3af" : "white",
            fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
          }}
        >
          {ajoute ? t.ajoute : produit.stock_quantite === 0 ? t.rupture : t.ajouterPanier}
        </button>
      </div>
    </div>
  );
}

function Panier({ items, onFermer, utilisateur, onDemanderConnexion, onCommander, t, isAr }) {
  const total = items.reduce((sum, item) => sum + Number(item.prix) * item.qte, 0);

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "360px",
      background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
      zIndex: 1000, display: "flex", flexDirection: "column",
      direction: isAr ? "rtl" : "ltr",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
    }}>
      <div style={{ padding: "24px", borderBottom: "1px solid #f0ebe3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1c1008" }}>{t.votrePanier}</h2>
        <button onClick={onFermer} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6b6055" }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#a8977f" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍯</div>
            <p style={{ margin: 0, fontSize: "15px" }}>{t.panierVide}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #f8f4ef", alignItems: "center" }}>
              <div style={{ fontSize: "28px", width: "44px", height: "44px", background: "#fef9ee", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : "🍯"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1c1008" }}>{item.nom}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#a8977f" }}>{Number(item.prix).toLocaleString()} DA × {item.qte}</p>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#92400e" }}>
                {(Number(item.prix) * item.qte).toLocaleString()} DA
              </span>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div style={{ padding: "20px", borderTop: "1px solid #f0ebe3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "15px", color: "#6b6055" }}>{t.total}</span>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "#92400e" }}>{total.toLocaleString()} DA</span>
          </div>
          <button
            onClick={() => onCommander()}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#b45309", color: "white", fontWeight: "700",
              fontSize: "15px", cursor: "pointer",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            }}
          >
           {t.commander}
          </button>
          <p style={{ textAlign: "center", margin: "10px 0 0", fontSize: "12px", color: "#a8977f" }}>
            {t.livraison}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CatalogueMiel({ utilisateur, onDeconnexion, onDemanderConnexion, onDashboard, onVoirProduit, panier, setPanier, onMesCommandes }){
  const { t, isAr, toggleLangue, langue } = useLangue();
  const [categorieActive, setCategorieActive] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commandeEnCours, setCommandeEnCours] = useState(false);
  
  const [commandeConfirmee, setCommandeConfirmee] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        setProduits(data);
        setChargement(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setChargement(false);
      });
  }, [API_URL]);

  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const existant = prev.find((p) => p.id === produit.id);
      if (existant) {
        return prev.map((p) => p.id === produit.id ? { ...p, qte: p.qte + 1 } : p);
      }
      return [...prev, { ...produit, qte: 1 }];
    });
  };

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) => {
      const matchCat = categorieActive === "tous" ||
        p.categorie_nom?.toLowerCase() === categorieActive.toLowerCase();
      const matchRecherche =
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(recherche.toLowerCase()));
      return matchCat && matchRecherche;
    });
  }, [categorieActive, recherche, produits]);

  const totalPanier = panier.reduce((sum, p) => sum + p.qte, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fdf8f0",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {chargement && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(253,248,240,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, fontSize: "48px" }}>
          🍯
        </div>
      )}

      {/* Navbar */}
      <header style={{
        background: "white", borderBottom: "1px solid #f0ebe3",
        padding: "0 40px", height: "68px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(180,120,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1c1008", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif", lineHeight: 1 }}>
              {t.siteName}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#a57c3a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t.siteSubtitle}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Bouton FR/AR */}
          <div style={{ display: "flex", gap: "3px", background: "#f0ebe3", borderRadius: "8px", padding: "3px" }}>
            <button onClick={() => langue === 'ar' && toggleLangue()} style={{
              padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "700",
              background: langue === 'fr' ? "#b45309" : "transparent",
              color: langue === 'fr' ? "white" : "#6b6055",
            }}>FR</button>
            <button onClick={() => langue === 'fr' && toggleLangue()} style={{
              padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "700",
              background: langue === 'ar' ? "#b45309" : "transparent",
              color: langue === 'ar' ? "white" : "#6b6055",
            }}>AR</button>
          </div>

          {utilisateur ? (
            <>
              <span style={{ fontSize: "14px", color: "#6b6055" }}>
                {t.bonjour}, {utilisateur.nom} 👋
              </span>
              {utilisateur?.role === 'admin' && (
                <button onClick={onDashboard} style={{
                  background: "#78350f", color: "white", border: "none",
                  borderRadius: "8px", padding: "8px 14px", cursor: "pointer",
                  fontSize: "13px", fontWeight: "700",
                  fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
                }}>
                  👑 {t.dashboard}
                </button>
              )}
              <button
  onClick={onMesCommandes}
  style={{
    background: "none", border: "1.5px solid #e5ddd0",
    borderRadius: "8px", padding: "8px 14px", cursor: "pointer",
    fontSize: "13px", color: "#6b6055",
    fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
  }}
>
  {isAr ? "طلباتي 📋" : "📋 Mes commandes"}
</button>

<button
  onClick={onDeconnexion}
  style={{
    background: "none", border: "1.5px solid #e5ddd0",
    borderRadius: "8px", padding: "8px 14px", cursor: "pointer",
    fontSize: "13px", color: "#6b6055",
    fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
  }}
>
  {t.deconnexion}
</button>
            </>
          ) : (
            <button onClick={onDemanderConnexion} style={{
              background: "none", border: "1.5px solid #b45309",
              borderRadius: "8px", padding: "8px 14px", cursor: "pointer",
              fontSize: "13px", color: "#b45309", fontWeight: "600",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            }}>
              {t.seConnecter}
            </button>
          )}

          <button onClick={() => setPanierOuvert(true)} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#b45309", color: "white", border: "none",
            borderRadius: "10px", padding: "10px 18px", cursor: "pointer",
            fontWeight: "700", fontSize: "14px", position: "relative",
            fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
          }}>
            🛒 {t.panier}
            {totalPanier > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-8px",
                background: "#dc2626", color: "white", borderRadius: "50%",
                width: "22px", height: "22px", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "800",
              }}>
                {totalPanier}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)", padding: "60px 40px", textAlign: "center" }}>
        <h2 style={{
          margin: "0 0 12px", fontSize: "38px", fontWeight: "800", color: "white",
          fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
        }}>
          {t.heroTitle}
        </h2>
        <p style={{
          margin: "0 auto", fontSize: "16px", color: "rgba(255,255,255,0.85)",
          maxWidth: "600px", direction: "rtl", fontFamily: "'Amiri', serif", lineHeight: "1.8",
        }}>
          {t.heroSub}
        </p>
      </div>

      {/* Filtres */}
      <div style={{ padding: "28px 40px 0", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <span style={{ position: "absolute", left: isAr ? "auto" : "16px", right: isAr ? "16px" : "auto", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
          <input
            type="text"
            placeholder={t.rechercherProduit}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{
              width: "100%", maxWidth: "480px",
              padding: isAr ? "13px 46px 13px 16px" : "13px 16px 13px 46px",
              borderRadius: "12px", border: "1.5px solid #e5ddd0",
              background: "white", fontSize: "15px", color: "#1c1008", outline: "none",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
              direction: isAr ? "rtl" : "ltr",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px", justifyContent: isAr ? "flex-end" : "flex-start" }}>
          {CATEGORIES(t).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              style={{
                padding: "9px 20px", borderRadius: "30px",
                border: categorieActive === cat.id ? "none" : "1.5px solid #e5ddd0",
                background: categorieActive === cat.id ? "#b45309" : "white",
                color: categorieActive === cat.id ? "white" : "#6b6055",
                fontWeight: "600", fontSize: "14px", cursor: "pointer",
                fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#a8977f", fontWeight: "500", textAlign: isAr ? "right" : "left" }}>
          {produitsFiltres.length} {produitsFiltres.length > 1 ? t.produitsTrouves : t.produitTrouve}
        </p>
      </div>

      {/* Grille produits */}
      <div style={{
        padding: "0 40px 60px", maxWidth: "1200px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px",
      }}>
        {produitsFiltres.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px", color: "#a8977f" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>{t.aucunProduit}</p>
          </div>
        ) : (
          produitsFiltres.map((produit) => (
            <CarteProduit
              key={produit.id}
              produit={produit}
              onAjouterPanier={ajouterAuPanier}
              onVoirProduit={onVoirProduit}
              t={t}
              isAr={isAr}
            />
          ))
        )}
      </div>

      {/* Panier */}
      {panierOuvert && (
        <>
          <div onClick={() => setPanierOuvert(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999 }} />
          <Panier
            items={panier}
            onFermer={() => setPanierOuvert(false)}
            utilisateur={utilisateur}
            onDemanderConnexion={() => { setPanierOuvert(false); onDemanderConnexion(); }}
            onCommander={() => { setPanierOuvert(false); setCommandeEnCours(true); }}
            t={t}
            isAr={isAr}
          />
        </>
      )}

      {/* Formulaire commande */}
      {commandeEnCours && (
        <FormulaireCommande
          panier={panier}
          utilisateur={utilisateur}
          onAnnuler={() => setCommandeEnCours(false)}
          onSuccess={(commande, infoClient) => {
            setCommandeEnCours(false);
            const telClient = infoClient.telephone?.replace(/\s/g, '').replace(/^0/, '213');
            
            const ADMIN_WHATSAPP = "213696242396"; // Ton numéro WhatsApp Admin
            
            const msgAdmin = `🍯 *Nouvelle commande #${commande.id}*\n👤 Client : ${infoClient.nom}\n📞 Téléphone : ${infoClient.telephone}\n📍 Adresse : ${infoClient.adresse}\n💰 Total : ${infoClient.total} DA\n🛒 Produits :\n${infoClient.produits}\n⏳ En attente de confirmation`;
            
            const msgClient = `🍯 *التعاونية الفلاحية لتربية النحل كاويت*\nمرحباً ${infoClient.nom} !\n✅ تم تأكيد طلبك بنجاح\n💰 المجموع : ${infoClient.total} DA\n🚚 سيتم التواصل معك قريباً للتوصيل\nشكراً لثقتكم 🌟`;

            setCommandeConfirmee({
              ...commande,
              msgAdmin: ADMIN_WHATSAPP ? msgAdmin : null,
              adminTel: ADMIN_WHATSAPP,
              msgClient,
              telClient,
            });
            setPanier([]);
          }}
          t={t}
          isAr={isAr}
        />
      )}

      {/* Confirmation commande */}
      {commandeConfirmee && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            background: "white", padding: "40px 20px", borderRadius: "16px",
            textAlign: "center", maxWidth: "400px", width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800", color: "#1c1008" }}>
              {t.commandeConfirmee}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#a8977f" }}>
              {t.commandeDesc}
            </p>

            {/* Bouton WhatsApp Client (Visible uniquement pour les clients / visiteurs) */}
            {utilisateur?.role !== 'admin' && commandeConfirmee?.msgAdmin && (
              <a 
                href={`https://wa.me/${commandeConfirmee.adminTel}?text=${encodeURIComponent(commandeConfirmee.msgAdmin)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                  background: "#25D366", color: "white", fontWeight: "700",
                  fontSize: "14px", cursor: "pointer", marginBottom: "10px",
                  textDecoration: "none",
                }}
              >
                📲 Envoyer à l'admin via WhatsApp
              </a>
            )}

            {/* Bouton WhatsApp Admin (Visible uniquement pour l'administrateur) */}
            {utilisateur?.role === 'admin' && commandeConfirmee?.msgClient && commandeConfirmee?.telClient && (
              <a 
                href={`https://wa.me/${commandeConfirmee.telClient}?text=${encodeURIComponent(commandeConfirmee.msgClient)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                  background: "#25D366", color: "white", fontWeight: "700",
                  fontSize: "14px", cursor: "pointer", marginBottom: "10px",
                  textDecoration: "none",
                }}
              >
                📲 Envoyer confirmation au client
              </a>
            )}

            <button
              onClick={() => setCommandeConfirmee(null)}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                background: "#b45309", color: "white", fontWeight: "700",
                fontSize: "15px", cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {t.continuerAchats}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}