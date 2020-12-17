var admin = require("firebase-admin");

var serviceAccount = require("../firebase/privateKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.notification = (req, res, next) => {
  var token =
    "dS5H4BYXS5WtoYVcIYNIyk:APA91bHukIRJUvCz0X5vmtCJm7l0qrG6Q7-RAp3jpVD95V-7xi4hfqcXKzi6LmFl5wUBwdgGz3CzYGC0uBu_NnXJCel0K23nsGOiodv0ufIXQjhQBIjG47v1RU6zGEbX4Kz8AOAxXcVl";

  var payload = {
    notification: {
      title: "This is title",
      body: "This is body",
      image: "https://techronx.com/images/logo192.png",
    },
  };

  var option = {
    priority: "high",
    timeToLive: 60 * 60,
  };

  admin
    .messaging()
    .sendToDevice(token, payload, option)
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};

exports.notifications = (token, body) => {
  var payload = {
    notification: body,
  };

  var option = {
    priority: "high",
    timeToLive: 60 * 60,
  };

  admin
    .messaging()
    .sendToDevice(token, payload, option)
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};
