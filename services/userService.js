const UserModel = require('../models/userModel');
const slugify = require('slugify');
const SellerRequestModel=require('../models/sellerRequestModel')
const fs = require('fs');
const productModel = require('../models/productModel');

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
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = req.fields.name || user.name;
    user.email = req.fields.email || user.email;

    // Check if photo exists in request
    if (req.files && req.files.photo) {
      const photo = req.files.photo;

      // Check photo size
      if (photo.size > 1000000) {
        return res.status(500).json({ error: 'Photo should be less than 1MB' });
      }

      // Update user's photo data
      user.photo.data = fs.readFileSync(photo.path);
      user.photo.contentType = photo.type;
    }

    // Save updated user
    await user.save();

    // Respond with updated user data
    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
};


exports.userPhotoController= async(req,res)=>{
  try {
      const user = await UserModel.findById(req.params.pid).select("photo")
      if(user.photo.data){
          res.set('Content-type',user.photo.contentType)
          return res.status(200).send(user.photo.data)

      }

  } catch (error) {
      console.log(error);
      res.status(500).send({
          success:false,
          error,
          message:'Error in getting user photo '
      })
  }
}





// exports.updateUser = async (req, res) => {
//     const userId = req.params.id;
    

//     try {
//       const user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.status(200).json({ data: user });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };





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

  
  
                    
