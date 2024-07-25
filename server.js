// external imports
const express = require('express');
const clc = require('cli-color');
require('dotenv').config();
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);


// file exports
require('./dbConnection');
const authRouter = require('./routers/authRouter');
const blogRouter = require('./routers/blogRouter');
const isAuthMiddleware = require('./middlewares/isAuthMiddleware');
const followRouter = require('./routers/followRouter');
const cleanupBin = require('./models/trashBlogCleanup');

const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
    uri : process.env.MONGO_URI,
    collection : "sessions",
})

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret : process.env.SECRET_KEY,
    store : store,
    resave : false,
    saveUninitialized : false,
}));

// router middlewares
app.use('/auth',authRouter);                    // for endpoints ->  /auth/login or /auth/register
app.use('/blog',isAuthMiddleware,blogRouter);                    // for endpoints-> /blog/create-blog , etc
app.use('/follow',isAuthMiddleware,followRouter); 

// api's
app.get('/',(req,res)=>{
    return res.send('hehe');
})



// listening server
app.listen(PORT,()=>{
    console.log(clc.yellowBright("Server is running on",`http://localhost:${PORT}`));
    cleanupBin();  
})