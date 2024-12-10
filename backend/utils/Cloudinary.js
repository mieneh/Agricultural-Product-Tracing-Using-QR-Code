const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const createUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: (req, file) => `${req.userId || 'guest'}-${Date.now()}`,
    },
  });
  return multer({ storage });
};

module.exports = { cloudinary, createUploader };