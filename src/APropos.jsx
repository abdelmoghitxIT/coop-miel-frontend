import { useNavigate } from 'react-router-dom';
import { useLangue } from './LangueContext';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const INFO = {
  nom_fr: "Coopérative Apicole Kawit",
  nom_ar: "التعاونية الفلاحية لتربية النحل كاويت",
  fondee: "2024",
  membres: "12",
  ruches: "500+",
  wilaya: "Tlemcen",
  commune: "Tlemcen",
  adresse: "Tlemcen, Algérie",
  telephone: "+213 696 242 396",
  email: "coop.nhal.tlemcen@gmail.com",
  description_fr: "La Coopérative Apicole Kawit est une coopérative agricole basée à Tlemcen, spécialisée dans la production de miel et produits de la ruche de haute qualité. Fondée par des apiculteurs passionnés, notre coopérative valorise le savoir-faire local et les richesses naturelles de la région de Tlemcen.",
  description_ar: "التعاونية الفلاحية لتربية النحل كاويت هي تعاونية فلاحية مقرها تلمسان، متخصصة في إنتاج العسل ومنتجات الخلية عالية الجودة. أسسها مربو نحل متحمسون، تعزز تعاونيتنا الخبرة المحلية والثروات الطبيعية لمنطقة تلمسان.",
};

export default function APropos() {
  const navigate = useNavigate();
  const { isAr } = useLangue();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Navbar */}
      <header style={{
        background: "rgba(10,10,10,0.85)", borderBottom: "1px solid rgba(212,168,84,0.15)",
        padding: "0 40px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#f5f0e8", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif", lineHeight: 1 }}>
              {isAr ? INFO.nom_ar : INFO.nom_fr}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#d4a854" }}>
              {isAr ? "تعاونية فلاحية" : "Coopérative Apicole"}
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={{
          background: "linear-gradient(135deg, #d4a854, #c49a3c)", color: "#0a0a0a", border: "none",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
          fontSize: "13px", fontWeight: "700",
          fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
        }}>
          {isAr ? "العودة ←" : "← Retour"}
        </button>
      </header>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #c49a3c 0%, #d4a854 50%, #d4a854 100%)",
        padding: "80px 40px", textAlign: "center",
      }}>
        <img src={LOGO_URL} alt="logo" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)", marginBottom: "20px" }} />
        <h2 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: "800", color: "#f5f0e8", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif" }}>
          {isAr ? INFO.nom_ar : INFO.nom_fr}
        </h2>
        <p style={{ margin: "0 auto", fontSize: "16px", color: "rgba(255,255,255,0.85)", maxWidth: "600px", lineHeight: "1.8", fontFamily: "'Amiri', serif", direction: "rtl" }}>
          لأن صحتكم هي رأس مالنا، اخترنا لكم طريق الأصالة والتميز
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Statistiques */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
          {[
            { icon: "📅", value: INFO.fondee, label: isAr ? "سنة التأسيس" : "Année de fondation" },
            { icon: "👥", value: INFO.membres, label: isAr ? "عضو" : "Membres" },
            { icon: "🐝", value: INFO.ruches, label: isAr ? "خلية نحل" : "Ruches" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#141414", borderRadius: "16px", padding: "24px",
              textAlign: "center", border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#d4a854", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "rgba(245,240,232,0.4)", fontWeight: "600" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Notre histoire */}
        <div style={{ background: "#141414", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 16px", fontSize: "22px", fontWeight: "800", color: "#f5f0e8",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
          }}>
            {isAr ? "🍯 قصتنا" : "🍯 Notre histoire"}
          </h3>
          <p style={{ margin: 0, fontSize: "15px", color: "#a09080", lineHeight: "1.9", fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif" }}>
            {isAr ? INFO.description_ar : INFO.description_fr}
          </p>
        </div>

        {/* Nos valeurs */}
        <div style={{ background: "#141414", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#f5f0e8",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
          }}>
            {isAr ? "💎 قيمنا" : "💎 Nos valeurs"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: "🌿", title: isAr ? "طبيعي 100%" : "100% Naturel", desc: isAr ? "منتجاتنا خالية من أي مواد مضافة" : "Nos produits sont sans additifs ni conservateurs" },
              { icon: "🤝", title: isAr ? "تعاوني" : "Coopératif", desc: isAr ? "نعمل معاً لخير المجتمع" : "Nous travaillons ensemble pour le bien de la communauté" },
              { icon: "✅", title: isAr ? "جودة عالية" : "Qualité garantie", desc: isAr ? "كل منتج يمر بمراقبة صارمة" : "Chaque produit passe par un contrôle strict" },
              { icon: "🌍", title: isAr ? "محلي" : "Local", desc: isAr ? "منتجات من جبال تلمسان الجميلة" : "Produits des montagnes de Tlemcen" },
            ].map((v, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px",
                border: "1px solid rgba(212,168,84,0.15)",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{v.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#f5f0e8", marginBottom: "6px" }}>{v.title}</div>
                <div style={{ fontSize: "13px", color: "#a09080", lineHeight: "1.6" }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nos produits */}
        <div style={{ background: "#141414", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#f5f0e8",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
          }}>
            {isAr ? "🛒 منتجاتنا" : "🛒 Nos produits"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { icon: "🍯", name: isAr ? "العسل" : "Miels" },
              { icon: "🌼", name: isAr ? "حبوب اللقاح" : "Pollen" },
              { icon: "🕯️", name: isAr ? "الشمع" : "Cire" },
              { icon: "🎁", name: isAr ? "علب هدايا" : "Coffrets" },
            ].map((p, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px",
                textAlign: "center", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{p.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#f5f0e8" }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: "linear-gradient(135deg, #c49a3c, #d4a854)", borderRadius: "16px", padding: "32px", color: "#0a0a0a" }}>
          <h3 style={{
            margin: "0 0 20px", fontSize: "22px", fontWeight: "800",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
          }}>
            {isAr ? "📞 تواصل معنا" : "📞 Contactez-nous"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: "📍", label: isAr ? "العنوان" : "Adresse", value: `${INFO.commune}, ${INFO.wilaya}, Algérie` },
              { icon: "📞", label: isAr ? "الهاتف" : "Téléphone", value: INFO.telephone },
              { icon: "📧", label: isAr ? "البريد الإلكتروني" : "Email", value: INFO.email },
              { icon: "💬", label: "WhatsApp", value: INFO.telephone },
            ].map((c, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px",
                display: "flex", gap: "12px", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "20px" }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" }}>{c.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700" }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/${INFO.telephone.replace(/\s/g, '').replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              marginTop: "20px", background: "#25D366", color: "white",
              padding: "12px 24px", borderRadius: "10px", textDecoration: "none",
              fontWeight: "700", fontSize: "14px",
            }}
          >
            📲 {isAr ? "تواصل عبر واتساب" : "Contacter via WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
}