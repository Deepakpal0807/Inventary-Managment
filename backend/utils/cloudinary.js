var cloudinary = require("cloudinary").v2;
var fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var uploadOnCloudinary = function (localFilePath) {
  return new Promise(function (resolve, reject) {
    if (!localFilePath) {
      return reject(new Error("No file path provided"));
    }

    // Upload the file to Cloudinary
    cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
      .then(function (response) {
        // File has been uploaded successfully
        fs.unlinkSync(localFilePath);
        // Remove the file from local storage
        resolve(response); // Resolve the promise with the response
      })
      .catch(function (error) {
        fs.unlinkSync(localFilePath); // Remove the file if the upload fails
        reject(new Error("Cloudinary upload failed: " + error.message)); // Reject the promise with the error message
      });
  });
};

module.exports.uploadOnCloudinary = uploadOnCloudinary;
