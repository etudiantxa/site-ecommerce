const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ngrok = require("ngrok");
const bodyParser = require("body-parser");
require('dotenv').config(); // Ajout pour la gestion des variables d'environnement

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const { initiatePayment } = require("./controllers/paytech/paytechController");

// Configuration MongoDB
const uri = process.env.MONGODB_URI || "mongodb+srv://mangane975:Bayemor_1994@expressapi.v6wzr.mongodb.net/EcommerceDB?retryWrites=true&w=majority&appName=ExpressApi";
const mongooseOptions = {
  ssl: true,
  tlsAllowInvalidCertificates: false
};

// Initialisation Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Routes existantes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// Nouveaux endpoints PayTech
app.post("/api/payment/initiate", initiatePayment);
app.post("/api/paytech/ipn", (req, res) => {
  console.log("📩 Notification IPN:", req.body);
  res.status(200).send("OK");
});

app.get("/payment/success", (req, res) => {
  console.log("✅ Paiement réussi:", req.query);
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success?token=${req.query.token}`);
});

app.get("/payment/cancel", (req, res) => {
  console.log("❌ Paiement annulé:", req.query);
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/cancel`);
});

// Connexion MongoDB + Lancement serveur
const startServer = async () => {
  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log("✅ Connecté à MongoDB");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur sur http://localhost:${PORT}`);
    });

    // Ngrok en développement seulement
    if (process.env.NODE_ENV === "development") {
      try {
        const url = await ngrok.connect({
          addr: PORT,
          authtoken: process.env.NGROK_AUTHTOKEN,
          region: 'us' // ou 'eu' selon votre localisation
        });
        
        console.log('\n=======================');
        console.log(`🛰️  Ngrok Tunnel ACTIF`);
        console.log(`🌐 URL Publique : ${url}`);
        console.log(`🔄 IPN Callback : ${url}/api/paytech/ipn`);
        console.log('=======================\n');
      } catch (ngrokError) {
        console.error("❌ Erreur Ngrok:", ngrokError.message);
        console.log("ℹ️ Le serveur continue sans Ngrok");
      }
    }
  } catch (err) {
    console.error("❌ Erreur démarrage:", err);
    process.exit(1);
  }
};

startServer();