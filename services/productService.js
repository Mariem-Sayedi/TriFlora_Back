const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const Product = require('../models/productModel');
const asyncHandler= require('express-async-handler');
const ApiFeatures= require('../utils/apiFeatures');

// @desc get list of products
// @route get /api/v1/products
// @access public
exports.getProducts = asyncHandler (async(req, res, next) => {
//build query
const apiFeatures= new ApiFeatures(Product.find(), req.query)
.paginate()
.filter()
.search()
.limitFields()
.sort();

//execute query
const products= await apiFeatures.mongooseQuery;

res.status(200).json({ results: products.length, data: products });
});





// @desc get one product by ID
// @route get/api/v1/products/id
// @access public
exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'product not found' });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// @desc create product
// @route post /api/v1/products
// @access private
exports.createProduct = async (req, res) => {
    console.log(req.query);
   req.body.slug = slugify(req.body.title);
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc update product
// @route put /api/v1/products
// @access private

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
     req.body.slug =slugify(title);

    try {
      const product = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });
      if (!product) {
        return res.status(404).json({ error: 'product not found' });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };





// @desc delete product
// @route delete /api/v1/products
// @access private
deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await ProductModel.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ error: 'product not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

