const express = require('express');
const app = express();
const cors = require('cors');
const authRoute = require('./authroutes/Routes.js');
const connnectdb = require('./authdatabase/db.js')
const dotenv = require('dotenv');
const cookieparser  = require("cookie-parser");
const path = require('path');

dotenv.config({path : './config/config.env'});


app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:["https://wedesignclothing.netlify.app/"],
    methods: ["GET", "POST", "DELETE"], 
    credentials:true,
  })
)
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://wedesignclothing.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(__dirname);


connnectdb();

app.use('/api', authRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>
{
    console.log(`This is in ${PORT} mode`);
})
