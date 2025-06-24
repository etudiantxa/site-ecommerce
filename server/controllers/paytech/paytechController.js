const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { URLSearchParams } = require('url');
require('dotenv').config();

const paymentRequestUrl = "https://paytech.sn/api/payment/request-payment";

const initiatePayment = async (req, res) => {
  try {
    const { user, product } = req.body;
    
    // Configuration pour le développement local
    const baseUrl = process.env.NGROK_URL || `http://localhost:${process.env.PORT || 5000}`;

    // Paramètres obligatoires pour PayTech
    const params = {
      item_name: product.name,
      item_price: product.price,
      currency: "XOF",
      ref_command: `CMD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      command_name: product.description || `Achat ${product.name}`,
      target_payment: product.payment_method || "Orange Money" || "Wave",
      env: "test", // Forcé en mode test pour le développement
      ipn_url: `${baseUrl}/api/paytech/ipn`,
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      logo: "https://via.placeholder.com/150", // Logo obligatoire
      country: "SN", // Code pays obligatoire
      custom_field: JSON.stringify({
        user_id: user.id,
        email: user.email,
        internal_ref: product.internalRef,
        source: "VotreSiteWeb" // Champ analytique recommandé
      })
    };

    // En-têtes avec vérification des clés
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'API_KEY': process.env.PAYTECH_API_KEY,
      'API_SECRET': process.env.PAYTECH_API_SECRET
    };

    if (!headers.API_KEY || !headers.API_SECRET) {
      throw new Error("Clés API PayTech non configurées");
    }

    console.log('Envoi requête PayTech:', {
      params: { ...params, custom_field: '[...]' },
      headers: { ...headers, API_KEY: '***', API_SECRET: '***' }
    });

    const response = await fetch(paymentRequestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
      timeout: 15000 // Timeout augmenté à 15s
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Réponse PayTech:', errorData);
      throw new Error(`Erreur ${response.status}: ${errorData.message || "Pas de message d'erreur"}`);
    }

    const data = await response.json();

    if (data.success === 1) {
      let paymentUrl = data.redirect_url;
      
      if (['Orange Money', 'Wave'].includes(params.target_payment)) {
        const query = new URLSearchParams({
          pn: user.phone_number,
          nn: user.phone_number.replace(/^\+221/, ''),
          fn: `${user.first_name} ${user.last_name}`.substring(0, 30),
          tp: params.target_payment,
          nac: 1 // Toujours auto-soumission pour mobile money
        });
        paymentUrl += (paymentUrl.includes('?') ? '&' : '?') + query.toString();
      }

      console.log('Paiement initié avec succès. Token:', data.token);
      
      return res.json({
        success: true,
        paymentUrl,
        token: data.token,
        reference: params.ref_command
      });
    } else {
      throw new Error(data.message || "La requête a échoué sans message d'erreur");
    }
  } catch (error) {
    console.error('Erreur complète:', {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: "Échec de la connexion avec PayTech",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      reference: req.body.product?.internalRef
    });
  }
};

module.exports = { initiatePayment };