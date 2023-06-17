const LinkGroup = require('../authmodel/linkGroupModel')
const Product = require('../authmodel/productModel')

exports.GetCategoryLinks = async (req, res, next) => {
  const { gender } = req.query;

  try {
    const query = gender ? { gender } : {};
    const links = await LinkGroup.find(query, { headlinks: 1, sublinks: 1 });
    res.status(200).json({ status: true, links });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false });
  }
};


exports.multipeUpload = async (req, res, next) => {
    try {

      const { name, price, gender, category, description, fit, composition, productlength, colorCode, headlink ,color, count} = JSON.parse(req.body.text);
      console.log("name : ", name);
      const files = req.files;
      let ImageArray = [];
      for (const file of files) {
        const newName = `${name}-${file.originalname}`;
        const fileUrl = `http://localhost:4000/uploads/${newName}`;
        ImageArray.push(fileUrl);
      }
      let ColorCodeArray = [];
      
      const response = await Product.find({name}, {AllcolorCode: 1});
      if (response.length !== 0) {
        response.map((item) => {
          item.AllcolorCode.map((code)=>{
            if(!ColorCodeArray.includes(code))
            {
              ColorCodeArray.push(code);
            }
          });
        });
      }
      ColorCodeArray.push(colorCode);
        await Product.updateMany({ _id: { $in: response.map(item => item._id) } }, { $set: { AllcolorCode: ColorCodeArray } });
  
      const product = new Product({
        name,
        price,
        gender,
        category,
        color,
        description,
        headlink,
        fit,
        colorCode,
        AllcolorCode: ColorCodeArray,
        composition,
        productlength,
        count,
        image: ImageArray,
      });
      
      await product.save();
     // Update colorCode for all products in response
  
     
      res.status(201).send("File Uploaded Success");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  