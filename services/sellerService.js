const SellerModel = require('../models/sellerModel');
const ApiFeatures= require('../utils/apiFeatures');
const asyncHandler= require('express-async-handler');


// @desc get list of sellers
// @route get /api/v1/sellers
// @access public
exports.getSellers = asyncHandler (async(req, res, next) => {
  //build query
  const apiFeatures= new ApiFeatures(SellerModel.find(), req.query)
  .paginate()
  .filter()
  .search()
  .limitFields()
  .sort();
  
  //execute query
  const sellers= await apiFeatures.mongooseQuery;
  
  res.status(200).json({ results: sellers.length, data: sellers });
  });

// @desc get one seller by ID
// @route get/api/v1/sellers/id
// @access public
exports.getSellerById = async (req, res) => {
    const sellerId = req.params.id;
    try {
      const seller = await SellerModel.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ error: 'seller not found' });
      }
      res.status(200).json({ data: seller });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// @desc create seller
// @route post /api/v1/sellers
// @access private
exports.createSeller = async (req, res) => {
  try {
    const seller = await SellerModel.create(req.body);
    res.status(201).json({ data: seller });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc update seller
// @route put /api/v1/sellers
// @access private

exports.updateSeller = async (req, res) => {
  
    try {
      const seller = await SellerModel.findByIdAndUpdate(sellerId, req.body, { new: true });
      if (!seller) {
        return res.status(404).json({ error: 'seller not found' });
      }
      res.status(200).json({ data: seller });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };





// @desc delete seller
// @route delete /api/v1/sellers
// @access private
deleteSeller = async (req, res) => {
    const sellerId = req.params.id;
    try {
      const seller = await SellerModel.findByIdAndDelete(sellerId);
      if (!seller) {
        return res.status(404).json({ error: 'seller not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

