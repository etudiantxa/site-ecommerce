const express = require('express');
const router = express.Router();

router.post('/initiate-payment', async (req, res) => {
  try {
    // Récupérer les données du client depuis req.body
    const user = req.body.user;
    const product = req.body.product;
    
    const params = {
      item_name: product.name,                    // Nom du produit ou service
      item_price: product.price,                  // Prix en XOF (entier, ex: 1000)
      currency: "XOF",                            // Devise (toujours "XOF" pour le Sénégal)
      ref_command: `CMD_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Référence unique de la commande
      command_name: product.description || `Achat ${product.name}`, // Description de la commande
      target_payment: "ORANGE",                   // "ORANGE", "WAVE", "FREE", "CARTE" (pas "Orange Money")
      env: "test",                                // "test" ou "prod"
      ipn_url: "https://ton-ngrok/api/paytech/ipn",      // URL de notification (callback)
      success_url: "https://ton-ngrok/payment/success",  // URL de redirection en cas de succès
      cancel_url: "https://ton-ngrok/payment/cancel",    // URL de redirection en cas d'annulation
      logo: "https://via.placeholder.com/150",    // (optionnel) URL du logo à afficher sur la page PayTech
      country: "SN",                              // Pays (SN pour Sénégal)
      custom_field: JSON.stringify({
        user_id: user.id,
        email: user.email,
        internal_ref: product.internalRef,
        source: "VotreSiteWeb"
  }) // (optionnel) Infos personnalisées pour retrouver la commande
};

    const response = await fetch(paymentRequestUrl, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: headers
    });
    
    const jsonResponse = await response.json();
    
    if (jsonResponse.success === 1) {
      res.json({
        paymentUrl: jsonResponse.redirect_url,
        token: jsonResponse.token
      });
    } else {
      res.status(400).json({ error: jsonResponse.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});