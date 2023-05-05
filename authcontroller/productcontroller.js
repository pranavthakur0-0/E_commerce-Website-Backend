const Product = require('../authmodel/productModel');

exports.getallproducts = async (req, res, next) => {
  let { sort, color } = req.query;
  const { item, gender, headerlink } = req.params;
  color = color.split(",").map(color => color.replace(/"/g, '').replace(/'/g, '').trim());

  // Pagination
  const limit = parseInt(req.query.limit, 10) || 10;

  let productsQuery = { gender };

  try {
    // Filter products based on color
    if (Array.isArray(color)) {
      if (color.length > 0 && color[0] !== '') {
        productsQuery.colorCode = { $in: color };
      } else {
        delete productsQuery.colorCode; // Remove colorCode field from productsQuery
      }
    }

    if (headerlink === "Shop by Product") {
      if (item !== "View All") {
        productsQuery.category = item;
      }
    } else if (headerlink && headerlink !== "Shop by Product") {
      let headlink = headerlink;
      productsQuery = { headlink };
      if (item !== "View All") {
        productsQuery.specialTag = item;
      }
    } else {
      productsQuery.category = item;
    }

    const total = await Product.countDocuments(productsQuery);
  
    // Retrieve products with filtered color and apply limit
    const products = await Product.find(productsQuery, { name: 1, price: 1, colorCode: 1, color: 1, image: 1, AllcolorCode: 1, headlink: 1 })
      .sort(JSON.parse(sort))
      .limit(limit);
    //Pagination Result
    res.status(200).json({
      products: products,
      total,
      totalProducts: products.length
    });

  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getSingleProduct= async (req,res,next)=>{
  const {id} = req.params;
  try{
    const product = await Product.find({_id :id})
    res.status(200).json(product);
} catch (err) {
  res.status(400).send(err);
}
  
}

exports.getAllMatchingProduct= async (req,res,next)=>{
  const {name} = req.params;
  try{
    const product = await Product.find({name});
    res.status(200).json(product);
} catch (err) {
  res.status(400).send(err);
}
}

exports.getRecommendedProduct = async (req, res, next) => {
  try {
    // Retrieve all categories from MongoDB
    const categories = await Product.distinct('category');

    // Shuffle the list of categories
    for (let i = categories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [categories[i], categories[j]] = [categories[j], categories[i]];
    }

    // Select the first 10 categories from the shuffled list
    const randomCategories = categories.slice(0, 10);

    // Retrieve products from the selected categories
    const products = await Product.find(
      { category: { $in: randomCategories } },
      { name: 1, price: 1, gender: 1, _id: 1, image: 1 }
    );
    res.status(200).json(products);

  } catch (err) {
    res.status(400).send(err);
  }
}
