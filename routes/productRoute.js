const express= require('express');
const formidableMiddleware = require('express-formidable') 
const {getProducts, createProduct, getProductById, updateProduct, productPhotoController,getProductsByCategory}= require('../services/productService');
const router= express.Router();




router.post('/', formidableMiddleware(), createProduct);
router.route('/').get(getProducts).post(createProduct);
router.get('/product-photo/:pid',productPhotoController)
router.get('/productByCategory/:categoryId',getProductsByCategory)
router.route('/:id').
get(getProductById).
put(updateProduct).
delete(deleteProduct);


module.exports= router;