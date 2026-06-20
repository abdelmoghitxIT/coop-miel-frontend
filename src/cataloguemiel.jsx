import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import FormulaireCommande from './FormulaireCommande';
import { useLangue } from './LangueContext';
import { useAuth } from './AuthContext';
import { chargerConfig, getAdminWhatsapp, formaterTelephoneAlgerie, lienWhatsapp, messageNouvelleCommande, messageConfirmationClient } from './utils/whatsapp';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const CATEGORIES = (t) => [
  { id: "tous", label: t.tousLesProduits },
  { id: "miels", label: t.miels },
  { id: "pollen", label: t.pollen },
  { id: "cire & propolis", label: t.cire },
  { id: "coffrets", label: t.coffrets },
  { id: "autres", label: t.autres },
];

const CATEGORIES_SPECIFIQUES = ["miels", "pollen", "cire & propolis", "coffrets"];

function CarteProduit({ produit, onAjouterPanier, t, isAr }) {
  const [ajoute, setAjoute] = useState(false);
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const borderRef = useRef(null);
  const iconRef = useRef(null);
  const btnRef = useRef(null);

  const handleAjouter = (e) => {
    e.stopPropagation();
    onAjouterPanier(produit);
    setAjoute(true);
    if (btnRef.current) {
      btnRef.current.style.transform = "scale(0.93)";
      setTimeout(() => {
        if (btnRef.current) btnRef.current.style.transform = "scale(1)";
      }, 150);
    }
    setTimeout(() => setAjoute(false), 1500);
  };

  const stockFaible = produit.stock_quantite < 10;

  return (
    <div
      className="fade-in-up card-glass"
      onClick={() => navigate(`/produit/${produit.id}`)}
      style={{
        background: "var(--card-bg)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 20px 40px var(--shadow), 0 0 0 1px rgba(212,168,84,0.2)";
        e.currentTarget.style.borderColor = "rgba(212,168,84,0.3)";
        if (imgRef.current) imgRef.current.style.transform = "scale(1.08)";
        if (iconRef.current) iconRef.current.style.transform = "scale(1.15)";
        if (borderRef.current) borderRef.current.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
        e.currentTarget.style.borderColor = "var(--border)";
        if (imgRef.current) imgRef.current.style.transform = "scale(1)";
        if (iconRef.current) iconRef.current.style.transform = "scale(1)";
        if (borderRef.current) borderRef.current.style.transform = "scaleX(0)";
      }}
    >
      <div style={{
        height: "160px",
        background: "repeating-linear-gradient(45deg,var(--gold-tint),var(--gold-tint) 10px,var(--gold-tint-strong) 10px,var(--gold-tint-strong) 20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "52px",
        overflow: "hidden",
        position: "relative",
        borderBottom: "1px solid rgba(212,168,84,0.15)",
      }}>
        <div ref={borderRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, var(--accent-light), var(--accent-dark), transparent)", transform: "scaleX(0)", transition: "transform 0.35s ease", transformOrigin: isAr ? "right" : "left" }} />
        {produit.images && produit.images[0] ? (
          <img
            ref={imgRef}
            src={produit.images[0]}
            alt={produit.nom}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
          />
        ) : (
              <div ref={iconRef} style={{ transition: "transform 0.3s ease", color: "var(--accent)" }}>
            {produit.categorie_nom?.toLowerCase().includes("miel") && "🍯"}
            {produit.categorie_nom?.toLowerCase().includes("pollen") && "🌼"}
            {produit.categorie_nom?.toLowerCase().includes("cire") && "🕯️"}
            {produit.categorie_nom?.toLowerCase().includes("coffret") && "🎁"}
          </div>
        )}
      </div>

      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.3", textAlign: isAr ? "right" : "left" }}>
          {produit.nom}
        </h3>

        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", flex: 1, textAlign: isAr ? "right" : "left" }}>
          {produit.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: isAr ? "row-reverse" : "row" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent-light)" }}>
              {Number(produit.prix).toLocaleString("fr-DZ")}
            </span>
            <span style={{
              fontSize: "11px", fontWeight: "700", color: "var(--accent-light)",
              background: "linear-gradient(135deg, rgba(212,168,84,0.15), rgba(212,168,84,0.3))",
              padding: "1px 6px", borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(212,168,84,0.08)",
            }}>
              DA
            </span>
          </div>
          <span style={{
            fontSize: "11px",
            color: stockFaible ? "#dc2626" : "#1a7a36",
            background: stockFaible ? "rgba(220,38,38,0.15)" : "rgba(22,163,74,0.15)",
            padding: "3px 10px", borderRadius: "20px", fontWeight: "700",
            boxShadow: stockFaible ? "0 0 0 1px rgba(220,38,38,0.2)" : "0 0 0 1px rgba(22,163,74,0.2)",
          }}>
            {stockFaible ? `⚠️ ${t.reste} ${produit.stock_quantite}` : `✓ ${t.enStock}`}
          </span>
        </div>

        <button
          ref={btnRef}
          onClick={handleAjouter}
          disabled={produit.stock_quantite === 0}
          style={{
            width: "100%", padding: "11px", borderRadius: "10px", border: "none",
            cursor: produit.stock_quantite === 0 ? "not-allowed" : "pointer",
            fontWeight: "700", fontSize: "14px", transition: "all 0.2s, transform 0.15s ease",
            background: ajoute ? "#1a7a36" : produit.stock_quantite === 0 ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            color: produit.stock_quantite === 0 ? "var(--text-muted)" : ajoute ? "white" : "#0a0a0a",
            fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            transform: "scale(1)",
          }}
        >
          {ajoute ? `✓ ${t.ajoute}` : produit.stock_quantite === 0 ? t.rupture : `🛒 ${t.ajouterPanier}`}
        </button>
      </div>
    </div>
  );
}

