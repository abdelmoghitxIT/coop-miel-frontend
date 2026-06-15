import { useLangue } from './LangueContext';

const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

// ─── MODIFIE CES INFORMATIONS ───────────────────────────────────────────────
const INFO = {
  nom_fr: "Coopérative Apicole Kawit",
  nom_ar: "التعاونية الفلاحية لتربية النحل كاويت",
  fondee: "____",           // Année de fondation
  membres: "____",          // Nombre de membres
  ruches: "____",           // Nombre de ruches
  wilaya: "Tlemcen",
  commune: "____",          // Commune
  adresse: "____",          // Adresse complète
  telephone: "+213 696 242 396",
  email: "____@gmail.com",  // Email de contact
  description_fr: "____",   // Description en français
  description_ar: "____",   // Description en arabe
};
// ────────────────────────────────────────────────────────────────────────────

export default function APropos({ onRetour }) {
  const { isAr } = useLangue();

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
              {isAr ? INFO.nom_ar : INFO.nom_fr}
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#a57c3a" }}>
              {isAr ? "تعاونية فلاحية" : "Coopérative Apicole"}
            </p>
          </div>
        </div>
        <button onClick={onRetour} style={{
          background: "#b45309", color: "white", border: "none",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
          fontSize: "13px", fontWeight: "700",
          fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
        }}>
          {isAr ? "العودة ←" : "← Retour"}
        </button>
      </header>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
        padding: "80px 40px", textAlign: "center",
      }}>
        <img src={LOGO_URL} alt="logo" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)", marginBottom: "20px" }} />
        <h2 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: "800", color: "white", fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif" }}>
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
              background: "white", borderRadius: "16px", padding: "24px",
              textAlign: "center", border: "1px solid #f0ebe3",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#b45309", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#a8977f", fontWeight: "600" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Notre histoire */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0ebe3", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 16px", fontSize: "22px", fontWeight: "800", color: "#1c1008",
            fontFamily: isAr ? "'Amiri', serif" : "'Playfair Display', serif",
          }}>
            {isAr ? "🍯 قصتنا" : "🍯 Notre histoire"}
          </h3>
          <p style={{ margin: 0, fontSize: "15px", color: "#6b6055", lineHeight: "1.9", fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif" }}>
            {isAr ? INFO.description_ar : INFO.description_fr}
          </p>
        </div>

        {/* Nos valeurs */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0ebe3", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#1c1008",
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
                background: "#fdf8f0", borderRadius: "12px", padding: "16px",
                border: "1px solid #f0ebe3",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{v.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#1c1008", marginBottom: "6px" }}>{v.title}</div>
                <div style={{ fontSize: "13px", color: "#6b6055", lineHeight: "1.6" }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nos produits */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0ebe3", marginBottom: "24px" }}>
          <h3 style={{
            margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#1c1008",
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
                background: "#fdf8f0", borderRadius: "12px", padding: "16px",
                textAlign: "center", border: "1px solid #f0ebe3",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{p.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1c1008" }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: "linear-gradient(135deg, #78350f, #b45309)", borderRadius: "16px", padding: "32px", color: "white" }}>
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