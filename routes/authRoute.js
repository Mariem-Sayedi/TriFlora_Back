const express= require('express');
const { signup,
    login,
    forgotPassword,
    resetPassword,
    verifyPassResetCode}= require('../services/authService');


const router= express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verifyResetCode').post(verifyPassResetCode);
router.route('/resetPassword').post(resetPassword);


module.exports= router;