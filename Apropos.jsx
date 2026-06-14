import React from 'react';

export default function APropos({ onRetour }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#fdf8f0", 
      padding: "40px 20px", 
      fontFamily: "sans-serif" 
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        background: "white", 
        padding: "30px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)" 
      }}>
        
        {/* Bouton de retour */}
        <button 
          onClick={onRetour}
          style={{
            background: "transparent",
            border: "1px solid #b45309",
            color: "#b45309",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          ⬅ Retour au catalogue
        </button>

        <h2 style={{ color: "#78350f", borderBottom: "2px solid #f0ebe3", paddingBottom: "10px" }}>
          🍯 À propos de Coop Nhal Tlemcen
        </h2>

        <div style={{ color: "#574f46", lineHeight: "1.6", marginTop: "20px", fontSize: "16px" }}>
          <p>
            Bienvenue sur la plateforme de la <strong>Coopérative Nhal Tlemcen</strong>. 
            Nous sommes une coopérative locale passionnée par l'apiculture et engagée à vous fournir 
            le meilleur miel 100% naturel, récolté dans notre belle région.
          </p>
          <p>
            <strong>Notre Mission :</strong> Préserver les abeilles, soutenir nos apiculteurs locaux 
            et garantir à nos clients des produits de la ruche d'une qualité exceptionnelle (Miel pur, 
            Gelée royale, Pollen, etc.).
          </p>
          <p>
            <strong>Nos Valeurs :</strong> Authenticité, Qualité, et Respect de la nature.
          </p>
        </div>
        
      </div>
    </div>
  );
}