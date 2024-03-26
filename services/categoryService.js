const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');



// @desc get list of categories
// @route get /api/v1/categories
// @access public
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({ results: categories.length, data: categories});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc get one category by ID
// @route get/api/v1/categories/id
// @access public
exports.getCategoryById = async (req, res) => {
    const categoryId = req.params.id;
    try {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json({ data: category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// @desc create category
// @route post /api/v1/categories
// @access private
exports.createCategory = async (req, res) => {
  const name = req.body.name;
  try {
    const category = await CategoryModel.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc update category
// @route put /api/v1/categories
// @access private

exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const name = req.body.name;
    const slug =slugify(name);

    try {
      const category = await CategoryModel.findByIdAndUpdate(categoryId, {name, slug}, { new: true });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json({ data: category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };





// @desc delete category
// @route delete /api/v1/categories
// @access private
deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
      const category = await CategoryModel.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

