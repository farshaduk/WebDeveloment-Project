const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan =require('morgan');
const bodyParser = require('body-parser');
const cookieParse = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv= require('dotenv');

dotenv.config();

//db
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Db Connected'));

mongoose.connection.on('error',err=> {
    console.log(`Db Connection Error : ${err.message}`);
});

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParse());



app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use(function (err,req,res,next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json({error:'invalid user, please login first...'})
    }
});

const port = process.env.port || 8081;
app.listen(port,()=>
{ console.log(`Serve is listening on port: ${port}`)
});