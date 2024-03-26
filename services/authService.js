const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

// @desc signup
// @route post /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
    //1- create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    //2- generate token
    const token = jwt.sign({ userId: user._id }, "the-secret-key-jwt-in", {
        expiresIn: '90d',
    });
    res.status(201).json({ data: user, token });
});





// @desc login
// @route post /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    //1- check if password and email in the body (validation)
    //2- check if user exists & check if password is correct
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password'));
    }

    //3- generate token
    const token = jwt.sign({ userId: user._id }, "the-secret-key-jwt-in", {
        expiresIn: '90d',
    });
    //4- send response to client side
    res.status(200).json({ data: user, token });
});






exports.protect = asyncHandler(async (req, res, next) => {
    //1- check if token exists if exists get it
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
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, "the-secret-key-jwt-in");

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                'The user that belong to this token does no longer exist',
                401
            )
        );
    }

    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        // Password changed after token created (Error)
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
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.userRole)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });



