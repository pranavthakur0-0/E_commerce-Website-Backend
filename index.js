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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(__dirname);


connnectdb();

app.use('/api', authRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>
{
    console.log(`This is in ${PORT} mode`);
})
