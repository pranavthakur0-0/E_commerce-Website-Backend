const FavAccount = require('../authmodel/favModel');
const Product = require('../authmodel/productModel');

exports.getFav = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  const tempId = req.tempId;
  try {
    const user = await FavAccount.findOne({ personid: decodedToken?.id || tempId }) || new FavAccount({ personid: decodedToken?.id || tempId, favItem: [] });
    res.status(200).json({ status: true, fav: user.favItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

exports.addFav = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  const {ItemId} = req.body;
  const tempId = req.tempId;
  const fav = await FavAccount.findOne({ personid: decodedToken?.id || tempId }) || new FavAccount({ personid: decodedToken?.id || tempId, favItem: [] });
  const existing = fav.favItem.includes(ItemId);
  if (existing) {
    fav.favItem = fav.favItem.filter((item) => item !== ItemId);
  } else {
    if (ItemId !== null) {
      fav.favItem.push(ItemId);
    }
  }
  await fav.save();
  res.status(200).json({ status: true, fav: fav.favItem });
};




exports.AllFavProducts = async (req,res,next)=>{
  const {fav} = req.body;
  try{
      const allProducts = await Product.find({ _id: { $in: fav }},{name : 1, price:1, color : 1, image : 1});
      res.status(200).json({ status: true, Allproduct: allProducts });

  } catch(err){
      res.status(400).json({ status: false });
  }
}



  exports.deleteFavItem = async(req,res,next)=>{
    const decodedToken = req.decodedToken;
    const productId = req.params.productId;
    const tempId = req.tempId;
    try{
        const data =  await FavAccount.updateOne({ personid: decodedToken?.id || tempId }, // specify the query to find the document to update
        { $pull: { favItem: productId } } // use $pull operator to remove the item from the favItem array
        )
        if(data){
            res.status(200).json({ status: true, data });
        }
    } catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

