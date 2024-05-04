const express= require('express');

const router= express.Router();
const {getSellersRequests,approveSellerRequest,rejectSellerRequest}= require('../services/sellersRequestsService');



router.route('/allSellersRequests').get(getSellersRequests)
router.route('/approve/:userId').put(approveSellerRequest);
router.route('/reject/:userId').put(rejectSellerRequest);



module.exports= router;