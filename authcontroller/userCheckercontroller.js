const jwt = require("jsonwebtoken")
const TempId = require("../authmodel/tempModel");

exports.checkUser = async(req,res,next)=>{
    const token = req.headers["x-csrf-token"];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedtoken) => {
          if (err) res.status(400).json({ status: false });
          else {
            req.decodedToken = decodedtoken; // store decoded token in request object
            next();
          }
        });
      }
      else{
        const clienttempID = req.headers['temp-id'];
        try{
          const tempId = await TempId.findOne({ id: clienttempID });
          if(tempId){
            req.tempId = tempId.id;
            next();
          }
        }catch(err){
          console.log(err);
        }
      }
}