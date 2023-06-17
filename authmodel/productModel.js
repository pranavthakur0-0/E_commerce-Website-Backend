const mongoose = require('mongoose');

const products = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    headlink : {
      type: String,
      default : "N/A"
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    description:{
      type: String,
      required: [true, "Description is required"],
    },
    fit:{
      type: String,
      required: [true, "Fitting is required"],
    },
    composition:{
      type: String,
      required: [true, "Composition is required"],
    },
    productlength : {
      type: String,
      required: [true, "Length is required"],
    },
    colorCode : {
      type: String,
      required: [true, "Length is required"],
    },
    AllcolorCode : [],
    count: {
      type: Number,
      default: 0,
    },
    specialTag: {
      type: String,
      default: "N/A", // Updated default value to a string
    },
    image: [],
  });
  

module.exports = mongoose.model("products", products)