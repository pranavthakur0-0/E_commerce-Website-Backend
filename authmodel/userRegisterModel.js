const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userAccount = new mongoose.Schema({  
    email: {
        type: String,
        required: [true, "Date of birth is required"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        unique: true,
      },
      password : {
        type: String,
        required: [true, "Password is required"],
    },
    firstname : {
        type: String,
        maxlength: 20,
        match: /^[^0-9]*$/
    },
    lastname : {
        type: String,
        maxlength: 20,
        match: /^[^0-9]*$/
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
        }
      },
      postal: {
        type: Number,
        validate: {
          validator: function(v) {
            return /^[0-9]{6}$/.test(v.toString()); // validate that the value contains only digits and has a length of 6
          },
          message: 'Pincode must be a number of 6 digits'
        }
      },
    dateOfBirth : {
        type: Date,
        required: [true, "Date of birth is required"],
    },
    verified: {
        type: Boolean,
        default: false
    },
    gender : {
      type :String,
      maxlength: 20
    },
    market: {
      type :String,
      maxlength: 20
    },
    staff : {
      type :String,
      maxlength: 20
    },
    address1 : {
      type :String,
      maxlength: 80
    },
    address2 : {
      type :String,
      maxlength: 80
    },
    city : {
      type :String,
      maxlength: 40
    },
    state : {
      type :String,
      maxlength: 40
    }
})


userAccount.pre("save", async function(next){
    /*    

    In Mongoose, pre is a middleware function that allows you to execute code before or after certain operations on a document occur.
    That code I provided, userschema.pre("save", async function(next) {...}, is defining a pre-save hook for a Mongoose schema called userschema. This hook will be executed before a document of this schema is saved to the database.
    The function passed as the second argument to pre is a middleware function that takes a next parameter. When called, this function will execute some code, and then call next() to pass control to the next middleware function in the chain. If next() is not called, the middleware chain will be halted.
    Typically, you would use a pre-save hook to modify or validate a document before it is saved to the database. For example, you might use a pre-save hook to automatically generate a timestamp or to hash a password. 
    
    */
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})




userAccount.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            if(user.verified){
                return user;
            }
            else{
                throw Error("User is Not Verified");
            }
        }else{
            throw Error("Incorrect password");
        }
    }else{
        throw Error("Incorrect Email");
    }
}

module.exports = mongoose.model("useraccount", userAccount);