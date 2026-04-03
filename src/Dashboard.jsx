import { useState, useEffect } from "react";

const STATUTS = [
  { id: "en_attente", label: "En attente", color: "#f59e0b", bg: "#fef3c7" },
  { id: "confirmee", label: "Confirmée", color: "#3b82f6", bg: "#eff6ff" },
  { id: "en_livraison", label: "En livraison", color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "livree", label: "Livrée", color: "#16a34a", bg: "#dcfce7" },
  { id: "annulee", label: "Annulée", color: "#dc2626", bg: "#fee2e2" },
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

function FormulaireAjoutProduit({ categories, onAjouter, onAnnuler }) {
  const [form, setForm] = useState({
    nom: "", description: "", prix: "", stock_quantite: "", categorie_id: "",
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nom || !form.prix || !form.stock_quantite || !form.categorie_id) {
      setErreur("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setChargement(true);
    setErreur("");
    try {
      const res = await fetch("process.env.REACT_APP_API_URL/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          description: form.description,
          prix: Number(form.prix),
          stock_quantite: Number(form.stock_quantite),
          categorie_id: Number(form.categorie_id),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur || "Erreur lors de l'ajout");
      } else {
        onAjouter(data);
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }
    setChargement(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1.5px solid #e5ddd0", fontSize: "14px",
    color: "#1c1008", fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "#6b6055",
    display: "block", marginBottom: "6px",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#1c1008", fontFamily: "'Playfair Display', serif" }}>
            Ajouter un produit
          </h2>
          <button onClick={onAnnuler} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6b6055" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Nom du produit *</label>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Miel de Sidr" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Description du produit..." rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Prix (DA) *</label>
              <input name="prix" type="number" value={form.prix} onChange={handleChange} placeholder="Ex: 1500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stock *</label>
              <input name="stock_quantite" type="number" value={form.stock_quantite} onChange={handleChange} placeholder="Ex: 50" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Catégorie *</label>
            <select name="categorie_id" value={form.categorie_id} onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          {erreur && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#dc2626" }}>
              ⚠️ {erreur}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={chargement}
            style={{
              width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              background: chargement ? "#d4b483" : "#b45309",
              color: "white", fontWeight: "700", fontSize: "15px",
              cursor: chargement ? "not-allowed" : "pointer",
            }}
          >
            {chargement ? "Ajout en cours..." : "Ajouter le produit"}
          </button>

          <button onClick={onAnnuler} style={{
            width: "100%", padding: "11px", borderRadius: "10px",
            border: "1.5px solid #e5ddd0", background: "white",
            color: "#6b6055", fontWeight: "600", fontSize: "14px", cursor: "pointer",
          }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ utilisateur, onRetour }) {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState("commandes");
  const [ajouterProduit, setAjouterProduit] = useState(false);

  useEffect(() => { chargerDonnees(); }, []);

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [resCmd, resProd, resCat] = await Promise.all([
        fetch("http://localhost:5000/api/commandes"),
        fetch("http://localhost:5000/api/produits"),
        fetch("http://localhost:5000/api/categories"),
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

  const changerStatut = async (id, statut) => {
    try {
      await fetch(`http://localhost:5000/api/commandes/${id}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, statut } : c)));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const uploaderImages = async (id, files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }
  try {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/produits/${id}/images`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setProduits(prev => prev.map(p => p.id === id ? { ...p, images: data.images } : p));
    alert('Photos uploadées avec succès ! ✅');
  } catch (err) {
    alert('Erreur lors de l\'upload');
  }
};

  const supprimerProduit = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await fetch(`http://localhost:5000/api/produits/${id}`, { method: "DELETE" });
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleAjouterProduit = (nouveauProduit) => {
    setProduits((prev) => [...prev, nouveauProduit]);
    setAjouterProduit(false);
  };

  const totalVentes = commandes.filter((c) => c.statut !== "annulee").reduce((sum, c) => sum + Number(c.total), 0);
  const commandesEnAttente = commandes.filter((c) => c.statut === "en_attente").length;
  const commandesLivrees = commandes.filter((c) => c.statut === "livree").length;
  const produitsStockFaible = produits.filter((p) => p.stock_quantite < 10).length;

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #a57c3a; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f0ebe3; }
        td { padding: 14px 16px; font-size: 14px; color: #1c1008; border-bottom: 1px solid #f8f4ef; }
        tr:hover td { background: #fef9ee; }
        select { border: 1.5px solid #e5ddd0; border-radius: 8px; padding: 6px 10px; font-size: 12px; font-family: 'DM Sans', sans-serif; background: white; cursor: pointer; color: #1c1008; }
      `}</style>

      <header style={{
        background: "white", borderBottom: "1px solid #f0ebe3",
        padding: "0 32px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(180,120,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🍯</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#1c1008", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              Dashboard Admin
            </h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#a57c3a" }}>Coop. Nhal Tlemcen</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "#6b6055" }}>👑 {utilisateur?.nom}</span>
          <button onClick={onRetour} style={{
            background: "#b45309", color: "white", border: "none",
            borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
            fontSize: "13px", fontWeight: "700",
          }}>
            ← Retour au catalogue
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total des ventes", value: totalVentes.toLocaleString("fr-DZ") + " DA", icon: "💰", color: "#b45309", bg: "#fef9ee" },
            { label: "En attente", value: commandesEnAttente, icon: "⏳", color: "#f59e0b", bg: "#fef3c7" },
            { label: "Livrées", value: commandesLivrees, icon: "✅", color: "#16a34a", bg: "#dcfce7" },
            { label: "Stock faible", value: produitsStockFaible + " produits", icon: "⚠️", color: "#dc2626", bg: "#fee2e2" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "white", borderRadius: "14px", padding: "20px", border: "1px solid #f0ebe3", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#a8977f", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
                <span style={{ fontSize: "20px", background: stat.bg, padding: "6px", borderRadius: "8px" }}>{stat.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div style={{ display: "flex", gap: "4px", background: "#f0ebe3", borderRadius: "10px", padding: "4px", marginBottom: "20px", width: "fit-content" }}>
          {[
            { id: "commandes", label: "📋 Commandes" },
            { id: "produits", label: "🍯 Produits & Stocks" },
          ].map((o) => (
            <button key={o.id} onClick={() => setOnglet(o.id)} style={{
              padding: "9px 20px", borderRadius: "8px", border: "none",
              cursor: "pointer", fontWeight: "700", fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              background: onglet === o.id ? "white" : "transparent",
              color: onglet === o.id ? "#b45309" : "#6b6055",
              boxShadow: onglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {o.label}
            </button>
          ))}
        </div>

        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px", fontSize: "40px" }}>🍯</div>
        ) : (
          <>
            {onglet === "commandes" && (
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0ebe3", overflow: "hidden" }}>
                {commandes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", color: "#a8977f" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>Aucune commande pour l'instant</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Client</th><th>Téléphone</th>
                        <th>Adresse</th><th>Total</th><th>Date</th>
                        <th>Statut</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandes.map((c) => (
                        <tr key={c.id}>
                          <td><strong>#{c.id}</strong></td>
                          <td>{c.client_nom || "—"}</td>
                          <td>{c.client_telephone || "—"}</td>
                          <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.adresse_livraison}</td>
                          <td><strong style={{ color: "#92400e" }}>{Number(c.total).toLocaleString()} DA</strong></td>
                          <td style={{ color: "#6b6055", fontSize: "12px" }}>{new Date(c.created_at).toLocaleDateString("fr-DZ")}</td>
                          <td><BadgeStatut statut={c.statut} /></td>
                          <td>
                            <select value={c.statut} onChange={(e) => changerStatut(c.id, e.target.value)}>
                              {STATUTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {onglet === "produits" && (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                  <button
                    onClick={() => setAjouterProduit(true)}
                    style={{
                      background: "#b45309", color: "white", border: "none",
                      borderRadius: "10px", padding: "10px 20px", cursor: "pointer",
                      fontWeight: "700", fontSize: "14px",
                    }}
                  >
                    + Ajouter un produit
                  </button>
                </div>
                <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0ebe3", overflow: "hidden" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Produit</th><th>Catégorie</th>
                        <th>Prix</th><th>Stock</th><th>État</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produits.map((p) => (
                        <tr key={p.id}>
                          <td><strong>#{p.id}</strong></td>
                          <td><strong>{p.nom}</strong></td>
                          <td style={{ color: "#6b6055" }}>{p.categorie_nom}</td>
                          <td><strong style={{ color: "#92400e" }}>{Number(p.prix).toLocaleString()} DA</strong></td>
                          <td>
                            <span style={{ fontWeight: "700", color: p.stock_quantite < 10 ? "#dc2626" : "#16a34a" }}>
                              {p.stock_quantite} unités
                            </span>
                          </td>
                          <td>
                            {p.stock_quantite === 0 ? (
                              <span style={{ background: "#fee2e2", color: "#dc2626", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>Rupture</span>
                            ) : p.stock_quantite < 10 ? (
                              <span style={{ background: "#fef3c7", color: "#f59e0b", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>⚠️ Stock faible</span>
                            ) : (
                              <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>En stock</span>
                            )}
                          </td>
                          <td>
                            <label style={{
  background: "#e0f2fe", color: "#075985", border: "none",
  borderRadius: "6px", padding: "5px 10px", cursor: "pointer",
  fontSize: "12px", fontWeight: "700", marginRight: "6px",
  display: "inline-block",
}}>
  📷 Photos
  <input
    type="file"
    accept="image/*"
    multiple
    style={{ display: "none" }}
    onChange={(e) => uploaderImages(p.id, e.target.files)}
  />
</label>
                            <button
                              onClick={() => supprimerProduit(p.id)}
                              style={{
                                background: "#fee2e2", color: "#dc2626", border: "none",
                                borderRadius: "6px", padding: "5px 10px", cursor: "pointer",
                                fontSize: "12px", fontWeight: "700",
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {ajouterProduit && (
        <FormulaireAjoutProduit
          categories={categories}
          onAjouter={handleAjouterProduit}
          onAnnuler={() => setAjouterProduit(false)}
        />
      )}
    </div>
  );
}
