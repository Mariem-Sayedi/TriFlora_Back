const mongoose = require('mongoose');

//create schema
const categorySchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minLength: [3, 'Too short category name'],
        maxLength: [32, 'Too long category name'],
    },

    // A and B =>a-and-b
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
},
{ timestamps: true }
);

//create model
const CategoryModel= mongoose.model('Category', categorySchema);


module.exports= CategoryModel;