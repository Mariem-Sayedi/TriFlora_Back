const express= require('express');
const formidableMiddleware = require('express-formidable') 
const {getUsers, createUser, getUserById, updateUser, getSellers, userPhotoController}= require('../services/userService');
const router= express.Router();



router.get('/allSellers',getSellers);

router.post('/', createUser);
router.route('/').get(getUsers).post(createUser);
router.route('/:id').
get(getUserById).
put(formidableMiddleware(),updateUser).
delete(deleteUser);
router.put('/sellerRequest/:userId');
router.get('/user-photo/:pid',userPhotoController)

module.exports= router;