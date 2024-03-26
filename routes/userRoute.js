const express= require('express');

const {getUsers, createUser, getUserById, updateUser}= require('../services/userService');
const router= express.Router();




router.post('/', createUser);
router.route('/').get(getUsers).post(createUser);
router.route('/:id').
get(getUserById).
put(updateUser).
delete(deleteUser);


module.exports= router;