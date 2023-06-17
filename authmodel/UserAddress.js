const mongoose = require('mongoose');

const UserAddr = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'useraccounts',
    required: true
  },
    firstname : {
        type: String,
        maxlength: 20,
        match: /^[^0-9]*$/,
        required: [true, "Please add your firstname"],
    },
    lastname : {
        type: String,
        maxlength: 20,
        match: /^[^0-9]*$/,
        required: [true, "Please add your lastname"],
    },
    phonenumber: {
        type: Number,
        max: 999999999999, // set maximum value to 12 digits
        min: 0, // set minimum value to 0
        validate: {
          validator: function(v) {
            return /^[0-9]{1,12}$/.test(v); // validate that the value contains only digits and has a length of 1 to 12
          },
          message: 'Number must be a string of 1 to 12 digits'
        },
        required: [true, "Please add your Phone Number"],
      },
      postal: {
        type: Number,
        validate: {
          validator: function(v) {
            return /^[0-9]{6}$/.test(v.toString()); // validate that the value contains only digits and has a length of 6
          },
          message: 'Pincode must be a number of 6 digits'
        },
        required: [true, "Please add your Postal Number"],
      },
    date : {
        type: Number,
        maxlength: 2,
        required: [true, "Date of birth is required"],
        
    },
    month : {
      type: Number,
      maxlength: 2,
      required: [true, "Date of birth is required"],
      
  },
  year : {
    type: Number,
    maxlength: 4,
    required: [true, "Date of birth is required"],
    
},
    address1 : {
        type :String,
        maxlength: 80,
        required: [true, "Please add your Address Line 1"],
      },
      address2 : {
        type :String,
        maxlength: 80,
        required: [true, "Please add your Address Line 2"],
      },
      city : {
        type :String,
        maxlength: 40,
        required: [true, "Please add your City"],
      },
      state : {
        type :String,
        maxlength: 40,
        required: [true, "Please add your State"],
      },
      paymentType : {
        type :String,
        maxlength: 40,
        required: [true, "Please add your Payment Type"],
      }
})


const UserAddress = mongoose.model('UserAddr' , UserAddr);

module.exports = UserAddress;