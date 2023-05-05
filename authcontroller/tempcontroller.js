const TempId = require("../authmodel/tempModel");
const dotenv = require('dotenv');
const BagAccount = require("../authmodel/bagModel");
const FavAccount = require('../authmodel/favModel');

dotenv.config({path : './config/config.env'});

exports.tempId = async (req, res, next) => {
  try {
    const response = await TempId.create({});
    const token = response.id;
    res.status(200).json({ token, created: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create TempId' });
  }
}



exports.tempToReal = async (req, res, next) => {
  const decodedToken = req.decodedToken;
  const clienttempID = req.body.tempId;
  let tempAcc = await FavAccount.findOne({ personid: clienttempID });
  let realAcc = await FavAccount.findOne({ personid: decodedToken });
  if (tempAcc && realAcc) {
    realAcc.favItem = realAcc.favItem.concat(tempAcc.favItem);
    await realAcc.save();
    await FavAccount.findByIdAndDelete(tempAcc._id);
  }
  tempAcc = await BagAccount.findOne({ personid: clienttempID });
  realAcc = await BagAccount.findOne({ personid: decodedToken });
  if (tempAcc && realAcc && tempAcc.BagItem!==0) {
    for (const tempItem of tempAcc.BagItem) {
      const existingItem = realAcc.BagItem.find(
        (item) => item.productId === tempItem.productId && item.size === tempItem.size
      );
      console.log(existingItem);
      if (existingItem) {
        existingItem.count += tempItem.count;
      } else {
        realAcc.BagItem.push(tempItem);
      }
    }
    realAcc.markModified('BagItem');
    await realAcc.save();
    await BagAccount.findByIdAndDelete(tempAcc._id);
  }
  const removetemp = await TempId.deleteOne({id: clienttempID});
};


