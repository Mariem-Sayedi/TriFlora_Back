const express= require('express');

const {getProducts, createProduct, getProductById, updateProduct}= require('../services/productService');
const router= express.Router();




router.post('/', createProduct);
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').
get(getProductById).
put(updateProduct).
delete(deleteProduct);


module.exports= router;