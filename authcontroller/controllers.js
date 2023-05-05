const userAccount = require('../authmodel/userRegisterModel')
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const FavAccount = require('../authmodel/favModel');
const BagAccount = require("../authmodel/bagModel");


dotenv.config({path : './config/config.env'});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

const maxage = 3 * 24 * 60 * 60;



const cookieToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn : maxage
    })
}


const emailtoken = (id, email)=>
{  
    try{
  jwt.sign({id}, process.env.SECRET_KEY,{
        expiresIn : maxage,
  
    },
        (err, emailToken) => {
          const url = `http://localhost:4000/api/server/confirmation/${emailToken}`;

          try{
            transporter.sendMail({
                from : process.env.EMAIL_ID,
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
              });
          }catch(err)
          {
                console.log(err);
          }
         
        },
      );
    }
      catch(err){
        console.loge(err);
      }
    
}

exports.register = async (req,res,next)=>
{
    try{
        const {email, password, date, month, year, checked} = req.body;
        const dateOfBirth = new Date(`${year}-${month}-${date}`);
        const user = await userAccount.create({email,password,dateOfBirth, checked});
        emailtoken(user._id, email);
        res.status(201).json({user : user._id,status : true});

    }catch(err)
    {
        console.log(err);
        res.status(401).json({err, status:false});
    }
}   


exports.login = async(req,res,next)=>
{
    try{
        const {email, password, checked} = req.body.info;
        const user = await userAccount.login(email,password);
            const token = cookieToken(user._id);
            
    // To send cookie we also need to accept cookie at client side and their is some code to it

    /*  const data = await axios.post("http://localhost:4000/api/server/login", info,{withCredentials : true,});  
    above code is client side code which is used to accept cookie  */

            res.cookie("Wedesgin_loggedIn_permanent", token, {
                withCredentials : true,
                httpOnly : false,
                maxage : maxage * 1000
            });
            
            res.status(200).json({user : user._id, created : true})
            const data = await BagAccount.findOne({ personid: user._id }) || new BagAccount({ personid: user._id, BagItem: [] });
            await data.save();
            const favac = await FavAccount.findOne({ personid: user._id }) || new FavAccount({ personid: user._id, favItem: [] });
            await favac.save();
            req.decodedToken = user._id;
            next();  
        
        
    }catch(err){
        console.log(err);
        res.status(401).json({err, status:false});
    }
}



exports.activation = async(req,res,next)=>
{
    const token = req.params.token;
    if(token)
    {
        jwt.verify(token, process.env.SECRET_KEY, async(err, decodedtoken)=>
        {
            if(err)  res.status(400).json({status:false});
            else{
                const user = await userAccount.findById(decodedtoken.id);
                if(user)
                {
                    try{
                         //{new:true} is an option that tells Mongoose to return the updated document rather than the original document. 
                        await userAccount.findByIdAndUpdate(user._id, {verified : true})
                        res.redirect("http://localhost:3000/login");
                    }catch(err)
                    {
                        console.log(err);
                    }
                }
            }
        })

    }
}


module.exports.cookie_checker =(req,res,next)=>{
    const token = req.headers['x-csrf-token'];
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, async(err,decodedtoken)=>{
            if(err)
            {       
                res.json({status:false});
            }           
             else{
      
                const user = await userAccount.findById(decodedtoken.id);
                if(user){
                    res.json({status:true, user: user.email});}
                    else res.json({status:false});
            }
        })
    }
    else{
        res.json({status:false});
    }
}


module.exports.getProfile = (req,res,next)=>{
    const token = req.headers['x-csrf-token'];
    if(token) {
         jwt.verify(token, process.env.SECRET_KEY, async(err,decodedtoken)=>{
        if(err)
        {       
            res.json({status:false});
        }           
         else{
            //0 means it will not return that value back to user
            const user = await userAccount.findById(decodedtoken.id, { password : 0, verified:0, checked:0 });
            if(user){
                res.json({status:true, user: user});}
                else res.json({status:false});
            }
         })
    }
    else{
            res.json({status:false});
    }
}