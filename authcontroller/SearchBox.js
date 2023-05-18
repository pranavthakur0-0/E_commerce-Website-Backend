const Product = require('../authmodel/productModel');

exports.SearchBoxRecommendation = async (req, res, next) => {
    try {
      const query = req.query.query;
  
      // Perform search operation based on the query
      // Replace this with your actual search implementation logic
  
      // Example response with dummy suggestions
      const menClothingSearches = {
        categories: [
          'men',
          'women',
          'cargo pants',
          'pants',
          'shirts',
          't-shirts',
          'women shirts',
          'men shirts',
          'shirts',
          'polos',
          'blazers',
          'sweaters',
          'jackets',
          'coats',
          'jeans',
          'shorts',
          'suits',
          'dress shirts',
          'hoodies',
          'sweatshirts',
          'vests',
          'pajamas',
          'swimwear',
          'underwear',
          'socks',
          'activewear',
          'sport coats',
          'ties',
          'tank tops',
          'chinos',
          'cardigans',
          'overcoats',
          'track pants',
          'dress pants',
          'leather jackets',
          'denim jackets',
          'windbreakers',
          'parkas',
          'pullovers',
          'rugby shirts',
          'flannel shirts',
          'turtlenecks',
          'henley shirts',
          'baseball tees',
          'workout shirts',
          'jerseys',
          'cargo shorts',
          'bermuda shorts',
          'gym shorts',
          'chino shorts',
          'trousers',
          'thermal underwear',
          'boxer briefs',
          'crew socks',
          'slip-on sneakers',
          'boots',
          'loafers',
          'oxford shoes',
        ],
      };
  
      // Filter the recommendations based on the query
      const filteredRecommendations = menClothingSearches.categories.filter((category) => {
        const lowercaseCategory = category.toLowerCase();
        const lowercaseQuery = query.toLowerCase();
  
        return lowercaseCategory.startsWith(lowercaseQuery);
      });
  
      // Limit the recommendations to five
      const limitedRecommendations = filteredRecommendations.slice(0, 5);
  
      res.json(limitedRecommendations);
    } catch (error) {
      next(error);
    }
  };
  

