const UserModel = require('../models/userModel');
const slugify = require('slugify');
const SellerRequestModel=require('../models/sellerRequestModel')

exports.approveSellerRequest = async (req, res) => {
    try {
      const { userId } = req.params;
  
      
      const user = await UserModel.findById(userId);
  
      
      user.sellerRequestStatus = 'approved';
      await user.save();
  
      
      await SellerRequestModel.findOneAndUpdate({ user: userId }, { status: 'approved' });
  
      res.status(200).json({success:true, message: 'Seller request approved successfully.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
exports.rejectSellerRequest = async (req, res) => {
    try {
      const { userId } = req.params;
  
      
      const user = await UserModel.findById(userId);
  
      
      user.sellerRequestStatus = 'rejected';
      await user.save();
  
      
      await SellerRequestModel.findOneAndUpdate({ user: userId }, { status: 'rejected' });
  
      res.status(200).json({success:true, message: 'Seller request rejected.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getSellersRequests = async (req, res) => {
    try {
     
      const sellersReqs = await SellerRequestModel.find().populate('user');
      res.status(200).json({ results: sellersReqs.length, data: sellersReqs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};