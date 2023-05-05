const BagAccount = require("../authmodel/bagModel");
const Product = require('../authmodel/productModel');

exports.addToBag = async(req,res,next)=>{
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  const product = req.body;
  let bag = await BagAccount.findOne({ personid: decodedToken?.id || tempId }) || new BagAccount({ personid: decodedToken?.id || tempId, BagItem: [] });;
  const existingItem = bag.BagItem.find((item) => item.size.toString() === product.size.toString() && item.productId.toString() === product.productId.toString());
  if (existingItem) {
    existingItem.count += 1;
    bag.markModified('BagItem'); // Mark BagItem as modified
//  markModified is a method provided by Mongoose that tells Mongoose to mark a specific path in a document as modified, which means that Mongoose will know to persist the change to the database on the next save operation.
// In this case,  try using markModified to mark the BagItem array as modified before calling save() on the bag document
    await bag.save();
    res.status(200).json({ status: true, bag: bag.BagItem });
  } else {
    // add the new product to the bag
    bag.BagItem.push({
      ...product,
      count: 1,
    });
    await bag.save();
    res.status(200).json({ status: true, bag: bag.BagItem });
  }
}


exports.getBag = async(req, res, next) => {
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  try {
    let data = await BagAccount.findOne({ personid: decodedToken?.id || tempId }) || new BagAccount({ personid: decodedToken?.id || tempId, BagItem: [] });
    const productIds = data.BagItem.map((item) => item.productId);
    const products = await Product.find(
      { _id: { $in: productIds } },
      { name: 1, price: 1, category: 1, fit: 1, plength: 1, color: 1, image: 1 , specialTag:1 }
    );
    const result = [];
    data.BagItem.forEach((Dataitem) => {
      const BagItem = products.find(
        (item) => item._id.toString() === Dataitem.productId.toString()
      );
      if (BagItem) {
          result.push({
            ...BagItem._doc,
            size: Dataitem.size,
            count: Dataitem.count
          });
        }
      
    });
    res.status(200).json(result); // send the products with sizes and counts back in the response
  } catch (err) {
    res.status(400).json({ status: false });
  }
};



exports.deleteItem = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  const { productId, size } = req.params;
  try {
    const bag = await BagAccount.findOne({ personid: decodedToken?.id || tempId });
    if (!bag) {
      return res.status(404).json({ message: "Bag not found" });
    }
    const updateBagItem = bag.BagItem.filter(
      (item) => item.productId !== productId || item.size !== size
    );
    bag.BagItem = updateBagItem; // Update bag.BagItem with the filtered array
    await bag.save(); // Save the updated bag object to the database
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};




exports.getBagCount = async(req,res,next)=>{
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  try{
    let Bag = await BagAccount.findOne({ personid: decodedToken?.id || tempId }) || new BagAccount({ personid: decodedToken?.id || tempId, BagItem: [] });
    Bag = Bag.BagItem.length;
    res.status(200).json({ status: true, count : Bag });
  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
}

exports.changeProductCount = async (req,res,next)=>{
  const {productId, size, countval} = req.body;
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  try{
    let bagAccount = await BagAccount.findOne({ personid: decodedToken?.id || tempId }) || new BagAccount({ personid: decodedToken?.id || tempId, BagItem: [] });
    // Find the index of the product with productId and size in the BagItem array
    const index = bagAccount.BagItem.findIndex(item => item.productId === productId && item.size === size);
    if (index !== -1) {
      // Update the countval of the found product
      bagAccount.BagItem[index].count = countval;
      bagAccount.markModified('BagItem');
      await bagAccount.save();
      res.status(200).json({ status: true });
    } else {
      console.log('Product not found');
      res.status(400).json(err);
    }
  } catch(err){
    console.log(err);
    res.status(400).json(err);
  }
}
