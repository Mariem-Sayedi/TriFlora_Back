const express = require('express');
const {
  createCashOrder,
  // findAllOrders,
  // findSpecificOrder,
  // filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require('../services/orderService');

const authService = require('../services/authService');

const router = express.Router();

// router.use(authService.protect);

router.get(
  '/checkout-session/:cartId',
 // authService.allowedTo('user'),
  checkoutSession
);

router.route('/:cartId').post(createCashOrder);
//router.route('/:cartId').post(authService.allowedTo('user'), createCashOrder);

// router.get(
//   '/',
//   //authService.allowedTo('user', 'admin', 'seller'),
//   filterOrderForLoggedUser,
//   findAllOrders
// );
// router.get('/:id', findSpecificOrder);

router.put(
  '/:id/pay',
  //authService.allowedTo('admin', 'seller'),
  updateOrderToPaid
);
router.put(
  '/:id/deliver',
  //authService.allowedTo('admin', 'seller'),
  updateOrderToDelivered
);

module.exports = router;