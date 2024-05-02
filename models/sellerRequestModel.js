const mongoose = require('mongoose');


const sellerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });


const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);

module.exports = SellerRequest;
