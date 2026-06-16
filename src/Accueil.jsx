import { useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

export default function Accueil() {
  const navigate = useNavigate();
  const { isAr, toggleLangue, langue } = useLangue();

  return (
    <div style={{
      minHeight: "100vh", background: "#fdf8f0",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      {/* Navigation */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 32px", maxWidth: "1200px", margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontWeight: "800", fontSize: "16px", color: "#78350f" }}>
            {isAr ? "كاويت" : "Kawit"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => navigate('/catalogue')} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "14px", color: "#6b6055", fontWeight: "500",
          }}>
            {isAr ? "المنتجات" : "Produits"}
          </button>
          <button onClick={() => navigate('/a-propos')} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "14px", color: "#6b6055", fontWeight: "500",
          }}>
            {isAr ? "من نحن" : "A propos"}
          </button>
          <button onClick={() => navigate('/login')} style={{
            background: "#b45309", color: "white", border: "none",
            borderRadius: "8px", padding: "8px 18px", cursor: "pointer",
            fontSize: "13px", fontWeight: "700",
          }}>
            {isAr ? "دخول" : "Connexion"}
          </button>
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => langue === 'ar' && toggleLangue()} style={{
              padding: "4px 8px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "700",
              background: langue === 'fr' ? "#b45309" : "transparent",
              color: langue === 'fr' ? "white" : "#6b6055",
            }}>FR</button>
            <button onClick={() => langue === 'fr' && toggleLangue()} style={{
              padding: "4px 8px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "700",
              background: langue === 'ar' ? "#b45309" : "transparent",
              color: langue === 'ar' ? "white" : "#6b6055",
            }}>AR</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "1100px", margin: "60px auto 0", padding: "0 32px",
        display: "flex", alignItems: "center", gap: "60px",
        flexDirection: isAr ? "row-reverse" : "row",
        flexWrap: "wrap", justifyContent: "center",
      }}>
        <div style={{ flex: "1 1 400px", textAlign: isAr ? "right" : "left" }}>
          <p style={{
            color: "#b45309", fontWeight: "700", fontSize: "14px",
            letterSpacing: "2px", margin: "0 0 16px", textTransform: "uppercase",
          }}>
            {isAr ? "التعاونية الفلاحية" : "Cooperative Apicole"}
          </p>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: "800",
            color: "#1c1008", margin: "0 0 20px", lineHeight: "1.1",
          }}>
            {isAr ? "كاويت — عسل نقي من تلمسان" : "Kawit — Miel Pur de Tlemcen"}
          </h1>
          <p style={{
            fontSize: "16px", color: "#6b6055", lineHeight: "1.7",
            margin: "0 0 32px", maxWidth: "480px",
          }}>
            {isAr
              ? "عسل طبيعي 100٪ من خلايا نحلنا في تلمسان. جودة تقليدية، نكهة استثنائية."
              : "100% miel naturel de nos ruches a Tlemcen. Qualite artisanale, saveur d'exception."}
          </p>
          <button onClick={() => navigate('/catalogue')} style={{
            background: "#b45309", color: "white", border: "none",
            borderRadius: "12px", padding: "16px 36px", cursor: "pointer",
            fontSize: "16px", fontWeight: "700", boxShadow: "0 4px 14px rgba(180,83,9,0.3)",
            transition: "transform 0.2s",
          }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            {isAr ? "استعرض المنتجات" : "Decouvrir nos produits"}
          </button>
        </div>
        <div style={{
          flex: "1 1 300px", display: "flex", justifyContent: "center",
        }}>
          <div style={{
            width: "clamp(220px, 25vw, 340px)", height: "clamp(220px, 25vw, 340px)",
            borderRadius: "50%", background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 20px 60px rgba(180,83,9,0.15)",
          }}>
            <img src={LOGO_URL} alt="" style={{
              width: "70%", height: "70%", borderRadius: "50%", objectFit: "cover",
            }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: "1100px", margin: "100px auto 0", padding: "0 32px 80px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
      }}>
        {[
          { icon: "🐝", fr: "100% Naturel", ar: "طبيعي 100٪" },
          { icon: "📍", fr: "Producteurs a Tlemcen", ar: "منتجون من تلمسان" },
          { icon: "🏺", fr: "Savoir-faire artisanal", ar: "حرفة تقليدية" },
          { icon: "📦", fr: "Livraison partout en Algerie", ar: "توصيل في جميع أنحاء الجزائر" },
        ].map((f) => (
          <div key={f.fr} style={{
            background: "white", borderRadius: "16px", padding: "28px 20px",
            textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>{f.icon}</div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1c1008" }}>
              {isAr ? f.ar : f.fr}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        background: "#1c1008", padding: "24px 32px", textAlign: "center",
      }}>
        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
          {isAr ? "التعاونية الفلاحية لتربية النحل كاويت — تلمسان" : "Cooperative Apicole Kawit — Tlemcen"}
        </p>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
          &copy; {new Date().getFullYear()} — {isAr ? "جميع الحقوق محفوظة" : "Tous droits reserves"}
        </p>
      </footer>
    </div>
  );
}
