const UserModel = require('../models/userModel');
const slugify = require('slugify');
const SellerRequestModel=require('../models/sellerRequestModel')


// @desc get list of users
// @route get /api/v1/users
// @access public
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ results: users.length, data: users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSellers = async (req, res) => {
  try {
    const sellers = await UserModel.find({ role: 'seller' });
   
    res.status(200).json({ success: true, data: sellers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// @desc get one User by ID
// @route get/api/v1/users/id
// @access public
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



// @desc create user
// @route post /api/v1/users
// @access private
// exports.createUser = async (req, res) => {
//   try {
//     const user = await UserModel.create(req.body);
//     res.status(201).json({ data: user });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const user =await UserModel.create(req.body);
    console.log("user created",user)
    if(user.role=='seller'){
      await SellerRequestModel.create({ user: user._id });
      user.role='user';
      await user.save();
    }
    
     
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc update User
// @route put /api/v1/users
// @access private

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    

    try {
      const user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };





// @desc delete user
// @route delete /api/v1/users
// @access private
deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await UserModel.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


                    
