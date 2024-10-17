const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");
// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  // console.log(req);
  const { name, sku, category, quantity, price, description } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload
  let fileData="" ;
  if (req.file) {
    try {
      // Upload the image to Cloudinary
      const result = await uploadOnCloudinary(req.file.path);

      // Store the image URL in the user profile
      fileData = result.secure_url;
      // console.log(fileData);

      // Normalize and check if the file exists before unlinking
      const filePath = path.normalize(req.file.path);
      // console.log("File path to delete:", filePath);
      
      // if (fs.existsSync(filePath)) {
      //   fs.unlinkSync(filePath);
      //   console.log("File deleted successfully");
      // } else {
      //   console.log("File not found for deletion");
      // }
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  // console.log(product);
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle Image upload
  let fileData="" ;
  if (req.file) {
    try {
      // Upload the image to Cloudinary
      const result = await uploadOnCloudinary(req.file.path);

      // Store the image URL in the user profile
      fileData = result.secure_url;
      // console.log(fileData);

      // Normalize and check if the file exists before unlinking
      const filePath = path.normalize(req.file.path);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: fileData
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
