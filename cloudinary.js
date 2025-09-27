const Cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();



//cloudinary.config()
Cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const storage =multer.memoryStorage();
const upload = multer({ storage});


const uploadBuffer = (buffer, folder = "properties") =>
  new Promise((resolve, reject) => {
    const stream = Cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // only return the URL
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
// const uploadToCloudinary = (buffer, folder = "properties") => {
//   return new Promise((resolve, reject) => {
//     const stream = Cloudinary.uploader.upload_stream(
//       { folder, resource_type: "images" }, // make sure resource_type is "image"
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
  
// };
     module.exports ={ Cloudinary,upload,uploadBuffer };