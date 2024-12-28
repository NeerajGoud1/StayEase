const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  //to actually connect our backend with cloudinary (connecting=configuring)
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUDE_API_KEY,
  api_secret: process.env.CLOUDE_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayease_DEv", //folder at cloudinary storage
    allowedFormates: ["jpg", "png", "jpeg", "heic"], // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
};
