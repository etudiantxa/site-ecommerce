const { imageUploadUtil } = require("../../helpers/cloudinary");
const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    // Vérifiez si un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Convertir le buffer en base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload vers Cloudinary
    const result = await imageUploadUtil(dataURI);

    const featureImages = new Feature({
      image: result.secure_url
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log("Erreur complète:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Some error occurred!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };
