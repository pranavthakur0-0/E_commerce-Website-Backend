const UserAddress = require("./UserAddress.js");
const userAccount = require('./userRegisterModel.js');
const OrderModel = require("./orderModel.js");
const BagAccount = require("./bagModel.js");


module.exports.getorderdetails = async()=>{

}

module.exports.getorderuser = async (req, res, next) => {
    try {
      const personId = req.decodedToken.id;
      const user = await UserAddress.findOne({ personId });
      if (user) {
        return res.json({ status: true, user });
      } else {
        return res.json({ status: false });
      }
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error in getorderuser:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  module.exports.editorderdetails = async (req, res, next) => {
    console.log("hello");
    try {
      const { firstname, lastname, date, month, year, phonenumber, address1, address2, city, postal, state, paymentType } = req.body.addinfo;
      const personId = req.decodedToken.id;
  
      const user = await userAccount.findById(personId).select('email');
  
      if (!user || !user.email) {
        return res.status(400).json({ error: 'User email not found' });
      }
  
      const email = user.email;
      if(email){
        req.email = email;
      }
      console.log(email);
      const useradd = await UserAddress.findOne({ personId: personId }).select('personId');
      let update_Add;
      if (useradd && useradd.personId.toString() === req.decodedToken.id) {
        update_Add = await UserAddress.updateOne({ firstname, lastname, email, date, month, year, phonenumber, address1, address2, city, postal, state, personId, paymentType });
      } else {
        update_Add = await UserAddress.create({ firstname, personId, lastname, email, date, month, year, phonenumber, address1, address2, city, postal, state, paymentType });
      }
      next();
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  module.exports.addToOder = async(req,res,next)=>{
    try {
      const personId = req.decodedToken.id;
      const email = req.email;
      const { firstname, lastname, date, month, year, phonenumber, address1, address2, city, postal, state, paymentType } = req.body.addinfo;
      const cartdata = req.body.cartdata;
      const totalAmt = req.body.totalAmt;
  
      const existingOrder = await OrderModel.findOne({ personId });
  
      if (existingOrder) {
        // Update existing order
        existingOrder.orders.push({
          cartdata: cartdata,
          email: email,
          addinfo: {
            firstname: firstname,
            lastname: lastname,
            date: date,
            month: month,
            year: year,
            phonenumber: phonenumber,
            address1: address1,
            address2: address2,
            city: city,
            postal: postal,
            state: state,
            paymentType: paymentType
          },
          timestamp: new Date(),
          progress: [
            {
              status: 'Order received',
              timestamp: new Date()
            }
          ],
          total: totalAmt
        });
  
        await existingOrder.save();
        next();
      } else {
        // Create a new order
        const orderData = {
          personId: personId,
          orders: [
            {
              cartdata: cartdata,
              email: email,
              addinfo: {
                firstname: firstname,
                lastname: lastname,
                date: date,
                month: month,
                year: year,
                phonenumber: phonenumber,
                address1: address1,
                address2: address2,
                city: city,
                postal: postal,
                state: state,
                paymentType: paymentType
              },
              timestamp: new Date(),
              progress: [
                {
                  status: 'Order received',
                  timestamp: new Date()
                }
              ],
              total: totalAmt
            }
          ]
        };
  
        await OrderModel.create(orderData);
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  module.exports.emptybag = async(req,res,next)=>{
    const personId = req.decodedToken.id;
    const email = req.email;
        try{
          await BagAccount.findOneAndUpdate({personid : personId},  { BagItem: [] },{ new: true });
          res.status(200).json({ msg: 'order_confirmed', email });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
        }
  }


  module.exports.getOrder = async (req, res, next) => {
    const personId = req.decodedToken.id;
    try {
      const order = await OrderModel.findOne({ personId });
      const orderdetails = order.orders;
      console.log(order.orders);
      res.status(200).json({order : orderdetails});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  