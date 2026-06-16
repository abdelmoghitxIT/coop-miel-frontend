import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';
import { useAuth } from './AuthContext';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

export default function DetailProduit() {
  const { id: produitId } = useParams();
  const navigate = useNavigate();
  const { t, isAr, toggleLangue, langue } = useLangue();
  const { setPanier } = useAuth();
  const [produit, setProduit] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [photoActive, setPhotoActive] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const [photoAgrandie, setPhotoAgrandie] = useState(false);
  const [zoom, setZoom] = useState(1);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/produits/${produitId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduit(data);
        setChargement(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setChargement(false);
      });
  }, [produitId, API_URL]);

  const handleAjouter = () => {
    setPanier((prev) => {
      const nouveau = [...prev];
      for (let i = 0; i < quantite; i++) {
        const existant = nouveau.find((p) => p.id === produit.id);
        if (existant) {
          existant.qte += 1;
        } else {
          nouveau.push({ ...produit, qte: 1 });
        }
      }
      return nouveau;
    });
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1500);
  };

  if (chargement) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
        🍯
      </div>
    );
  }

  if (!produit) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>❌</div>
          <p style={{ fontSize: "16px", color: "#6b6055", marginTop: "12px" }}>
            {t.produitNonTrouve}
          </p>
          <button onClick={() => navigate('/')} style={{ marginTop: "16px", background: "#b45309", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", cursor: "pointer", fontWeight: "700" }}>
            {t.retourCatalogue}
          </button>
        </div>
      </div>
    );
  }

  const images = produit.images && produit.images.filter(Boolean).length > 0
    ? produit.images.filter(Boolean)
    : [null];

  const iconProduit = produit.categorie_nom?.toLowerCase().includes("miel") ? "🍯"
    : produit.categorie_nom?.toLowerCase().includes("pollen") ? "🌼"
    : produit.categorie_nom?.toLowerCase().includes("cire") ? "🕯️"
    : "🎁";

  const stockFaible = produit.stock_quantite < 10;

  const specs = [
    { label: t.origine, value: produit.origine || "Tlemcen, Algérie" },
    { label: t.recolte, value: produit.recolte || "2025" },
    { label: t.categorie, value: produit.categorie_nom },
    { label: t.conservation, value: t.conservationDesc },
  ];

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
        .img-thumb { transition: all 0.2s; }
        .img-thumb:hover { transform: scale(1.05); }
      `}</style>

      {/* Navbar */}
      <header style={{
        background: "white", borderBottom: "1px solid #f0ebe3",
        padding: "0 40px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(180,120,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1c1008", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif", lineHeight: 1 }}>
              {t.siteName}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#a57c3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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

          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "14px", color: "#b45309", fontWeight: "700",
              display: "flex", alignItems: "center", gap: "6px",
              fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
            }}
          >
            {t.retourCatalogue}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>

          {/* Galerie photos */}
          <div>
            <div style={{
              height: "380px", borderRadius: "16px", overflow: "hidden",
              background: "repeating-linear-gradient(45deg,#fef9ee,#fef9ee 10px,#fdf3d8 10px,#fdf3d8 20px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "12px", border: "1px solid #f0ebe3",
            }}>
              {images[photoActive] ? (
                <img
                  src={images[photoActive]}
                  alt={produit.nom}
                  onClick={() => setPhotoAgrandie(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                />
              ) : (
                <span style={{ fontSize: "100px" }}>{iconProduit}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  className="img-thumb"
                  onClick={() => setPhotoActive(i)}
                  style={{
                    width: "72px", height: "72px", borderRadius: "10px",
                    overflow: "hidden", cursor: "pointer",
                    border: photoActive === i ? "2.5px solid #b45309" : "2px solid #f0ebe3",
                    background: "repeating-linear-gradient(45deg,#fef9ee,#fef9ee 6px,#fdf3d8 6px,#fdf3d8 12px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {img ? (
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "28px" }}>{iconProduit}</span>
                  )}
                </div>
              ))}

              {produit.video_url && (
                <div
                  className="img-thumb"
                  onClick={() => window.open(produit.video_url, '_blank')}
                  style={{
                    width: "72px", height: "72px", borderRadius: "10px",
                    overflow: "hidden", cursor: "pointer",
                    background: "#1c1008", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: "2px solid #f0ebe3", flexDirection: "column", gap: "2px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>▶️</span>
                  <span style={{ fontSize: "9px", color: "white", fontWeight: "700" }}>
                    {t.video}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Infos produit */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <span style={{
              fontSize: "12px", fontWeight: "700", color: "#a57c3a",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {produit.categorie_nom}
            </span>

            <h1 style={{
              margin: 0, fontSize: "28px", fontWeight: "800", color: "#1c1008",
              fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
              lineHeight: "1.3",
            }}>
              {produit.nom}
            </h1>

            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "32px", fontWeight: "800", color: "#92400e" }}>
                {Number(produit.prix).toLocaleString("fr-DZ")} DA
              </span>
              <span style={{ fontSize: "14px", color: "#a8977f" }}>
                / {t.unite}
              </span>
            </div>

            <span style={{
              display: "inline-block", width: "fit-content",
              fontSize: "13px", fontWeight: "700",
              color: produit.stock_quantite === 0 ? "#dc2626" : stockFaible ? "#f59e0b" : "#16a34a",
              background: produit.stock_quantite === 0 ? "#fee2e2" : stockFaible ? "#fef3c7" : "#dcfce7",
              padding: "4px 12px", borderRadius: "20px",
            }}>
              {produit.stock_quantite === 0 ? t.rupture
                : stockFaible ? `⚠️ ${t.reste} ${produit.stock_quantite}`
                : `✓ ${t.enStock} (${produit.stock_quantite})`}
            </span>

            {/* Description */}
            <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #f0ebe3" }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t.description}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#6b6055", lineHeight: "1.7" }}>
                {produit.description || t.descriptionDefaut}
              </p>
            </div>

            {/* Caractéristiques */}
            <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #f0ebe3" }}>
              <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "700", color: "#a57c3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t.caracteristiques}
              </p>
              {specs.map((spec, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: i < specs.length - 1 ? "1px solid #f8f4ef" : "none",
                  flexDirection: isAr ? "row-reverse" : "row",
                }}>
                  <span style={{ fontSize: "13px", color: "#a8977f", fontWeight: "600" }}>{spec.label}</span>
                  <span style={{ fontSize: "13px", color: "#1c1008", fontWeight: "600" }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Quantité */}
            {produit.stock_quantite > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: isAr ? "row-reverse" : "row" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#6b6055" }}>
                  {t.quantite} :
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => setQuantite(q => Math.max(1, q - 1))}
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      border: "1.5px solid #e5ddd0", background: "white",
                      fontSize: "18px", cursor: "pointer", fontWeight: "700",
                      color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >−</button>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#1c1008", minWidth: "30px", textAlign: "center" }}>
                    {quantite}
                  </span>
                  <button
                    onClick={() => setQuantite(q => Math.min(produit.stock_quantite, q + 1))}
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      border: "1.5px solid #e5ddd0", background: "white",
                      fontSize: "18px", cursor: "pointer", fontWeight: "700",
                      color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >+</button>
                </div>
                <span style={{ fontSize: "14px", color: "#a8977f" }}>
                  = {(Number(produit.prix) * quantite).toLocaleString("fr-DZ")} DA
                </span>
              </div>
            )}

            {/* Bouton ajouter */}
            <button
              onClick={handleAjouter}
              disabled={produit.stock_quantite === 0}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: ajoute ? "#16a34a" : produit.stock_quantite === 0 ? "#e5e7eb" : "#b45309",
                color: produit.stock_quantite === 0 ? "#9ca3af" : "white",
                fontWeight: "700", fontSize: "16px",
                cursor: produit.stock_quantite === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
              }}
            >
              {ajoute ? t.ajoute : produit.stock_quantite === 0 ? t.rupture : "🛒 " + t.ajouterPanier}
            </button>

            {/* Livraison */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "10px", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: "10px",
              flexDirection: isAr ? "row-reverse" : "row",
            }}>
              <span style={{ fontSize: "20px" }}>🚚</span>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#166534" }}>
                  {t.livraisonDetail}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a" }}>
                  {t.paiementReception}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {photoAgrandie && (
        <div
          onClick={() => { setPhotoAgrandie(false); setZoom(1); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setPhotoAgrandie(false); setZoom(1); }}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "rgba(255,255,255,0.15)", color: "white", border: "none",
              borderRadius: "50%", width: "44px", height: "44px",
              fontSize: "22px", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontWeight: "700", zIndex: 1,
            }}
          >
            ✕
          </button>
          <div style={{ position: "absolute", bottom: "30px", display: "flex", gap: "12px", zIndex: 1 }}>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(1, z - 0.5)); }}
              style={{
                background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "700", fontSize: "16px",
              }}
            >
              −
            </button>
            <span style={{ color: "white", fontWeight: "600", fontSize: "14px", alignSelf: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.5)); }}
              style={{
                background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "700", fontSize: "16px",
              }}
            >
              +
            </button>
          </div>
          <img
            src={images[photoActive]}
            alt={produit.nom}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "90vh",
              transform: `scale(${zoom})`,
              transition: "transform 0.2s",
              borderRadius: "8px",
              cursor: "zoom-in",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
}