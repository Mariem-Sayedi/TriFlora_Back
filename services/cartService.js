const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');


const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};



// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.params.userId; // Assuming you have user authentication middleware
    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex !== -1) {
      // If the product exists, update its quantity
      cart.cartItems[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.cartItems.push({
        product: productId,
        quantity:1,
        
        price,
        user: userId,
      });
    }

    // Update totalCartPrice
    cart.totalCartPrice = cart.cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});







// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId });
 
  if (!cart) {
    return next(
      cart = new Cart({ user: userId, cartItems: [] })
      
    );
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
// exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
//   const cart = await Cart.findOneAndUpdate(
//     { user: req.userId },
//     {
//       $pull: { cartItems: { _id: req.params.itemId } },
//     },
//     { new: true }
//   );

//   calcTotalCartPrice(cart);
//   cart.save();
//   res.status(200).json({
//     status: 'success',
//     numOfCartItems: cart.cartItems.length,
//     data: cart,
//   });
// });

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  try {
    
    const cart = await Cart.findOne();
    
    // Find the index of the cart item to remove
    const indexToRemove = cart.cartItems.findIndex(item => item.product.toString() === req.params.itemId);
    
    // Check if the item exists in the cart
    if (indexToRemove !== -1) {
      // Remove the item from the cartItems array
      cart.cartItems.splice(indexToRemove, 1);
      
      // Update any other fields, like totalCartPrice, if necessary
      
      // Save the updated cart
      await cart.save();

      res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
      });
    } else {
      // If the item is not found in the cart, return an error
      return next(new ApiError(`Item with ID ${req.params.itemId} not found in the cart`, 404));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});







// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  // await Cart.findOneAndDelete({ user: req.userId });
  await Cart.findOneAndDelete();
  res.status(200).send({
    success:true,
    message:"cart deleted successfully"
  });
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  // Find the cart
  // const cart = await Cart.findOne();
  // if (!cart) {
  //   return next(new ApiError(`There is no cart in the database`, 404));
  // }
  const cart = await Cart.findOne();
  // Find the index of the item in the cart
  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product._id.toString() === req.params.itemId
  );
  
  if (itemIndex === -1) {
    return next(new ApiError(`There is no item with ID ${req.params.itemId} in the cart`, 404));
  }

  // Update the quantity of the item
  const cartItem = cart.cartItems[itemIndex];
  cartItem.quantity = quantity;
  cart.cartItems[itemIndex] = cartItem;

  // Calculate total cart price
  calcTotalCartPrice(cart);

  // Save the cart
  await cart.save();

  // Send the response
  res.status(200).json({
    status: 'success',
    quantity: cartItem.quantity,
    totalPrice: cart.totalCartPrice,
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});



