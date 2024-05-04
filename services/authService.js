const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const crypto = require('crypto');
const Cart = require('../models/cartModel');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');
const dotenv= require('dotenv');
dotenv.config({ path: './.env' });
const jwtSecret = process.env.JWT_SECRET;
const SellerRequestModel=require('../models/sellerRequestModel')


// @desc signup
// @route post /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
    
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role:req.body.role
    });
    
    if(user.role=='seller'){
      await SellerRequestModel.create({ user: user._id });
      // user.role='user';
      // await user.save();
    }
    

    console.log("JWT Secret:", jwtSecret);
    
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '90d',
    });
    const cart = await Cart.create({user:user._id})
    res.status(201).json({ data: user, token });
});





// @desc login
// @route post /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
   
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password'));
    }

    
    const token = jwt.sign({ userId: user._id },jwtSecret, {
        expiresIn: '90d',
    });
    const cart = await Cart.findOne({ user: user._id });
    
    res.status(200).json({success:true, user: user, token ,cart});
});






exports.protect = asyncHandler(async (req, res, next) => {
    
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new ApiError(
                'you are not login, please login to get access this route',
                401
            )
        );
    }
    
    const decoded = jwt.verify(token,jwtSecret);

    
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                'The user that belong to this token does no longer exist',
                401
            )
        );
    }

   
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
       
        if (passChangedTimestamp > decoded.iat) {
            return next(
                new ApiError(
                    'User recently changed his password. please login again..',
                    401
                )
            );
        }
    }
});






exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
   
    if (!roles.includes(req.userRole)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

  


  // @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${req.body.email}`, 404)
      );
    }
    
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    
    user.passwordResetCode = hashedResetCode;
   
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    user.passwordResetVerified = false;
  
    await user.save();
  
    
    const message = `Hi ${user.name},\n We received a request to reset the password
     on your E-shop Account. \n${resetCode}\n Enter this code to complete the reset.
      \n Thanks for helping us keep your account secure.\n The TriFlora Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 30 min)',
        message,
      });
      res
      .status(200)
      .json({ status: 'Success', message: 'Reset code sent to email' });
    } 
    catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
  
      await user.save();
      return next(new ApiError('There is an error in sending email', 500));
    }
   
  });





// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const resetCode = req.body.resetCode;
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired', 400)); // Utilisez le code d'état 400
  }
  user.passwordResetVerified = true;
  await user.save();
  const token = jwt.sign({ id: user._id }, jwtSecret); 
  res.status(200).json({
    status: 'Success',
    token: token,
  });
});



// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  try {
    
    const decodedToken = jwt.verify(req.body.token, jwtSecret); 
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new ApiError(`There is no user with id ${decodedToken.id}`, 404)); 
    }

    
    if (!user.passwordResetVerified) {
      return next(new ApiError('Reset code not verified', 400)); 
    }

    
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    
    const token = jwt.sign({ id: user._id }, jwtSecret); 
    res.status(200).json({ token: token });
  } 
  catch (error) {
    return next(new ApiError('Error resetting password', 500)); 
  }
});
