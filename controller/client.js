const Category = require("../model/category");
const Subcategory = require("../model/subcategory");
const Product = require("../model/product");
const Customer = require("../model/customer");
const Order = require("../model/order");
const Brand = require("../model/brand");
const Address = require("../model/address");
const { validationResult } = require("express-validator");
const Cart = require("../model/cart");
const jwt = require("jsonwebtoken");
const { notification, notifications } = require("./notification");
//Signup

//Mesage

const accountSid = "AC3d01a64325cc821c8e950fdf445582be";
const authToken = "dba4ce4c7445832748c8ae056ccbe8e7";
const client = require("twilio")(accountSid, authToken);

//Message

exports.createCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.data = errors.array();
    throw error;
  }

  const userid = req.body.mobile;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const name = req.body.name;
  const address = req.body.address;
  const pincode = req.body.pincode;
  const city = req.body.city;
  const state = req.body.state;

  const user = new Customer({
    userid: userid,
    mobile: mobile,
    email: email,
    name: name,
    address: address,
    pincode: pincode,
    city: city,
    state: state,
  });

  user
    .save()
    .then((loadeduser) => {
      const token = jwt.sign(
        {
          name: loadeduser.name,
          mobile: loadeduser.mobile,
          userId: loadeduser._id.toString(),
        },
        "dholpurclientsecretwalasecret",
        { expiresIn: "7 days" }
      );

      res.status(201).json({
        message: "User created",
        token: token,
        name: loadeduser.name,
        userId: loadeduser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCoustumerById = (req, res, next) => {
  const _id = req.params._id;
  Customer.findById(_id).then((result) => {
    res.status(200).json({
      data: result,
    });
  });
};
//signupend 5f1846bb2324d526045effa0

exports.loginCustomer = (req, res, next) => {
  const mobile = req.body.mobile;

  Customer.findOne({ mobile: mobile })
    .then((user) => {
      if (!user) {
        const error = new Error("USER DOES NOT EXIST");
        error.statusCode = 401;
        throw error;
      }
      loaduser = user;
      return loaduser;
    })
    .then((loadeduser) => {
      const token = jwt.sign(
        {
          name: loadeduser.name,
          mobile: loadeduser.mobile,
          userId: loadeduser._id.toString(),
        },
        "dholpurkasecretwalasecret",
        { expiresIn: "7 days" }
      );
      res.status(200).json({
        token: token,
        name: loadeduser.name,
        userId: loadeduser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Login user

exports.getCategory = (req, res, next) => {
  Category.find()
    .sort({ _id: -1 })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

exports.getProductByCategory = (req, res, next) => {
  const category = req.params._id;
  Product.find({ category: `${category}`, status: "active" })
    .sort({ _id: -1 })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

//Blog
exports.getSubcategoryByCategory = (req, res, next) => {
  const category = req.params._id;
  Subcategory.find({ category: `${category}` })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

//Product

exports.getProduct = (req, res, next) => {
  Product.find({ status: "active" })
    .sort({ _id: -1 })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    });
};

exports.getProductById = (req, res, next) => {
  const _id = req.params._id;
  Product.findById(_id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

exports.getProductBySubcategory = (req, res, next) => {
  const subcategory = req.params._id;
  Product.find({ subcategory: `${subcategory}`, status: "active" })
    .sort({ _id: -1 })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

//Cart

exports.createCart = (req, res, next) => {
  const user = req.body.userid;
  const product = req.body.productid;
  const quantity = req.body.quantity;

  Product.findById(product).then((result) => {
    console.log("Result : " + result);
    const sku = result.sku;
    const title = result.title;
    const imageurl = result.imageurl;
    const costprice = result.costprice;
    const sellingprice = result.sellingprice;

    const list = new Cart({
      userid: user,
      productid: product,
      quantity: quantity,
      sku: sku,
      title: title,
      imageurl: imageurl,
      costprice: costprice,
      sellingprice: sellingprice,
    });

    list.save().then((result) => {
      res.status(200).json({
        message: "Added to Cart",
        data: result,
      });
    });
  });
};

exports.getCartProductByUserId = (req, res, next) => {
  const user = req.params.userid;
  const productdata = [];
  Cart.find({ userid: `${user}` })
    .sort({ _id: -1 })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    });
};

exports.deleteCartById = (req, res, next) => {
  const userid = req.params.userid;
  Cart.remove({ userid: `${userid}` })
    .then((result) => {
      res.status(200).json({
        data: "Removed successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};
exports.deletesingleById = (req, res, next) => {
  const id = req.params.id;
  Cart.findByIdAndRemove(id)
    .then((result) => {
      res.status(200).json({
        data: "Removed successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

//Orders

exports.createOrder = (req, res, next) => {
  const {
    userid,
    orderid,
    items,
    totalamount,
    totalitems,
    address,
    date,
  } = req.body;
  let response;
  let userData;
  Customer.findById(userid)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }

      userData = result;

      const list = new Order({
        userid: userid,
        orderid: orderid,
        items: items,
        totalamount: totalamount,
        totalitems: totalitems,
        address: address,
        date: date,
      });

      return list.save();
    })
    .then((result) => {
      response = result;
      return Customer.findById(userid);
    })
    .then((result) => {
      result.orders.push(response);

      return result.save();
    })
    .then((result) => {
      // const bodies = {
      //   title: "Order Placed",
      //   body: response.items.map((list) => list.title).join(", "),
      //   image: "https://techronx.com/images/logo192.png",
      // };
      // notifications(userData.notif_token, bodies);
      res.json({
        data: response,
      });
    });
};

exports.getOrdersByUserId = (req, res, next) => {
  const userid = req.params.userid;
  Order.find({ userid: `${userid}` })
    .sort({ _id: -1 })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

exports.getOrdersByUserIdAndUserid = (req, res, next) => {
  const refid = req.params.refid;
  Order.find({ referenceid: `${refid}` })
    .sort({ _id: -1 })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: result,
      });
    });
};

exports.updateuser = (req, res, next) => {
  const _id = req.params.user_id;
  const name = req.body.name;
  const mobile = req.body.mobile;

  Customer.findById(_id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.statusCode = 404;
        throw error;
      }

      result.name = name;
      result.mobile = mobile;
      return result.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Successfully updated",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Search
exports.getSearchResult = (req, res, next) => {
  const searchItem = req.body.search;
  Product.find({ $text: { $search: `${searchItem}` } })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//Counting
//Brand

exports.getBrand = (req, res, next) => {
  Brand.find()
    .sort({ _id: -1 })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};

// ADD ADDRESS

exports.createAddress = (req, res, next) => {
  const {
    userid,
    name,
    mobile,
    pincode,
    address,
    locality,
    district,
    state,
  } = req.body;

  Customer.findById(userid)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find");
        error.message = "USER_NOT_FOUND";
        error.statusCode = 404;
        throw error;
      }

      const list = new Address({
        userid: userid,
        name: name,
        mobile: mobile,
        pincode: pincode,
        address: address,
        locality: locality,
        district: district,
        state: state,
      });

      return list.save();
    })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

exports.getUserAddressById = (req, res, next) => {
  const userid = req.params.userid;
  Address.find({ userid: userid })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

exports.deleteAddressById = (req, res, next) => {
  const id = req.params.id;
  Address.findByIdAndRemove(id)
    .then((result) => {
      res.status(200).json({
        data: "Removed successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
      });
    });
};
