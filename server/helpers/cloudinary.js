const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dunyvsmpn",
  api_key: "455656118499556",
  api_secret: "dtpzuwoU7BCwT3GWXpVqcYeKUbo",
  secure: true
});

const storage =  multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

async function imageUploadUtil(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "feature_images",
      quality: "auto:good"
    });
    console.log("Upload réussi:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Erreur Cloudinary:", error);
    throw error;
  }
}


module.exports = { upload, imageUploadUtil };
