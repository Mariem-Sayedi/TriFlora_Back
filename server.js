const express= require('express');
const dotenv= require('dotenv');
const morgan= require('morgan')


dotenv.config({ path: 'config.env'});
const dbConnection= require('./config/database');
const categoryRoute= require('./routes/categoryRoute');
const sellerRoute= require('./routes/sellerRoute');
const productRoute= require('./routes/productRoute');
const userRoute= require('./routes/userRoute');
const authRoute= require('./routes/authRoute');
const cartRoute= require('./routes/cartRoute');
const orderRoute= require('./routes/orderRoute');


//connect with db
dbConnection();


//express app
const app= express();

//Middlewares
app.use(express.json());
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}



//mount routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/sellers', sellerRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/order', orderRoute);



const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=> {
    console.log(`app running on port ${PORT}`);
});