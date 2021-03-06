const express = require("express");
const { body } = require("express-validator");

const {
  getCategory,
  getSubcategoryByCategory,
  getProductByCategory,
  getProduct,
  getProductById,
  getProductBySubcategory,
  createCart,
  getCartProductByUserId,
  deleteCartById,
  createOrder,
  getOrdersByUserId,
  getCoustumerById,
  updateuser,
  deletesingleById,
  getSearchResult,
  getOrdersByUserIdAndUserid,
  createAddress,
  getUserAddressById,
  deleteAddressById,
} = require("../controller/client");

const Customer = require("../model/customer");
const { getBrand } = require("../controller/admin");
const { login, createCustomer } = require("../controller/clientauth");
const { notification } = require("../controller/notification");
const router = express.Router();

//Signup

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Customer.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("EMAIL_EXIST");
          }
        });
      })
      .normalizeEmail(),

    body("name").trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  createCustomer
);

router.put(
  "/user/:user_id",
  [
    body("email").isEmail().normalizeEmail(),

    body("pincode")
      .trim()
      .isLength(6)
      .withMessage("Please enter valid pincode"),
    body("name").trim().not().isEmpty(),
    body("address").trim().not().isEmpty(),
    body("city").trim().not().isEmpty(),
    body("state").trim().not().isEmpty(),
  ],
  updateuser
);

router.post("/login", login);

//Category
router.get("/brand", getBrand);
router.get("/category", getCategory);
router.get("/category/:_id", getSubcategoryByCategory);
router.get("/product", getProduct);
router.get("/product/:_id", getProductById);
router.get("/product/category/:_id", getProductByCategory);
router.get("/product/sub/:_id", getProductBySubcategory);

router.post("/cart", createCart);
router.get("/cart/:userid", getCartProductByUserId);
router.delete("/cart/:userid", deleteCartById);
router.delete("/singlecart/:id", deletesingleById);

router.post("/order", createOrder);
router.get("/order/:userid", getOrdersByUserId);
router.get("/user/:_id", getCoustumerById);
router.get("/singleorder/:refid", getOrdersByUserIdAndUserid);
router.put("/user/:user_id", updateuser);

router.post("/search", getSearchResult);

router.post("/address", createAddress);
router.get("/address/:userid", getUserAddressById);
router.delete("/address/:id", deleteAddressById);

router.post("/notification", notification);
module.exports = router;
