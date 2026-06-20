import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLangue } from './LangueContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { chargerConfig, formaterTelephoneAlgerie, lienWhatsapp, messageStatutCommande } from './utils/whatsapp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from './utils/toast';
import { initCommandesSSE } from './utils/notifications';
import BeeSpinner from './BeeSpinner';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LOGO_URL = "https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo";

const entetesAuth = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

function FormulaireAjoutProduit({ categories, onAjouter, onAnnuler, t, isAr }) {
  const [form, setForm] = useState({
    nom: "", description: "", prix: "", stock_quantite: "", categorie_id: "",
    origine: "", recolte: "",
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState("");
  const categoriesUniques = categories.filter((c, i, arr) =>
    arr.findIndex(x => x.nom.toLowerCase() === c.nom.toLowerCase()) === i
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nom || !form.prix || !form.stock_quantite || !form.categorie_id) {
      setErreur(t.champsObligatoires);
      return;
    }
    if (form.categorie_id === "autre" && !nouvelleCategorie.trim()) {
      setErreur(isAr ? "يرجى إدخال اسم التصنيف الجديد" : "Veuillez saisir le nom de la nouvelle catégorie");
      return;
    }
    setChargement(true);
    setErreur("");
    try {
      let categorieId = form.categorie_id;
      if (form.categorie_id === "autre") {
        const catRes = await fetch(`${API_URL}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entetesAuth() },
          body: JSON.stringify({ nom: nouvelleCategorie.trim() }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          setErreur(catData.erreur || t.erreurAjout);
          setChargement(false);
          return;
        }
        categorieId = catData.id;
      }
      const res = await fetch(`${API_URL}/api/produits`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entetesAuth() },
        body: JSON.stringify({
          nom: form.nom,
          description: form.description,
          prix: Number(form.prix),
          stock_quantite: Number(form.stock_quantite),
          categorie_id: Number(categorieId),
          origine: form.origine || null,
          recolte: form.recolte || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur || t.erreurAjout);
      } else {
        onAjouter(data);
      }
    } catch (err) {
      setErreur(t.erreurServeur);
    }
    setChargement(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1.5px solid var(--border-input)", fontSize: "14px",
    color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", outline: "none",
    background: "var(--card-bg)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)",
    display: "block", marginBottom: "6px",
  };
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(6px)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div className="card-glass" style={{
        background: "var(--card-bg)", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
        animation: "slideInUp 0.3s ease",
        boxShadow: "0 24px 64px var(--shadow)",
        border: "1px solid var(--shadow-gold)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>
            {t.ajouterProduit}
          </h2>
          <button onClick={onAnnuler} className="btn-ghost" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--accent)" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>{t.nomProduit} *</label>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Miel de Sidr" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t.descriptionProduit}</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Description du produit..." rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>{t.prix} *</label>
              <input name="prix" type="number" value={form.prix} onChange={handleChange} placeholder="Ex: 1500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.stock} *</label>
              <input name="stock_quantite" type="number" value={form.stock_quantite} onChange={handleChange} placeholder="Ex: 50" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>{t.origine}</label>
              <input name="origine" value={form.origine} onChange={handleChange} placeholder={isAr ? "تلمسان، الجزائر" : "Tlemcen, Algérie"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.recolte}</label>
              <input name="recolte" value={form.recolte} onChange={handleChange} placeholder="2025" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{isAr ? "التصنيف *" : "Catégorie *"}</label>
            <select name="categorie_id" value={form.categorie_id} onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{t.choisirCategorie}</option>
              {categoriesUniques.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
              <option value="autre">{isAr ? "آخر" : "Autre"}</option>
            </select>
            {form.categorie_id === "autre" && (
              <input
                value={nouvelleCategorie}
                onChange={(e) => setNouvelleCategorie(e.target.value)}
                placeholder={isAr ? "أدخل اسم التصنيف الجديد" : "Saisissez le nom de la nouvelle catégorie"}
                style={{ ...inputStyle, marginTop: "8px" }}
              />
            )}
          </div>

          {erreur && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#ef4444" }}>
              ⚠️ {erreur}
            </div>
          )}

          <button onClick={handleSubmit} disabled={chargement} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: chargement ? "var(--shadow-gold)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            color: "var(--page-bg)", fontWeight: "700", fontSize: "15px",
            cursor: chargement ? "not-allowed" : "pointer",
          }}>
            {chargement ? t.ajoutEnCours : (isAr ? "إضافة المنتج" : "Ajouter le produit")}
          </button>

          <button onClick={onAnnuler} style={{
            width: "100%", padding: "11px", borderRadius: "10px",
            border: "1.5px solid var(--shadow-gold)", background: "transparent",
            color: "var(--accent)", fontWeight: "600", fontSize: "14px", cursor: "pointer",
          }}>
            {t.annuler}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModifierProduit({ produit, categories, onFermer, onMiseAJour, t, isAr }) {
  const [form, setForm] = useState({
    nom: produit.nom || "",
    description: produit.description || "",
    prix: produit.prix || "",
    stock_quantite: produit.stock_quantite || "",
    categorie_id: produit.categorie_id || "",
    origine: produit.origine || "",
    recolte: produit.recolte || "",
    video_url: produit.video_url || "",
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState("");
  const [caracteristiques, setCaracteristiques] = useState([]);
  const [caracLoading, setCaracLoading] = useState(true);
  const [editCarac, setEditCarac] = useState(null);
  const [nouvelleCle, setNouvelleCle] = useState("");
  const [nouvelleValeur, setNouvelleValeur] = useState("");
  const [afficherAjout, setAfficherAjout] = useState(false);

  const categoriesUniques = categories.filter((c, i, arr) =>
    arr.findIndex(x => x.nom.toLowerCase() === c.nom.toLowerCase()) === i
  );

  useEffect(() => {
    fetch(`${API_URL}/api/produits/${produit.id}/caracteristiques`)
      .then((r) => r.json())
      .then((data) => { setCaracteristiques(data); setCaracLoading(false); })
      .catch(() => setCaracLoading(false));
  }, [produit.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nom || !form.prix || !form.stock_quantite) {
      setErreur(t.champsObligatoires);
      return;
    }
    if (form.categorie_id === "autre" && !nouvelleCategorie.trim()) {
      setErreur(isAr ? "يرجى إدخال اسم التصنيف الجديد" : "Veuillez saisir le nom de la nouvelle catégorie");
      return;
    }
    setChargement(true);
    setErreur("");
    try {
      let categorieId = form.categorie_id;
      if (form.categorie_id === "autre") {
        const catRes = await fetch(`${API_URL}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entetesAuth() },
          body: JSON.stringify({ nom: nouvelleCategorie.trim() }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          setErreur(catData.erreur || t.erreurAjout);
          setChargement(false);
          return;
        }
        categorieId = catData.id;
      }
      const res = await fetch(`${API_URL}/api/produits/${produit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...entetesAuth() },
        body: JSON.stringify({
          nom: form.nom,
          description: form.description,
          prix: Number(form.prix),
          stock_quantite: Number(form.stock_quantite),
          categorie_id: Number(categorieId),
          origine: form.origine || null,
          recolte: form.recolte || null,
          video_url: form.video_url || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur || t.erreurModification);
      } else {
        onMiseAJour(data);
        onFermer();
      }
    } catch (err) {
      setErreur(t.erreurServeur);
    }
    setChargement(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1.5px solid var(--border-input)", fontSize: "14px",
    color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", outline: "none",
    background: "var(--card-bg)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)",
    display: "block", marginBottom: "6px",
  };
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(6px)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div className="card-glass" style={{
        background: "var(--card-bg)", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
        animation: "slideInUp 0.3s ease",
        boxShadow: "0 24px 64px var(--shadow)",
        border: "1px solid var(--shadow-gold)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>
            ✏️ {isAr ? `تعديل — ${produit.nom}` : `${t.modifierTitre} — ${produit.nom}`}
          </h2>
          <button onClick={onFermer} className="btn-ghost" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--accent)" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>{t.nomProduit} *</label>
            <input name="nom" value={form.nom} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>{t.descriptionProduit}</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} style={{ ...inputStyle, resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>{t.prix} *</label>
              <input name="prix" type="number" value={form.prix} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.stock} *</label>
              <input name="stock_quantite" type="number" value={form.stock_quantite} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{isAr ? "التصنيف *" : "Catégorie *"}</label>
            <select name="categorie_id" value={form.categorie_id} onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">{t.choisirCategorie}</option>
              {categoriesUniques.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
              <option value="autre">{isAr ? "آخر" : "Autre"}</option>
            </select>
            {form.categorie_id === "autre" && (
              <input
                value={nouvelleCategorie}
                onChange={(e) => setNouvelleCategorie(e.target.value)}
                placeholder={isAr ? "أدخل اسم التصنيف الجديد" : "Saisissez le nom de la nouvelle catégorie"}
                style={{ ...inputStyle, marginTop: "8px" }}
              />
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>{t.origine}</label>
              <input name="origine" value={form.origine} onChange={handleChange} placeholder={isAr ? "تلمسان، الجزائر" : "Tlemcen, Algérie"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.recolte}</label>
              <input name="recolte" value={form.recolte} onChange={handleChange} placeholder="2025" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t.videoUrl}</label>
            <input name="video_url" value={form.video_url} onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {t.caracteristiques}
            </p>
            {caracLoading ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>⏳</p>
            ) : (
              <>
                {caracteristiques.map((carac) => (
                  <div key={carac.id}>
                    {editCarac?.id === carac.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px 0" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input value={editCarac.cle} onChange={(e) => setEditCarac({ ...editCarac, cle: e.target.value })}
                            placeholder={t.cleCaracteristique}
                            style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1.5px solid var(--border-input)", fontSize: "13px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                          <input value={editCarac.valeur} onChange={(e) => setEditCarac({ ...editCarac, valeur: e.target.value })}
                            placeholder={t.valeurCaracteristique}
                            style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1.5px solid var(--border-input)", fontSize: "13px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                        </div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button onClick={async () => {
                            if (!editCarac.cle.trim() || !editCarac.valeur.trim()) return;
                            try {
                              const r = await fetch(`${API_URL}/api/produits/caracteristiques/${carac.id}`, {
                                method: 'PUT', headers: { 'Content-Type': 'application/json', ...entetesAuth() },
                                body: JSON.stringify({ cle: editCarac.cle.trim(), valeur: editCarac.valeur.trim() }),
                              });
                              if (!r.ok) throw new Error();
                              const d = await r.json();
                              setCaracteristiques((prev) => prev.map((c) => c.id === carac.id ? d : c));
                              setEditCarac(null);
                            } catch { alert("Erreur"); }
                          }} style={{
                            background: "#16a34a", color: "white", border: "none", borderRadius: "6px",
                            padding: "5px 12px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
                          }}>{t.enregistrer}</button>
                          <button onClick={() => setEditCarac(null)} style={{
                            background: "var(--text-secondary)", color: "white", border: "none", borderRadius: "6px",
                            padding: "5px 12px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
                          }}>{t.annuler}</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>{carac.cle}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>{carac.valeur}</span>
                          <button onClick={() => setEditCarac({ id: carac.id, cle: carac.cle, valeur: carac.valeur })} style={{
                            background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--accent)", padding: "2px",
                          }}>✏️</button>
                          <button onClick={async () => {
                            try {
                              const r = await fetch(`${API_URL}/api/produits/caracteristiques/${carac.id}`, { method: 'DELETE', headers: { ...entetesAuth() } });
                              if (!r.ok) throw new Error();
                              setCaracteristiques((prev) => prev.filter((c) => c.id !== carac.id));
                            } catch { alert("Erreur"); }
                          }} style={{
                            background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#dc2626", padding: "2px",
                          }}>🗑️</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {caracteristiques.length === 0 && !afficherAjout && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", margin: "8px 0" }}>
                    {t.aucuneCaracteristique}
                  </p>
                )}
                {afficherAjout && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px 0" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input value={nouvelleCle} onChange={(e) => setNouvelleCle(e.target.value)}
                        placeholder={t.cleCaracteristique}
                        style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1.5px solid var(--border-input)", fontSize: "13px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                      <input value={nouvelleValeur} onChange={(e) => setNouvelleValeur(e.target.value)}
                        placeholder={t.valeurCaracteristique}
                        style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1.5px solid var(--border-input)", fontSize: "13px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                    </div>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button onClick={async () => {
                        if (!nouvelleCle.trim() || !nouvelleValeur.trim()) return;
                        try {
                          const r = await fetch(`${API_URL}/api/produits/${produit.id}/caracteristiques`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json', ...entetesAuth() },
                            body: JSON.stringify({ cle: nouvelleCle.trim(), valeur: nouvelleValeur.trim() }),
                          });
                          if (!r.ok) throw new Error();
                          const d = await r.json();
                          setCaracteristiques((prev) => [...prev, d]);
                          setNouvelleCle(""); setNouvelleValeur(""); setAfficherAjout(false);
                        } catch { alert("Erreur"); }
                      }} style={{
                        background: "#16a34a", color: "white", border: "none", borderRadius: "6px",
                        padding: "5px 12px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
                      }}>{t.enregistrer}</button>
                      <button onClick={() => { setAfficherAjout(false); setNouvelleCle(""); setNouvelleValeur(""); }} style={{
                        background: "var(--text-secondary)", color: "white", border: "none", borderRadius: "6px",
                        padding: "5px 12px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
                      }}>{t.annuler}</button>
                    </div>
                  </div>
                )}
                {!afficherAjout && (
                  <button onClick={() => setAfficherAjout(true)} style={{
                    width: "100%", marginTop: "8px", padding: "8px", borderRadius: "8px",
                    border: "1.5px dashed var(--accent)", background: "transparent",
                    color: "var(--accent)", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {t.ajouterCaracteristique}
                  </button>
                )}
              </>
            )}
          </div>

          {erreur && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#ef4444" }}>
              ⚠️ {erreur}
            </div>
          )}

          <button onClick={handleSubmit} disabled={chargement} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: chargement ? "var(--shadow-gold)" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            color: "var(--page-bg)", fontWeight: "700", fontSize: "15px",
            cursor: chargement ? "not-allowed" : "pointer",
          }}>
            {chargement ? (isAr ? "جارٍ التعديل..." : "Modification en cours...") : t.enregistrerModifications}
          </button>

          <button onClick={onFermer} style={{
            width: "100%", padding: "11px", borderRadius: "10px",
            border: "1.5px solid var(--shadow-gold)", background: "transparent",
            color: "var(--accent)", fontWeight: "600", fontSize: "14px", cursor: "pointer",
          }}>
            {t.annuler}
          </button>
        </div>
      </div>
    </div>
  );
}

function GestionPhotos({ produit, onFermer, onMiseAJour, t, isAr }) {
  const [chargement, setChargement] = useState(false);

  const supprimerImage = async (imageUrl) => {
    try {
      const res = await fetch(`${API_URL}/api/produits/${produit.id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...entetesAuth() },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      onMiseAJour(data);
    } catch (err) {
      alert(t.erreurSuppression);
    }
  };

  const ajouterImage = async (files) => {
    setChargement(true);
    try {
      const urls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'zfw84yvz');
        formData.append('folder', 'coop-miel');
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/dvqb5othw/image/upload',
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        urls.push(data.secure_url);
      }
      const res2 = await fetch(`${API_URL}/api/produits/${produit.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...entetesAuth() },
        body: JSON.stringify({ urls }),
      });
      const data2 = await res2.json();
      onMiseAJour(data2);
    } catch (err) {
      alert(t.erreurUpload);
    }
    setChargement(false);
  };

  const images = (produit.images || []).filter(Boolean);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(6px)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div className="card-glass" style={{
        background: "var(--card-bg)", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto",
        animation: "slideInUp 0.3s ease",
        boxShadow: "0 24px 64px var(--shadow)",
        border: "1px solid var(--shadow-gold)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>
            📷 {isAr ? `الصور — ${produit.nom}` : `${t.photosProduit} — ${produit.nom}`}
          </h2>
          <button onClick={onFermer} className="btn-ghost" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--accent)" }}>✕</button>
        </div>

        <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", marginBottom: "12px" }}>
          {`${t.photosActuelles} (${images.length})`}
        </p>

        {images.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", background: "var(--page-bg)", borderRadius: "12px", marginBottom: "20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
            <p style={{ margin: 0, fontSize: "13px" }}>{t.aucunePhoto}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)" }}>
                <img src={img} alt="" style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }} />
                <button
                  onClick={() => supprimerImage(img)}
                  style={{
                    position: "absolute", top: "6px", right: "6px",
                    background: "#dc2626", color: "white", border: "none",
                    borderRadius: "50%", width: "26px", height: "26px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "800",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase", marginBottom: "12px" }}>
          {t.ajouterPhotos}
        </p>

        <label style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "10px", padding: "20px", borderRadius: "12px",
          border: "2px dashed var(--shadow-gold)", cursor: "pointer",
          background: chargement ? "var(--gold-tint)" : "var(--card-bg)",
          color: "var(--accent)", fontWeight: "700", fontSize: "14px",
        }}>
          {chargement ? t.uploadEnCours : t.choisirPhotos}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => ajouterImage(e.target.files)}
            disabled={chargement}
          />
        </label>

        <p style={{ margin: "10px 0 0", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
          {t.formatPhotos}
        </p>

        <button onClick={onFermer} style={{
          width: "100%", marginTop: "16px", padding: "12px", borderRadius: "10px",
          border: "1.5px solid var(--shadow-gold)", background: "transparent",
          color: "var(--accent)", fontWeight: "600", fontSize: "14px", cursor: "pointer",
        }}>
          {t.fermer}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const { t, isAr } = useLangue();

  const STATUTS = [
    { id: "en_attente", label: isAr ? "في الانتظار" : "En attente", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { id: "confirmee", label: isAr ? "مؤكدة" : "Confirmée", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
    { id: "en_livraison", label: isAr ? "قيد التوصيل" : "En livraison", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
    { id: "livree", label: isAr ? "تم التسليم" : "Livrée", color: "#16a34a", bg: "rgba(22,163,74,0.15)" },
    { id: "annulee", label: isAr ? "ملغية" : "Annulée", color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
  ];

  function BadgeStatut({ statut }) {
    const s = STATUTS.find((x) => x.id === statut) || STATUTS[0];
    return (
      <span style={{
        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
        fontWeight: "700", background: s.bg, color: s.color,
      }}>
        {s.label}
      </span>
    );
  }

  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState("commandes");
  const [ajouterProduit, setAjouterProduit] = useState(false);
  const [modifierProduit, setModifierProduit] = useState(null);
  const [gererPhotos, setGererPhotos] = useState(null);
  const [rechercheCommande, setRechercheCommande] = useState("");
  const [pageCommandes, setPageCommandes] = useState(1);
  const [commandesParPage] = useState(20);

  useEffect(() => { chargerConfig(); chargerDonnees(); }, []);

  useEffect(() => {
    if (utilisateur?.role !== 'admin') return;
    const cleanup = initCommandesSSE(utilisateur, (data) => {
      toast(`Nouvelle commande de ${data.nom_client} — ${data.total} DA`, 'info', 6000);
    });
    return () => cleanup();
  }, [utilisateur]);

  const commandesFiltrees = commandes.filter((c) => {
    if (!rechercheCommande) return true;
    const q = rechercheCommande.toLowerCase();
    return String(c.id).includes(q)
      || (c.client_nom || '').toLowerCase().includes(q)
      || (c.client_telephone || '').includes(q)
      || (c.adresse_livraison || '').toLowerCase().includes(q);
  });

  useEffect(() => {
    setPageCommandes(1);
  }, [rechercheCommande]);

  const pageCommandesCount = Math.ceil(commandesFiltrees.length / commandesParPage);
  const commandesAffichees = commandesFiltrees.slice(
    (pageCommandes - 1) * commandesParPage,
    pageCommandes * commandesParPage
  );

  const exporterExcel = () => {
    const data = commandes.map((c) => ({
      'N° Commande': `#${c.id}`,
      'Client': c.client_nom || '—',
      'Téléphone': c.client_telephone || '—',
      'Adresse': c.adresse_livraison || '—',
      'Total (DA)': Number(c.total),
      'Statut': c.statut,
      'Date': new Date(c.created_at).toLocaleDateString('fr-DZ'),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = [
      { wch: 12 }, { wch: 20 }, { wch: 15 },
      { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes');
    XLSX.writeFile(wb, `commandes-nhal-tlemcen-${new Date().toLocaleDateString('fr-DZ').replace(/\//g, '-')}.xlsx`);
  };

  const genererFacture = (c) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const invoiceNum = `INV-${new Date(c.created_at).getFullYear()}-${String(c.id).padStart(5, '0')}`;
    const formatDA = (val) => `${Number(val).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DA`;

    doc.setFillColor(212, 168, 84);
    doc.rect(0, 0, pageWidth, 55, 'F');

    const logoSize = 18;
    const logoX = margin;
    const logoY = 8;
    try {
      doc.addImage(LOGO_URL, 'WEBP', logoX, logoY, logoSize, logoSize, undefined, 'FAST');
    } catch (_e) {
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
      doc.setTextColor(212, 168, 84);
      doc.setFontSize(14);
      doc.text('K', logoX + logoSize / 2, logoY + logoSize / 2 + 5, { align: 'center' });
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('COOPERATIVE APICOLE KAWIT', margin + logoSize + 8, logoY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Tlemcen, Algérie  |  +213 696 242 396', margin + logoSize + 8, logoY + 16);
    doc.text('coop.nhal.tlemcen@gmail.com', margin + logoSize + 8, logoY + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('FACTURE', pageWidth - margin, logoY + 8, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceNum, pageWidth - margin, logoY + 18, { align: 'right' });
    doc.text(`Commande N° ${c.id}`, pageWidth - margin, logoY + 26, { align: 'right' });
    doc.text(`Date : ${new Date(c.created_at).toLocaleDateString('fr-DZ')}`, pageWidth - margin, logoY + 34, { align: 'right' });

    const infoY = 62;
    const boxW = (pageWidth - 2 * margin) / 2 - 5;
    doc.setFillColor(20, 20, 20);
    doc.setDrawColor(60, 60, 60);
    doc.roundedRect(margin, infoY, boxW, 32, 3, 3, 'FD');
    doc.setTextColor(212, 168, 84);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', margin + 8, infoY + 8);
    doc.setTextColor(245, 240, 232);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(c.client_nom || 'Client', margin + 8, infoY + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Tél : ${c.client_telephone || '—'}`, margin + 8, infoY + 26);
    doc.text(`Adr : ${c.adresse_livraison || '—'}`, margin + 8, infoY + 33, { maxWidth: boxW - 16 });

    const detailsX = margin + boxW + 10;
    doc.setFillColor(20, 20, 20);
    doc.setDrawColor(60, 60, 60);
    doc.roundedRect(detailsX, infoY, boxW, 32, 3, 3, 'FD');
    doc.setTextColor(212, 168, 84);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILS FACTURE', detailsX + 8, infoY + 8);
    doc.setTextColor(245, 240, 232);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`N° Facture : ${invoiceNum}`, detailsX + 8, infoY + 18);
    doc.text(`N° Commande : #${c.id}`, detailsX + 8, infoY + 25);
    doc.text(`Statut : ${(c.statut || '').replace(/_/g, ' ').toUpperCase()}`, detailsX + 8, infoY + 32);

    const produitsFiltres = c.produits && c.produits[0] ? c.produits.filter(Boolean) : [];
    autoTable(doc, {
      startY: infoY + 38,
      head: [['#', 'Produit', 'Qté', 'Prix unitaire', 'Total']],
      body: produitsFiltres.length > 0
        ? produitsFiltres.map((p, i) => [
            i + 1,
            p.nom || '—',
            p.quantite || 1,
            formatDA(p.prix),
            formatDA(Number(p.prix) * (p.quantite || 1)),
          ])
        : [['—', 'Produits non disponibles', '—', '—', formatDA(c.total)]],
      headStyles: {
        fillColor: [212, 168, 84],
        textColor: [10, 10, 10],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: { fontSize: 9, textColor: [200, 200, 200] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        2: { halign: 'center', cellWidth: 15 },
        3: { halign: 'right', cellWidth: 35 },
        4: { halign: 'right', cellWidth: 35 },
      },
      alternateRowStyles: { fillColor: [26, 26, 26] },
      styles: { cellPadding: 4 },
    });

    const finalY = doc.lastAutoTable.finalY + 8;
    const total = Number(c.total);

    doc.setDrawColor(60, 60, 60);
    doc.setFillColor(20, 20, 20);
    doc.roundedRect(pageWidth - margin - 80, finalY, 80, 38, 3, 3, 'FD');

    const totX = pageWidth - margin - 72;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text('Sous-total', totX, finalY + 9);
    doc.text('Livraison', totX, finalY + 17);
    doc.text('Total', totX, finalY + 27);

    doc.setTextColor(245, 240, 232);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDA(total), pageWidth - margin - 8, finalY + 9, { align: 'right' });
    doc.text('Gratuite', pageWidth - margin - 8, finalY + 17, { align: 'right' });

    doc.setFillColor(212, 168, 84);
    doc.roundedRect(pageWidth - margin - 80, finalY + 22, 80, 13, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(formatDA(total), pageWidth - margin - 8, finalY + 32, { align: 'right' });

    doc.setTextColor(212, 168, 84);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Merci pour votre confiance !', pageWidth / 2, finalY + 58, { align: 'center' });

    doc.setDrawColor(212, 168, 84);
    doc.setLineWidth(0.5);
    doc.line(margin, 280, pageWidth - margin, 280);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.setFont('helvetica', 'normal');
    doc.text('Cooperative Apicole Kawit — Tlemcen, Algerie — +213 696 242 396', pageWidth / 2, 285, { align: 'center' });

    doc.save(`facture-${invoiceNum}.pdf`);
  };

  const exporterPDF = () => {
    if (commandes.length > 10) {
      if (!window.confirm(isAr ? `سيتم تحميل ${commandes.length} ملف PDF بشكل منفصل. اسمح بالتحميلات المتعددة في المتصفح. هل تريد المتابعة؟` : `Vous allez télécharger ${commandes.length} fichiers PDF séparément. Autorisez les téléchargements multiples sur votre navigateur. Continuer ?`)) {
        return;
      }
    }
    commandes.forEach((c) => genererFacture(c));
  };

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [resCmd, resProd, resCat] = await Promise.all([
        fetch(`${API_URL}/api/commandes`, { headers: { ...entetesAuth() } }),
        fetch(`${API_URL}/api/produits`),
        fetch(`${API_URL}/api/categories`),
      ]);
      const dataCmd = await resCmd.json();
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      setCommandes(Array.isArray(dataCmd) ? dataCmd : []);
      setProduits(Array.isArray(dataProd) ? dataProd : []);
      setCategories(Array.isArray(dataCat) ? dataCat : []);
    } catch (err) {
      console.error("Erreur:", err);
    }
    setChargement(false);
  };

  const stats = {
    totalVentes: commandes.filter((c) => c.statut !== "annulee").reduce((sum, c) => sum + Number(c.total), 0),
    enAttente: commandes.filter((c) => c.statut === "en_attente").length,
    livrees: commandes.filter((c) => c.statut === "livree").length,
    stockFaible: produits.filter((p) => p.stock_quantite < 10).length,
  };

  const changerStatut = async (id, statut) => {
    try {
      await fetch(`${API_URL}/api/commandes/${id}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...entetesAuth() },
        body: JSON.stringify({ statut }),
      });
      setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, statut } : c)));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const supprimerProduit = async (id) => {
    if (!window.confirm(t.confirmerSuppression)) return;
    try {
      await fetch(`${API_URL}/api/produits/${id}`, { method: "DELETE", headers: { ...entetesAuth() } });
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleAjouterProduit = (nouveauProduit) => {
    setProduits((prev) => [...prev, nouveauProduit]);
    setAjouterProduit(false);
  };

  const moisNom = useMemo(() => ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"], []);

  const donneesVentesMensuelles = useMemo(() => {
    const ventesMensuelles = commandes
      .filter(c => c.statut !== "annulee")
      .reduce((acc, c) => {
        const d = new Date(c.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + Number(c.total);
        return acc;
      }, {});
    return Object.entries(ventesMensuelles)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => {
        const [, m] = key.split("-");
        return { mois: `${moisNom[parseInt(m) - 1]}`, ventes: Math.round(total) };
      });
  }, [commandes, moisNom]);

  const commandesParStatut = useMemo(() =>
    STATUTS.map(s => ({
      name: s.label,
      value: commandes.filter(c => c.statut === s.id).length,
      color: s.color,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commandes]);

  const topProduits = useMemo(() => {
    const produitsAggreges = commandes
      .filter(c => c.statut !== "annulee" && c.produits)
      .flatMap(c => c.produits.filter(Boolean))
      .reduce((acc, p) => {
        const nom = p.nom || "Inconnu";
        acc[nom] = (acc[nom] || 0) + (p.quantite || 1);
        return acc;
      }, {});
    return Object.entries(produitsAggreges)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nom, quantite]) => ({ nom, quantite }));
  }, [commandes]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); background: var(--card-bg); position: sticky; top: 0; z-index: 1; }
        td { padding: 14px 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.03); }
        tbody tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
        tbody tr:hover td { background: var(--gold-tint); }
        select { border: 1.5px solid var(--border-input); border-radius: 8px; padding: 6px 10px; font-size: 12px; font-family: 'DM Sans', sans-serif; background: var(--card-bg); cursor: pointer; color: var(--text-primary); }
        input:focus, select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--shadow-gold) !important; outline: none !important; }
        @media (max-width: 768px) {
          table { font-size: 12px; }
          th, td { padding: 8px 10px; }
          td { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        }
      `}</style>

      <header style={{ background: "linear-gradient(135deg, var(--page-bg), var(--card-bg))", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px var(--shadow)", borderBottom: "1px solid var(--shadow-gold)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={LOGO_URL} alt="logo" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "white", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {t.dashboardAdmin}
            </h1>
            <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Cooperative Apicole Cawit Tlemcen</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent)", animation: "pulse 1.5s infinite", boxShadow: "0 0 6px var(--shadow-gold)" }} />
            <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent)" }}>LIVE</span>
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>👑 {utilisateur?.nom}</span>
          <button onClick={() => navigate('/')} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "700", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.15)"; }}>
            {t.retour}
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: t.totalVentes, value: stats.totalVentes.toLocaleString("fr-DZ") + " DA", icon: "💰", color: "var(--accent)", bg: "var(--gold-tint)" },
            { label: t.enAttente, value: stats.enAttente, icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
            { label: t.livrees, value: stats.livrees, icon: "✅", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
            { label: t.stockFaible, value: stats.stockFaible + (isAr ? " منتجات" : " produits"), icon: "⚠️", color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
          ].map((stat, i) => (
            <div key={i} className="card-glass" style={{ background: "var(--card-bg)", borderRadius: "14px", padding: "20px", border: "1px solid var(--border)", borderLeft: "4px solid " + stat.color, boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px var(--shadow-gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.2), inset 0 -3px 0 " + stat.color; }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
                <span style={{ fontSize: "20px", background: stat.bg, padding: "6px", borderRadius: "8px" }}>{stat.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "4px", marginBottom: "20px", width: "fit-content" }}>
          {[
            { id: "commandes", label: t.tabCommandes },
            { id: "statistiques", label: t.tabStatistiques },
            { id: "produits", label: t.tabProduits },
          ].map((o) => (
            <button key={o.id} onClick={() => setOnglet(o.id)} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", background: onglet === o.id ? "white" : "transparent", color: onglet === o.id ? "var(--accent)" : "var(--text-secondary)", boxShadow: onglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.25s ease" }}>
              {o.label}
            </button>
          ))}
        </div>

        {chargement ? (
          <BeeSpinner size={48} text={isAr ? "جاري التحميل..." : "Chargement..."} />
        ) : (
          <>
            {onglet === "commandes" && (
              <>
                {commandes.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    <input
                      type="text"
                      placeholder={t.rechercherCommande}
                      value={rechercheCommande}
                      onChange={(e) => setRechercheCommande(e.target.value)}
                      style={{
                        flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: "10px",
                        border: "1.5px solid var(--border-input)", fontSize: "13px", outline: "none",
                        fontFamily: "'DM Sans', sans-serif", background: "var(--card-bg)", color: "var(--text-primary)",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={exporterExcel} className="btn-gold" style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", color: "var(--accent)", border: "1px solid var(--shadow-gold)", borderRadius: "10px", padding: "10px 18px", cursor: "pointer", fontWeight: "700", fontSize: "13px", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.target.style.background = "var(--gold-tint-strong)"; }}
                        onMouseLeave={(e) => { e.target.style.background = "transparent"; }}>
                        {t.exporterExcel}
                      </button>
                      <button onClick={exporterPDF} className="btn-gold" style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", color: "var(--accent)", border: "1px solid var(--shadow-gold)", borderRadius: "10px", padding: "10px 18px", cursor: "pointer", fontWeight: "700", fontSize: "13px", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.target.style.background = "var(--gold-tint-strong)"; }}
                        onMouseLeave={(e) => { e.target.style.background = "transparent"; }}>
                        {t.exporterPDF}
                      </button>
                    </div>
                  </div>
                )}
                <div style={{ background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--border)", overflow: "hidden" }}>
                  {commandes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
                      <p style={{ fontSize: "16px", fontWeight: "600" }}>{t.commandeEmpty}</p>
                    </div>
                  ) : commandesFiltrees.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      <p style={{ fontSize: "15px", fontWeight: "600" }}>{t.aucuneCorrespondance}</p>
                    </div>
                  ) : (
                    <>
                    <div style={{ overflowX: "auto" }}>
                      <table>
                        <thead>
                          <tr>
                            <th>#</th><th>{isAr ? "العميل" : "Client"}</th><th>{isAr ? "الهاتف" : "Téléphone"}</th>
                            <th>{isAr ? "العنوان" : "Adresse"}</th><th>{isAr ? "التتبع" : "Tracking"}</th><th>{isAr ? "المجموع" : "Total"}</th><th>{isAr ? "التاريخ" : "Date"}</th>
                            <th>{isAr ? "الحالة" : "Statut"}</th><th>{t.whatsapp}</th><th>{isAr ? "الإجراء" : "Action"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commandesAffichees.map((c, index) => (
                            <tr key={c.id} style={{ animation: "slideInUp 0.3s ease forwards", animationDelay: `${index * 0.03}s`, opacity: 0 }}>
                              <td><strong>#{index + 1}</strong></td>
                              <td>{c.client_nom || "—"}</td>
                              <td>{c.client_telephone || "—"}</td>
                              <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.adresse_livraison}</td>
                              <td>
                                {c.tracking_number ? (
                                  <a href={`https://tracking.yalidine.com/${c.tracking_number}`} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "var(--accent)", fontWeight: "700", fontSize: "12px", textDecoration: "none" }}>
                                    {c.tracking_number} ↗
                                  </a>
                                ) : (
                                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                                )}
                              </td>
                              <td><strong style={{ color: "var(--accent-light)" }}>{Number(c.total).toLocaleString()} DA</strong></td>
                              <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{new Date(c.created_at).toLocaleDateString("fr-DZ")}</td>
                              <td><BadgeStatut statut={c.statut} /></td>
                              <td>
                                {c.client_telephone ? (
                                  <a
                                    href={lienWhatsapp(formaterTelephoneAlgerie(c.client_telephone), messageStatutCommande(c, c.statut, isAr ? 'ar' : 'fr'))}
                                    target="_blank" rel="noreferrer"
                                    title={isAr ? "إرسال تحديث الحالة عبر واتساب" : "Envoyer le statut par WhatsApp"}
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: "4px",
                                      background: "#25D366", color: "white", border: "none",
                                      borderRadius: "6px", padding: "5px 8px", cursor: "pointer",
                                      fontSize: "12px", fontWeight: "700", textDecoration: "none",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    📲 {c.client_telephone}
                                  </a>
                                ) : (
                                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                  <select value={c.statut} onChange={(e) => changerStatut(c.id, e.target.value)} style={{ flex: 1 }}>
                                    {STATUTS.map((s) => (
                                      <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => genererFacture(c)} title={isAr ? "تحميل الفاتورة" : "Télécharger la facture"} className="btn-gold" style={{
                                    background: "transparent", color: "var(--accent)", border: "1px solid var(--shadow-gold)",
                                    borderRadius: "6px", padding: "5px 7px", cursor: "pointer",
                                    fontSize: "13px", lineHeight: "1", whiteSpace: "nowrap",
                                  }}>
                                    📄
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {pageCommandesCount > 1 && (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "12px", padding: "16px",
                      }}>
                        <button
                          onClick={() => setPageCommandes((p) => Math.max(1, p - 1))}
                          disabled={pageCommandes === 1}
                          style={{
                            padding: "8px 18px", borderRadius: "8px", border: "none",
                            background: pageCommandes === 1 ? "#2a2a2a" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                            color: pageCommandes === 1 ? "#666" : "var(--page-bg)",
                            fontWeight: "700", fontSize: "14px",
                            cursor: pageCommandes === 1 ? "not-allowed" : "pointer",
                          }}
                        >
                          {t.pagePrecedente || "Précédent"}
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                          {isAr ? `الصفحة ${pageCommandes} من ${pageCommandesCount}` : `Page ${pageCommandes} sur ${pageCommandesCount}`}
                        </span>
                        <button
                          onClick={() => setPageCommandes((p) => Math.min(pageCommandesCount, p + 1))}
                          disabled={pageCommandes === pageCommandesCount}
                          style={{
                            padding: "8px 18px", borderRadius: "8px", border: "none",
                            background: pageCommandes === pageCommandesCount ? "#2a2a2a" : "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                            color: pageCommandes === pageCommandesCount ? "#666" : "var(--page-bg)",
                            fontWeight: "700", fontSize: "14px",
                            cursor: pageCommandes === pageCommandesCount ? "not-allowed" : "pointer",
                          }}
                        >
                          {t.pageSuivante || "Suivant"}
                        </button>
                      </div>
                    )}
                  </>
                  )}
                </div>
              </>
            )}

            {onglet === "statistiques" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                <div className="card-glass" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif", margin: "0 0 20px" }}>Ventes mensuelles</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={donneesVentesMensuelles}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                      <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                      <Bar dataKey="ventes" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-glass" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif", margin: "0 0 20px" }}>Répartition des commandes</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={commandesParStatut} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {commandesParStatut.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-glass" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif", margin: "0 0 20px" }}>Produits les plus vendus</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topProduits} layout="vertical" margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                      <YAxis type="category" dataKey="nom" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} width={90} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                      <Bar dataKey="quantite" fill="var(--accent-light)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {onglet === "produits" && (
              <div className="card-glass" style={{ background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--border)", overflow: "hidden", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", color: "var(--text-primary)" }}>{t.listeProduits}</h3>
                  <button onClick={() => setAjouterProduit(true)} className="btn-gold-filled" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--page-bg)", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                    {t.ajouterProduitBtn}
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produits.map((p, idx) => {
                        const cat = categories.find((c) => c.id === p.categorie_id);
                        return (
                          <tr key={p.id} style={{ animation: "slideInUp 0.3s ease forwards", animationDelay: `${idx * 0.03}s`, opacity: 0 }}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {p.images && p.images[0] ? (
                                  <img src={p.images[0]} alt="" style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "var(--page-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📷</div>
                                )}
                                <div>
                                  <div style={{ fontWeight: "700" }}>{p.nom}</div>
                                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description || t.aucuneDescription}</div>
                                </div>
                              </div>
                            </td>
                            <td>{cat ? cat.nom : "—"}</td>
                            <td><strong>{Number(p.prix).toLocaleString()} DA</strong></td>
                            <td>
                              <span style={{ fontWeight: "700", color: p.stock_quantite < 10 ? "#dc2626" : "#16a34a" }}>
                                {p.stock_quantite} {t.unites}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => setGererPhotos(p)} className="btn-ghost" style={{ background: "var(--border)", color: "var(--text-primary)", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                                  {t.photos}
                                </button>
                                <button onClick={() => setModifierProduit(p)} style={{ background: "var(--shadow-gold)", color: "var(--accent)", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                                  {t.modifierProduit}
                                </button>
                                <button onClick={() => supprimerProduit(p.id)} style={{ background: "rgba(220,38,38,0.15)", color: "#ef4444", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>
                                  {t.supprimer}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modifierProduit && (
        <ModifierProduit
          produit={modifierProduit}
          categories={categories}
          onFermer={() => setModifierProduit(null)}
          onMiseAJour={(produitMisAJour) => {
            setProduits(prev => prev.map(p => p.id === produitMisAJour.id ? produitMisAJour : p));
          }}
          t={t}
          isAr={isAr}
        />
      )}
      {gererPhotos && (
        <GestionPhotos
          produit={gererPhotos}
          onFermer={() => setGererPhotos(null)}
          onMiseAJour={(produitMisAJour) => {
            setProduits(prev => prev.map(p => p.id === produitMisAJour.id ? produitMisAJour : p));
            setGererPhotos(produitMisAJour);
          }}
          t={t}
          isAr={isAr}
        />
      )}
      {ajouterProduit && (
        <FormulaireAjoutProduit
          categories={categories}
          onAjouter={handleAjouterProduit}
          onAnnuler={() => setAjouterProduit(false)}
          t={t}
          isAr={isAr}
        />
      )}
    </div>
  );
}