function Panier({ items, onFermer, onCommander, t, isAr }) {
  const total = items.reduce((sum, item) => sum + Number(item.prix) * item.qte, 0);
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "360px",
      background: "var(--card-bg)", boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", flexDirection: "column",
      direction: isAr ? "rtl" : "ltr",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      animation: "slideInRight 0.35s ease-out",
    }}>
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(212,168,84,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "var(--text-primary)" }}>{t.votrePanier}</h2>
        <button onClick={onFermer} className="btn-ghost" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-secondary)", transition: "transform 0.2s, color 0.2s", padding: "4px" }}
          onMouseEnter={(e) => { e.target.style.transform = "rotate(90deg)"; e.target.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "rotate(0)"; e.target.style.color = "var(--text-secondary)"; }}
        >✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <div className="float" style={{ fontSize: "48px", marginBottom: "12px" }}>🍯</div>
            <p style={{ margin: 0, fontSize: "15px" }}>{t.panierVide}</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} style={{
              display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center",
              animation: `fadeInUp 0.3s ease ${idx * 0.06}s both`,
            }}>
              <div style={{ fontSize: "28px", width: "44px", height: "44px", background: "var(--gold-tint)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : "🍯"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{item.nom}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>{Number(item.prix).toLocaleString()} DA × {item.qte}</p>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent-light)" }}>
                {(Number(item.prix) * item.qte).toLocaleString()} DA
              </span>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div style={{ padding: "20px", borderTop: "1px solid rgba(212,168,84,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>{t.total}</span>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent-light)" }}>{total.toLocaleString()} DA</span>
          </div>
          <button
            onClick={() => onCommander()}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a", fontWeight: "700",
              fontSize: "15px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >
           {t.commander}
          </button>
          <p style={{ textAlign: "center", margin: "10px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
            {t.livraison}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CatalogueMiel(){
  const { t, isAr, toggleLangue, langue } = useLangue();
  const { utilisateur, panier, setPanier, handleDeconnexion } = useAuth();
  const navigate = useNavigate();
  const [categorieActive, setCategorieActive] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commandeEnCours, setCommandeEnCours] = useState(false);
  const [commandeConfirmee, setCommandeConfirmee] = useState(null);
  const [menuUtilisateur, setMenuUtilisateur] = useState(false);
  const menuRef = useRef(null);
  const [page, setPage] = useState(1);
  const [produitsParPage] = useState(12);
  const searchIconRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    chargerConfig();
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

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuUtilisateur(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        (categorieActive === "autres"
          ? !CATEGORIES_SPECIFIQUES.some((cat) => p.categorie_nom?.toLowerCase() === cat.toLowerCase())
          : p.categorie_nom?.toLowerCase() === categorieActive.toLowerCase());
      const matchRecherche =
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(recherche.toLowerCase()));
      return matchCat && matchRecherche;
    });
  }, [categorieActive, recherche, produits]);

  const pageCount = Math.ceil(produitsFiltres.length / produitsParPage);
  const produitsAffiches = produitsFiltres.slice((page - 1) * produitsParPage, page * produitsParPage);

  useEffect(() => {
    setPage(1);
  }, [categorieActive, recherche]);

  const totalPanier = panier.reduce((sum, p) => sum + p.qte, 0);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--page-bg)",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; padding: 0; }
        @media (max-width: 700px) {
          .r-hide { display: none !important; }
        }
      `}</style>


      {chargement && (
        <div style={{ padding: "0 40px 60px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px", paddingTop: "200px" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="card-glass" style={{ background: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
              <div className="shimmer-pulse" style={{ height: "160px", background: "var(--border)", borderBottom: "1px solid rgba(212,168,84,0.15)" }} />
              <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="shimmer-pulse" style={{ height: "20px", width: `clamp(120px, ${50 + i * 7}%, ${80 + i * 3}%)`, background: "var(--border)", borderRadius: "6px" }} />
                <div className="shimmer-pulse" style={{ height: "14px", width: "100%", background: "var(--border)", borderRadius: "6px" }} />
                <div className="shimmer-pulse" style={{ height: "14px", width: "75%", background: "var(--border)", borderRadius: "6px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div className="shimmer-pulse" style={{ height: "24px", width: "80px", background: "var(--border)", borderRadius: "6px" }} />
                  <div className="shimmer-pulse" style={{ height: "20px", width: "60px", background: "var(--border)", borderRadius: "20px" }} />
                </div>
                <div className="shimmer-pulse" style={{ height: "40px", width: "100%", background: "var(--border)", borderRadius: "10px", marginTop: "6px" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <header style={{
        background: "var(--header-bg)", borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        padding: "0 clamp(8px, 3vw, 32px)", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px var(--shadow)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 3vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="logo" style={{ width: "clamp(32px, 5vw, 40px)", height: "clamp(32px, 5vw, 40px)", borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <p style={{ margin: 0, fontSize: "clamp(12px, 2vw, 15px)", fontWeight: "800", color: "var(--text-primary)", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif", lineHeight: 1 }}>
                {t.siteName}
              </p>
              <p style={{ margin: 0, fontSize: "clamp(8px, 1.3vw, 10px)", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", opacity: "0.8" }}>
                {t.siteSubtitle}
              </p>
            </div>
          </div>

          <div className="r-hide" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => navigate('/a-propos')} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500", padding: "6px 10px",
            }}>
              {t.aPropos}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 1.5vw, 12px)" }}>
          {/* FR/AR */}
          <div style={{ display: "flex", gap: "2px", background: "var(--border)", borderRadius: "6px", padding: "2px" }}>
            <button onClick={() => langue === 'ar' && toggleLangue()} style={{
                padding: "clamp(3px, 0.8vw, 4px) clamp(5px, 1vw, 8px)", borderRadius: "4px", border: "none", cursor: "pointer",
                fontSize: "clamp(10px, 1.3vw, 11px)", fontWeight: "700",
                background: langue === 'fr' ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "transparent",
                color: langue === 'fr' ? "#0a0a0a" : "var(--text-secondary)",
              }}>FR</button>
            <button onClick={() => langue === 'fr' && toggleLangue()} style={{
                padding: "clamp(3px, 0.8vw, 4px) clamp(5px, 1vw, 8px)", borderRadius: "4px", border: "none", cursor: "pointer",
                fontSize: "clamp(10px, 1.3vw, 11px)", fontWeight: "700",
                background: langue === 'ar' ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "transparent",
                color: langue === 'ar' ? "#0a0a0a" : "var(--text-secondary)",
              }}>AR</button>
          </div>

          {/* Menu utilisateur */}
          {utilisateur ? (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuUtilisateur(!menuUtilisateur)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "none", border: "1.5px solid var(--border-input)",
                  borderRadius: "8px", padding: "clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px)", cursor: "pointer",
                  fontSize: "13px", color: "var(--text-primary)", fontWeight: "600",
                }}
              >
                <span style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "700",
                }}>
                  {utilisateur.nom.charAt(0).toUpperCase()}
                </span>
                <span className="r-hide">{utilisateur.nom.split(' ')[0]}</span>
                <span className="r-hide" style={{ fontSize: "10px", color: "var(--text-muted)" }}>{menuUtilisateur ? "▲" : "▼"}</span>
              </button>

              {menuUtilisateur && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  background: "var(--card-bg)", borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(212,168,84,0.15)", minWidth: "200px",
                  overflow: "hidden", zIndex: 200,
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                      {utilisateur.nom}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>
                      {utilisateur.email}
                    </p>
                  </div>
                  <button onClick={() => { setMenuUtilisateur(false); navigate('/mon-profil'); }} style={{
                    display: "block", width: "100%", padding: "10px 16px", border: "none",
                    background: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-primary)",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.target.style.background = "none"}
                  >
                    👤 {t.monProfil}
                  </button>
                  <button onClick={() => { setMenuUtilisateur(false); navigate('/mes-commandes'); }} style={{
                    display: "block", width: "100%", padding: "10px 16px", border: "none",
                    background: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-primary)",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.target.style.background = "none"}
                  >
                    📋 {t.mesCommandes}
                  </button>
                  {utilisateur?.role === 'admin' && (
                    <button onClick={() => { setMenuUtilisateur(false); navigate('/dashboard'); }} style={{
                      display: "block", width: "100%", padding: "10px 16px", border: "none",
                      background: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-primary)",
                      textAlign: "left", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={(e) => e.target.style.background = "none"}
                    >
                      👑 {t.dashboard}
                    </button>
                  )}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                    <button onClick={() => { setMenuUtilisateur(false); handleDeconnexion(); }} style={{
                      display: "block", width: "100%", padding: "10px 16px", border: "none",
                      background: "none", cursor: "pointer", fontSize: "13px", color: "#dc2626",
                      textAlign: "left", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={(e) => e.target.style.background = "none"}
                    >
                      {t.deconnexion}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-gold" style={{
              background: "transparent", border: "1.5px solid var(--accent)",
              borderRadius: "8px", padding: "clamp(6px, 1.2vw, 8px) clamp(10px, 2vw, 16px)", cursor: "pointer",
              fontSize: "clamp(11px, 1.5vw, 13px)", color: "var(--accent)", fontWeight: "600",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            }}>
              {t.seConnecter}
            </button>
          )}

          {/* Panier */}
          <button onClick={() => setPanierOuvert(true)} className="btn-gold-filled" style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a", border: "none",
            borderRadius: "10px", padding: "clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 18px)", cursor: "pointer",
            fontWeight: "700", fontSize: "14px", position: "relative",
            fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
          }}>
            <span style={{
              width: "26px", height: "26px", borderRadius: "50%",
              background: "rgba(255,255,255,0.25)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "15px", lineHeight: 1, flexShrink: 0,
            }}>🛒</span> <span className="r-hide">{t.panier}</span>
            {totalPanier > 0 && (
              <span key={totalPanier} style={{
                position: "absolute", top: "-8px", right: "-8px",
                background: "#dc2626", color: "white", borderRadius: "50%",
                width: "22px", height: "22px", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "800",
                animation: "scaleIn 0.35s ease",
              }}>
                {totalPanier}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #141008 50%, #1a1208 100%)",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 40px)",
        textAlign: "center", position: "relative",
        overflow: "hidden",
      }}>
        {/* Honeycomb pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `
            repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(255,255,255,0.12) 30px, rgba(255,255,255,0.12) 32px),
            repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(255,255,255,0.12) 30px, rgba(255,255,255,0.12) 32px),
            repeating-linear-gradient(0deg, transparent, transparent 26px, rgba(255,255,255,0.08) 26px, rgba(255,255,255,0.08) 28px)
          `,
        }} />
        {/* Glow effect */}
        <div className="glow" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 50vw, 500px)", height: "clamp(300px, 50vw, 500px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,168,84,0.12) 0%, rgba(212,168,84,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="float" style={{ fontSize: "clamp(48px, 6vw, 64px)", marginBottom: "8px", lineHeight: 1, color: "var(--accent)" }}>🍯</div>
          <h2 style={{
            margin: "0 0 16px",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "800",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
            position: "relative",
            background: "linear-gradient(90deg, var(--accent-light), var(--accent), var(--accent-dark), var(--accent), var(--accent-light))",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 4s linear infinite",
          }}>
            {t.heroTitle}
          </h2>
          <p style={{
            margin: "0 auto", fontSize: "16px", color: "rgba(255,255,255,0.85)",
            maxWidth: "600px", lineHeight: "1.8", position: "relative",
          }}>
            {t.heroSub}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ padding: "36px 40px 0", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "400px" }}>
            <span ref={searchIconRef} style={{ position: "absolute", left: isAr ? "auto" : "16px", right: isAr ? "16px" : "auto", top: "50%", transform: "translateY(-50%)", fontSize: "16px", transition: "transform 0.25s ease, opacity 0.25s ease" }}>🔍</span>
            <input
              type="text"
              placeholder={t.rechercherProduit}
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={{
                width: "100%",
                padding: isAr ? "13px 46px 13px 16px" : "13px 16px 13px 46px",
                borderRadius: "12px", border: "1.5px solid var(--border-input)",
                background: "rgba(255,255,255,0.05)", fontSize: "15px", color: "var(--text-primary)", outline: "none",
                fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
                direction: isAr ? "rtl" : "ltr",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 3px var(--gold-tint-strong), 0 0 0 1px var(--accent)";
                if (searchIconRef.current) searchIconRef.current.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-input)";
                e.target.style.boxShadow = "none";
                if (searchIconRef.current) searchIconRef.current.style.transform = "translateY(-50%) scale(1)";
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>
            {produitsFiltres.length} {produitsFiltres.length > 1 ? t.produitsTrouves : t.produitTrouve}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {CATEGORIES(t).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              style={{
                padding: "9px 20px", borderRadius: "30px",
                border: "1.5px solid",
                borderColor: categorieActive === cat.id ? "transparent" : "var(--border-input)",
                background: categorieActive === cat.id ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "transparent",
                color: categorieActive === cat.id ? "#0a0a0a" : "var(--text-secondary)",
                fontWeight: "600", fontSize: "14px", cursor: "pointer",
                fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                boxShadow: categorieActive === cat.id ? "0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(212,168,84,0.2)" : "none",
              }}
              onMouseEnter={(e) => {
                if (categorieActive !== cat.id) {
                  e.target.style.background = "rgba(212,168,84,0.08)";
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.color = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (categorieActive !== cat.id) {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "var(--border-input)";
                  e.target.style.color = "var(--text-secondary)";
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille produits */}
      <div className="card-stagger" style={{
        padding: "0 40px 60px", maxWidth: "1200px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px",
      }}>
        {produitsFiltres.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", animation: "fadeInUp 0.4s ease" }}>
            <div className="float" style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
            <p style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 6px", color: "var(--text-secondary)" }}>{t.aucunProduit}</p>
            <p style={{ fontSize: "14px", fontWeight: "400", margin: 0, color: "var(--text-muted)" }}>{t.essayerAutreRecherche || "Essayez de modifier vos filtres ou votre recherche"}</p>
          </div>
        ) : (
          produitsAffiches.map((produit) => (
            <CarteProduit
              key={produit.id}
              produit={produit}
              onAjouterPanier={ajouterAuPanier}
              t={t}
              isAr={isAr}
            />
          ))
        )}
      </div>

      {pageCount > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "8px", padding: "0 40px 40px",
          maxWidth: "1200px", margin: "0 auto", fontFamily: "'DM Sans', sans-serif",
        }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px", borderRadius: "8px", border: "none",
              background: page === 1 ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              color: page === 1 ? "var(--text-muted)" : "#0a0a0a",
              fontWeight: "700", fontSize: "13px", cursor: page === 1 ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              boxShadow: page === 1 ? "none" : "0 2px 8px rgba(212,168,84,0.2)",
            }}
            onMouseEnter={(e) => {
              if (page !== 1) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== 1) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(212,168,84,0.2)";
              }
            }}
          >
            ◀
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} style={{ fontSize: "14px", color: "var(--text-muted)", padding: "0 4px" }}>...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: "36px", height: "36px", borderRadius: "8px", border: "none",
                  background: p === page ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "transparent",
                  color: p === page ? "#0a0a0a" : "var(--text-secondary)",
                  fontWeight: "700", fontSize: "14px", cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: p === page ? "0 2px 8px rgba(212,168,84,0.2)" : "none",
                }}
                  onMouseEnter={(e) => {
                    if (p !== page) {
                      e.target.style.background = "var(--gold-tint-strong)";
                      e.target.style.color = "var(--accent)";
                      e.target.style.boxShadow = "0 0 0 1px rgba(212,168,84,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p !== page) {
                      e.target.style.background = "transparent";
                      e.target.style.color = "var(--text-secondary)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            style={{
              padding: "8px 16px", borderRadius: "8px", border: "none",
              background: page === pageCount ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              color: page === pageCount ? "var(--text-muted)" : "#0a0a0a",
              fontWeight: "700", fontSize: "13px", cursor: page === pageCount ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              boxShadow: page === pageCount ? "none" : "0 2px 8px rgba(212,168,84,0.2)",
            }}
            onMouseEnter={(e) => {
              if (page !== pageCount) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(212,168,84,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== pageCount) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(212,168,84,0.2)";
              }
            }}
          >
            ▶
          </button>
        </div>
      )}

      {/* Panier */}
      {panierOuvert && (
        <>
          <div onClick={() => setPanierOuvert(false)} style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 999, animation: "fadeIn 0.3s ease",
          }} />
          <Panier
            items={panier}
            onFermer={() => setPanierOuvert(false)}
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
            const telClient = formaterTelephoneAlgerie(infoClient.telephone);
            const adminTel = getAdminWhatsapp();

            setCommandeConfirmee({
              ...commande,
              msgAdmin: messageNouvelleCommande(commande, infoClient),
              adminTel,
              msgClient: messageConfirmationClient(infoClient),
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
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            background: "var(--card-bg)", padding: "40px 20px", borderRadius: "16px",
            textAlign: "center", maxWidth: "400px", width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
              {t.commandeConfirmee}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--text-muted)" }}>
              {t.commandeDesc}
            </p>

            {(() => {
              const btnStyle = {
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                background: "#25D366", color: "white", fontWeight: "700",
                fontSize: "14px", cursor: "pointer", marginBottom: "10px",
                textDecoration: "none", transition: "opacity 0.2s",
              };
              return (
                <>
                  {utilisateur?.role !== 'admin' && commandeConfirmee?.msgAdmin && (
                    <a href={lienWhatsapp(commandeConfirmee.adminTel, commandeConfirmee.msgAdmin)}
                      target="_blank" rel="noreferrer" style={btnStyle}
                      onMouseEnter={(e) => e.target.style.opacity = "0.85"}
                      onMouseLeave={(e) => e.target.style.opacity = "1"}
                    >
                      📲 {t.envoyerAdminWA}
                    </a>
                  )}
                  {utilisateur?.role === 'admin' && commandeConfirmee?.msgClient && commandeConfirmee?.telClient && (
                    <a href={lienWhatsapp(commandeConfirmee.telClient, commandeConfirmee.msgClient)}
                      target="_blank" rel="noreferrer" style={btnStyle}
                      onMouseEnter={(e) => e.target.style.opacity = "0.85"}
                      onMouseLeave={(e) => e.target.style.opacity = "1"}
                    >
                      📲 {t.envoyerClientWA}
                    </a>
                  )}
                </>
              );
            })()}

            <button
              onClick={() => setCommandeConfirmee(null)}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#0a0a0a", fontWeight: "700",
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
