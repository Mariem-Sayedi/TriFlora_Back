const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const Product = require('../models/productModel');
const asyncHandler= require('express-async-handler');
const ApiFeatures= require('../utils/apiFeatures');
const fs = require('fs');


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
// exports.createProduct = async (req, res) => {
//     console.log(req.query);
//    req.body.slug = slugify(req.body.title);
//   try {
//     const product = await ProductModel.create(req.body);
//     console.log(product);
//     res.status(201).json({ data: product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
exports.createProduct = async (req, res) => {
 
  try {
    const {title,description,price,category}=req.fields
    const {photo}=req.files

    switch (true) {
        case !title:
            return res.status(500).send({error:'Name is required'})
        case !description:
            return res.status(500).send({error:'description is required'})
        case !price:
            return res.status(500).send({error:'price is required'})
        case photo && photo.size >1000000 :
            return res.status(500).send({error:'photo is required and should be less then 1mb'})
           
    }

    const products = new ProductModel({...req.fields,slug:slugify(title)})
    if(photo){
        products.photo.data=fs.readFileSync(photo.path)
        products.photo.contentType=photo.Type
    }

    await products.save()

    res.status(200).send({
        success:true,
        message:"product was created successfuly !" ,
        products
    })

} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:'Error in creating product '
    })
}
}


// get product photo 
exports.productPhotoController= async(req,res)=>{
  try {
      const product = await ProductModel.findById(req.params.pid).select("photo")
      if(product.photo.data){
          res.set('Content-type',product.photo.contentType)
          return res.status(200).send(product.photo.data)

      }

  } catch (error) {
      console.log(error);
      res.status(500).send({
          success:false,
          error,
          message:'Error in getting product photo '
      })
  }
}


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

