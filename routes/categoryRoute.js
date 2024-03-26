const express= require('express');

const {getCategories, createCategory, getCategoryById, updateCategory}= require('../services/categoryService');
const router= express.Router();




router.post('/', createCategory);
router.route('/').get(getCategories).post(createCategory);
router.route('/:id').
get(getCategoryById).
put(updateCategory).
delete(deleteCategory);


module.exports= router;