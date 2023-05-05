const LinkGroup = require('../authmodel/linkGroupModel')
const Product = require('../authmodel/productModel');

exports.AddLinks = async (req, res, next) => {
  const { gender, headlinks, priority, sublinks } = req.body;

  try {
    const newLinkGroup = new LinkGroup({
      gender,
      headlinks,
      priority,
      sublinks: sublinks.map((link) => ({ link })),
    });
    const savedLinkGroup = await newLinkGroup.save();
    res.status(201).json(savedLinkGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


exports.getLinks = async (req, res, next) =>{
    const gender = req.params.gender;
    try{
        if(gender=="all"){
            const links = await LinkGroup.find({},{ _id : 0}).sort({priority:1});
            res.json({status:true, links});
        }
        else if(gender){
            const links = await LinkGroup.find({gender},{ _id : 0, gender:0}).sort({priority:1});
            res.json({status:true, links});
        }
    }catch(err){
        console.log(err);
    }
}


exports.getAllcolor = async (req,res,next)=>{
  try{
    let colorArray = []
    const color = await Product.find({}, {color: 1, colorCode: 1});
    color.map((item)=>{
      if(!colorArray.some(obj => obj.color === item.color)){
        colorArray.push({color: item.color, colorCode: item.colorCode});
      }
    })
    res.json({status:true, colorArray});
  }catch(err){
    console.log(err);
  }
}
