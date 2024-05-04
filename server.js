const express= require('express');
const dotenv= require('dotenv');
const morgan= require('morgan')



const dbConnection= require('./config/database');
const categoryRoute= require('./routes/categoryRoute');
const sellerRoute= require('./routes/sellerRoute');
const productRoute= require('./routes/productRoute');
const userRoute= require('./routes/userRoute');
const authRoute= require('./routes/authRoute');
const cartRoute= require('./routes/cartRoute');
const orderRoute= require('./routes/orderRoute');
const sellersRequestsRoute= require('./routes/sellersRequestsRoute');

const cors = require('cors');

dotenv.config({ path: './.env' });
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); //  frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(cors());


//mount routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/sellers', sellerRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/sellersRequest', sellersRequestsRoute);



const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=> {
    console.log(`app running on port ${PORT}`);
});