const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  updateTotalPriceHandler
} = require('../services/cartService');
const authService = require('../services/authService');

const router = express.Router();

//  router.use(authService.protect, authService.allowedTo('user'));
router
  .route('/:userId')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);


router
  .route('/:userId/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;