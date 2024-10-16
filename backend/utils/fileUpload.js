var multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' directory exists (relative path adjusted)
const uploadDir = path.join(__dirname, '../uploads/product');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Define the destination path
    },
    filename: function (req, file, cb) {
        // Sanitize the file name by removing special characters and replacing spaces with underscores
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
        cb(null, Date.now() + "_" + cleanFileName); // Create a unique filename
    }
});

// Export the Multer instance
module.exports.upload = multer({ 
    storage: storage 
});
