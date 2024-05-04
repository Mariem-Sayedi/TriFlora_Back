const express= require('express');

const {getUsers, createUser, getUserById, updateUser, getSellers}= require('../services/userService');
const router= express.Router();



router.get('/allSellers',getSellers);

router.post('/', createUser);
router.route('/').get(getUsers).post(createUser);
router.route('/:id').
get(getUserById).
put(updateUser).
delete(deleteUser);
router.put('/sellerRequest/:userId');


module.exports= router;