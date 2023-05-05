const mongoose  = require('mongoose');



const connectdb = async()=>{
    mongoose.set("strictQuery", false);
    /* The mongoose.set("strictQuery", false) statement is used to disable strict mode for query validation in Mongoose. By default, Mongoose is set to strict mode, which means that any property that is not defined in the schema will not be saved to the database.
    When strict mode is disabled, Mongoose will allow any property to be saved to the database, even if it is not defined in the schema. This can be useful in situations where you have dynamic schemas or when you want to save additional data that is not defined in the schema.
    However, it's important to note that disabling strict mode can also lead to unexpected results or errors if the data being saved is not properly validated. Therefore, it's important to use this feature carefully and only when necessary.*/
    const connnect = await mongoose.connect(`${process.env.MONGO_URI}`,);
    //Imgportant
    /*`${process.env.MONGO_URI}` must be string other it will give error */
    console.log(`mongoos connected ${connnect.connection.host}`);
}
module.exports = connectdb;