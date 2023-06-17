const express = require('express');
const router = express.Router();
const {register,
       login, 
       activation, 
       cookie_checker, 
       getProfile,
       editProfile
       } = require('../authcontroller/controllers.js')

const {singlefile, getallproducts, getSingleProduct, getAllMatchingProduct, getRecommendedProduct, reduceCount}= require('../authcontroller/productcontroller.js');
const {upload} = require('../middleware/fileUpload.js')
const {navlinks}=require('../authcontroller/navlinkcontroller.js');

const {AddLinks, getLinks, getAllcolor} = require('../authcontroller/mainlinkscontroller.js')

const {getFav, addFav, AllFavProducts, deleteFavItem} = require('../authcontroller/favcontroller.js')

const {addToBag, getBag, deleteItem, getBagCount, changeProductCount} = require('../authcontroller/bagcontroller.js')

const {getorderdetails, editorderdetails, getorderuser , addToOder, emptybag, getOrder} = require('../authmodel/ordercontroller.js')


const {checkUser} = require('../authcontroller/userCheckercontroller.js')


const {GetCategoryLinks,  multipeUpload} = require('../authcontroller/admincontroller.js')


const {tempId, tempToReal} = require('../authcontroller/tempcontroller.js')
const  {SearchBoxRecommendation, ProductSearch} = require('../authcontroller/SearchBox.js')
//temp route

router.route('/server/getTempId').get(tempId)

//change temp item to Real account 


//auth route
router.route('/server/register').post(register);
router.route('/server/login').post(login, tempToReal);
router.route('/server/cookie').get(cookie_checker);
router.route('/server/confirmation/:token').get(activation);
router.route('/server/profile').get(checkUser, getProfile).post(checkUser, editProfile);



//order route
router.route('/server/order/user').get(checkUser, getorderuser);
router.route('/server/order').get(checkUser, getorderdetails).post(checkUser, editorderdetails, reduceCount, addToOder, emptybag);
router.route('/server/getOrder').get(checkUser, getOrder);
//products route 

//to get all products

router.get('/server/admin/products', getallproducts);

//get all products related to selected product
router.route('/server/admin/products/:name').get(getAllMatchingProduct);
router.route('/server/products/:category').get(getRecommendedProduct);
//get Single product for product page 
router.route('/server/getsingle/product/:id').get(getSingleProduct);

//Main Person Links route
router.route('/server/page_links').post(AddLinks);

router.route('/server/getLinks/:gender').get(getLinks);

router.route('/server/getcolor').get(getAllcolor);

//Add and Get Fav Products
router.route('/server/fav_products/all').post(AllFavProducts);

router.route('/server/fav_products').get(checkUser,getFav).post(checkUser, addFav)

router.route("/server/fav_products/:productId/").delete(checkUser, deleteFavItem);
//Bag Api
//Add item to the bag //Get Items from Bag
router.route('/server/bag_item').get(checkUser, getBag).post(checkUser, addToBag);
router.route('/server/bag_item/:productId/:size').delete(checkUser, deleteItem);
router.route('/server/bag_item/count').get(checkUser, getBagCount).post(checkUser,changeProductCount);





//this is for admin dashboard
//to get category links for adding a product into the database
router.post('/server/admin/products', upload, multipeUpload);
router.route('/server/admin/link').get(GetCategoryLinks);


//serchbox request
router.route('/server/search').get(SearchBoxRecommendation);
module.exports = router;