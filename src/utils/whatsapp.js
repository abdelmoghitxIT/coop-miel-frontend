const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

let _adminWhatsapp = null;

export async function chargerConfig() {
  try {
    const res = await fetch(`${API_URL}/api/config`);
    const data = await res.json();
    _adminWhatsapp = data.adminWhatsapp;
    return data;
  } catch {
    _adminWhatsapp = "213696242396";
    return { adminWhatsapp: _adminWhatsapp };
  }
}

export function getAdminWhatsapp() {
  return _adminWhatsapp || "213696242396";
}

export function formaterTelephoneAlgerie(tel) {
  if (!tel) return "";
  const nettoye = tel.replace(/[\s+-]/g, "");
  if (nettoye.startsWith("213")) return nettoye;
  if (nettoye.startsWith("0")) return "213" + nettoye.slice(1);
  return "213" + nettoye;
}

export function lienWhatsapp(numero, message) {
  if (!numero) {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export function messageNouvelleCommande(commande, infoClient) {
  return [
    `🍯 *NOUVELLE COMMANDE #${commande.id}*`,
    ``,
    `👤 *Client :* ${infoClient.nom}`,
    `📞 *Téléphone :* ${infoClient.telephone}`,
    `📍 *Adresse :* ${infoClient.adresse}`,
    `💰 *Total :* ${infoClient.total} DA`,
    ``,
    `🛒 *Produits :*`,
    infoClient.produits || "—",
    ``,
    `⏳ *Statut :* En attente de confirmation`,
  ].join('\n');
}

export function messageConfirmationClient(infoClient) {
  return [
    `🍯 *التعاونية الفلاحية لتربية النحل كاويت*`,
    `Cooperative Apicole Kawit — Tlemcen`,
    ``,
    `👋 مرحباً ${infoClient.nom} !`,
    ``,
    `✅ *تم تأكيد طلبك بنجاح*`,
    `💰 *المجموع :* ${infoClient.total} DA`,
    `🚚 سيتم التواصل معك قريباً للتوصيل`,
    ``,
    `📞 *للاستفسار :* +213 696 242 396`,
    ``,
    `🌟 شكراً لثقتكم`,
  ].join('\n');
}

export function messageStatutCommande(commande, nouveauStatut, langue = 'fr') {
  const STATUTS = {
    fr: {
      en_attente: '⏳ En attente',
      confirmee: '✅ Confirmée',
      en_livraison: '🚚 En livraison',
      livree: '📦 Livrée',
      annulee: '❌ Annulée',
    },
    ar: {
      en_attente: '⏳ في الانتظار',
      confirmee: '✅ مؤكدة',
      en_livraison: '🚚 قيد التوصيل',
      livree: '📦 تم التسليم',
      annulee: '❌ ملغية',
    },
  };

  const s = STATUTS[langue]?.[nouveauStatut] || nouveauStatut;

  if (langue === 'ar') {
    return [
      `🍯 *التعاونية الفلاحية لتربية النحل كاويت*`,
      ``,
      `👋 مرحباً !`,
      ``,
      `🔄 *تم تحديث حالة طلبك #${commande.id}*`,
      ``,
      `📌 *الحالة :* ${s}`,
      `💰 *المجموع :* ${Number(commande.total).toLocaleString()} DA`,
      ``,
      `📞 للاستفسار : +213 696 242 396`,
    ].join('\n');
  }

  return [
    `🍯 *Cooperative Apicole Kawit*`,
    ``,
    `👋 Bonjour !`,
    ``,
    `🔄 *Mise à jour de votre commande #${commande.id}*`,
    ``,
    `📌 *Statut :* ${s}`,
    `💰 *Total :* ${Number(commande.total).toLocaleString()} DA`,
    ``,
    `📞 Contact : +213 696 242 396`,
  ].join('\n');
}

export function messagePartageProduit(produit) {
  const nom = produit.nom || 'Produit';
  const prix = Number(produit.prix || 0).toLocaleString();
  const url = `${window.location.origin}/produit/${produit.id}`;
  return [
    `🍯 *${nom}*`,
    `💰 ${prix} DA`,
    ``,
    `${produit.description || 'Produit naturel de qualité supérieure'}`,
    ``,
    `🔗 ${url}`,
  ].join('\n');
}
