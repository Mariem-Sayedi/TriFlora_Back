const mongoose= require('mongoose');


const productSchema= new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, 'too short product title'],
            maxLength: [100, 'too short product title'],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'product description is required'],
            minLength: [20, 'too short product description'],
        },
        
        price: {
            type: Number,
            required: [true, 'product price is required'],
            trim: true,
            max: [200, 'too long product price'],
        },
        colors: [String],
        photo:{
            data:Buffer,
            contentType:String
        },
        imageCover: {
            type: String,
            //required: [true, 'product image cover is required'],
        },
        images: [String],
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'product must belong to a category'],
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'rating must be above or equal 1.0'],
            max: [5, 'rating must be below or equal 5.0'],
        }
    },
   
    { timestamps: true }
);

module.exports= mongoose.model('Product', productSchema);