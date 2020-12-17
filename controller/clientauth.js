const Customer = require("../model/customer");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fcm = require("fcm-notification");
const privateKey = require("../firebase/privateKey.json");

const fetch = require("node-fetch");

exports.createCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.data = errors.array();
    throw error;
  }

  const { email, name, password, notif_token } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashPwd) => {
      const user = new Customer({
        email: email,
        name: name,
        password: hashPwd,
        notif_token: notif_token,
      });

      return user.save();
    })
    .then((loadeduser) => {
      const token = jwt.sign(
        {
          name: loadeduser.name,
          email: loadeduser.email,
          userId: loadeduser._id.toString(),
        },
        "dholpurclientsecretwalasecret",
        { expiresIn: "7 days" }
      );

      res.status(201).json({
        message: "USER_CREATED",
        token: token,
        name: loadeduser.name,
        userId: loadeduser._id.toString(),
        email: loadeduser.email,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//signupend 5f1846bb2324d526045effa0

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const notif_token = req.body.notif_token;
  Customer.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("EMAIL_NOT_FOUND");
        error.statusCode = 401;
        throw error;
      }
      loadeduser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password");
        error.statusCode = 401;
        throw error;
      }

      Customer.find({ email: email }).then((result) => {
        result.notif_token = notif_token;
        return result.save();
      });

      const token = jwt.sign(
        {
          name: loadeduser.name,
          email: loadeduser.email,
          userId: loadeduser._id.toString(),
        },
        "dholpurclientsecretwalasecret",
        { expiresIn: "7 days" }
      );

      res.status(200).json({
        token: token,
        userId: loadeduser._id.toString(),
        name: loadeduser.name,
        email: loadeduser.email,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// exports.notification = (req, res, next) => {
//   const FCM = new fcm(privateKey);
//   const token =
//     "dS5H4BYXS5WtoYVcIYNIyk:APA91bHukIRJUvCz0X5vmtCJm7l0qrG6Q7-RAp3jpVD95V-7xi4hfqcXKzi6LmFl5wUBwdgGz3CzYGC0uBu_NnXJCel0K23nsGOiodv0ufIXQjhQBIjG47v1RU6zGEbX4Kz8AOAxXcVl";

//   const message = {
//     data: {
//       score: "0",
//       time: "0",
//     },
//     notification: {
//       title: "Title of notification",
//       body: "Body of notification",
//     },
//     token: token,
//   };

//   FCM.send(message, (err, response) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(response);
//     }
//   });
// };
