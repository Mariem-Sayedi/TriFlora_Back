const mongoose = require('mongoose');

//create schema
const SellerSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name required'],
        minLength: [3, 'Too short first name'],
        maxLength: [20, 'Too long first name'],
    },
    lastName: {
        type: String,
        required: [true, 'last name required'],
        minLength: [3, 'Too short last name'],
        maxLength: [20, 'Too long last name'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        maxLength: [20, 'Too long email name'],
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minLength: [8, 'Too short password '],
        maxLength: [15, 'Too long password '],
    },
  
    image: String,
},
{ timestamps: true }
);

//create model
const SellerModel= mongoose.model('Seller', SellerSchema);


module.exports= SellerModel;