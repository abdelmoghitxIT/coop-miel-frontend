const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou votre fournisseur de mail
  auth: {
    user: process.env.EMAIL_utilisateurs, // Votre adresse email
    pass: process.env.EMAIL_PASS  // Votre mot de passe d'application (généré sur Google)
  }
});

module.exports = transporter;