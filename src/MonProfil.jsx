import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLangue } from './LangueContext';
import BeeSpinner from './BeeSpinner';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";
const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","Msila","Mascara",
  "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf","Tindouf",
  "Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal",
  "Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
];

export default function MonProfil() {
  const { handleConnexion } = useAuth();
  const { isAr } = useLangue();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerifie, setEmailVerifie] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [modeEdition, setModeEdition] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [renvoi, setRenvoi] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  // Password change
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [mdpChargement, setMdpChargement] = useState(false);

  useEffect(() => {
    const charger = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch(`${API_URL}/api/auth/moi`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setNom(data.nom || "");
          setWilaya(data.wilaya || "");
          setTelephone(data.telephone || "");
          setEmail(data.email || "");
          setEmailVerifie(data.email_verifie || false);
        } else {
          setErreur(data.erreur || "Erreur de chargement");
        }
      } catch {
        setErreur("Impossible de contacter le serveur.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [navigate]);

  const handleSauvegarder = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");
    setSauvegarde(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/moi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nom, wilaya }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profil mis à jour !");
        handleConnexion(data);
        setModeEdition(false);
      } else {
        setErreur(data.erreur || "Erreur de sauvegarde");
      }
    } catch {
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setSauvegarde(false);
    }
  };

  const handleChangerMotDePasse = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");
    if (nouveauMotDePasse !== confirmerMotDePasse) {
      setErreur(isAr ? "كلمة المرور الجديدة غير متطابقة" : "Les mots de passe ne correspondent pas");
      return;
    }
    setMdpChargement(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/mot-de-passe`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ancien_mot_de_passe: ancienMotDePasse, nouveau_mot_de_passe: nouveauMotDePasse }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(isAr ? "تم تغيير كلمة المرور بنجاح !" : "Mot de passe changé avec succès !");
        setAfficherMdp(false);
        setAncienMotDePasse("");
        setNouveauMotDePasse("");
        setConfirmerMotDePasse("");
      } else {
        setErreur(data.erreur || (isAr ? "خطأ في تغيير كلمة المرور" : "Erreur lors du changement"));
      }
    } catch {
      setErreur(isAr ? "تعذر الاتصال بالخادم" : "Impossible de contacter le serveur.");
    } finally {
      setMdpChargement(false);
    }
  };

  const handleRenvoiVerification = async () => {
    setMessage("");
    setErreur("");
    setRenvoi(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/renvoyer-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Email de vérification renvoyé !");
      } else {
        setErreur(data.erreur || "Erreur lors du renvoi");
      }
    } catch {
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setRenvoi(false);
    }
  };

  if (chargement) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf8f0" }}>
        <BeeSpinner size={48} text={isAr ? "جاري التحميل..." : "Chargement..."} />
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5ddd0",
    fontSize: "14px", color: "#1c1008", background: modeEdition ? "white" : "#f9f6f1",
    boxSizing: "border-box", outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#fdf8f0", fontFamily: isAr ? "'Amiri', serif" : "'DM Sans', sans-serif",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <header style={{
        background: "linear-gradient(135deg, #78350f, #b45309)", padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={LOGO_URL} alt="" style={{ height: "36px", width: "36px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <p style={{ margin: 0, fontWeight: "700", color: "white", fontSize: "14px" }}>
              {isAr ? "التعاونية الفلاحية" : "Mon Profil"}
            </p>
            <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
              Coopérative Apicole Kawit Tlemcen
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={{
          background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "700",
        }}>
          Retour au catalogue
        </button>
      </header>

      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#1c1008", fontSize: "20px", margin: 0 }}>
              {isAr ? "معلومات الحساب" : "Informations du compte"}
            </h2>
            {!modeEdition && (
              <button onClick={() => setModeEdition(true)} style={{
                background: "#b45309", color: "white", border: "none",
                borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
                fontWeight: "600", fontSize: "13px",
              }}>
                ✏️ {isAr ? "تعديل" : "Modifier"}
              </button>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {isAr ? "الاسم الكامل" : "Nom complet"}
            </label>
            <input value={nom} onChange={(e) => setNom(e.target.value)}
              disabled={!modeEdition} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {isAr ? "رقم الهاتف" : "Téléphone"}
            </label>
            <input value={telephone} disabled style={inputStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              {isAr ? "الولاية" : "Wilaya"}
            </label>
            {modeEdition ? (
              <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} style={inputStyle}>
                <option value="">{isAr ? "اختر ولاية" : "Sélectionnez votre wilaya"}</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            ) : (
              <input value={wilaya} disabled style={inputStyle} />
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e5ddd0",
              fontSize: "14px", color: "#6b6055", background: "#f9f6f1",
            }}>
              <span style={{ flex: 1 }}>{email}</span>
              {emailVerifie ? (
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>✅ Vérifié</span>
              ) : (
                <button type="button" onClick={handleRenvoiVerification} disabled={renvoi} style={{
                  fontSize: "12px", color: "#b45309", background: "none", border: "none",
                  cursor: "pointer", fontWeight: "600", textDecoration: "underline", whiteSpace: "nowrap",
                }}>
                  {renvoi ? "..." : "⚠️ Vérifier"}
                </button>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <div style={{ borderTop: "1px solid #f0ebe3", paddingTop: "20px", marginTop: "8px" }}>
            <button onClick={() => setAfficherMdp(!afficherMdp)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "14px", fontWeight: "700", color: "#b45309", fontFamily: "inherit",
            }}>
              🔑 {isAr ? "تغيير كلمة المرور" : "Changer le mot de passe"}
              <span style={{ fontSize: "12px", color: "#a8977f" }}>{afficherMdp ? "▲" : "▼"}</span>
            </button>

            {afficherMdp && (
              <form onSubmit={handleChangerMotDePasse} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
                    {isAr ? "كلمة المرور الحالية" : "Mot de passe actuel"}
                  </label>
                  <input type="password" value={ancienMotDePasse}
                    onChange={(e) => setAncienMotDePasse(e.target.value)}
                    required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
                    {isAr ? "كلمة المرور الجديدة" : "Nouveau mot de passe"}
                  </label>
                  <input type="password" value={nouveauMotDePasse}
                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                    required style={inputStyle}
                    placeholder={isAr ? "8 أحرف، حرف كبير، رقم" : "8 car., 1 maj., 1 chiffre"} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b6055", display: "block", marginBottom: "6px" }}>
                    {isAr ? "تأكيد كلمة المرور الجديدة" : "Confirmer le nouveau mot de passe"}
                  </label>
                  <input type="password" value={confirmerMotDePasse}
                    onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                    required style={inputStyle} />
                </div>
                <button type="submit" disabled={mdpChargement} style={{
                  padding: "12px", borderRadius: "10px", border: "none",
                  background: mdpChargement ? "#d4b483" : "#b45309",
                  color: "white", fontWeight: "700", fontSize: "14px",
                  cursor: mdpChargement ? "not-allowed" : "pointer",
                }}>
                  {mdpChargement ? "..." : (isAr ? "تغيير كلمة المرور" : "Changer le mot de passe")}
                </button>
              </form>
            )}
          </div>

          {message && <p style={{ color: "#16a34a", fontSize: "14px", fontWeight: "bold", margin: "0 0 16px" }}>✅ {message}</p>}
          {erreur && <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "bold", margin: "0 0 16px" }}>⚠️ {erreur}</p>}

          {modeEdition && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setModeEdition(false); setErreur(""); setMessage(""); }} style={{
                flex: 1, padding: "14px", borderRadius: "12px", border: "2px solid #e5ddd0",
                background: "transparent", color: "#6b6055", fontWeight: "600", fontSize: "15px", cursor: "pointer",
              }}>
                {isAr ? "إلغاء" : "Annuler"}
              </button>
              <button type="submit" disabled={sauvegarde} onClick={handleSauvegarder} style={{
                flex: 1, padding: "14px", borderRadius: "12px", border: "none",
                background: sauvegarde ? "#d4b483" : "#b45309", color: "white", fontWeight: "700",
                fontSize: "15px", cursor: sauvegarde ? "not-allowed" : "pointer",
              }}>
                {sauvegarde ? "..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
