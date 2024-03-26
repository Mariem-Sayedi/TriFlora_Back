const express= require('express');

const {getSellers, createSeller, getSellerById, updateSeller}= require('../services/sellerService');
const router= express.Router();




router.post('/', createSeller);
router.route('/').get(getSellers).post(createSeller);
router.route('/:id').
get(getSellerById).
put(updateSeller).
delete(deleteSeller);


module.exports= router;