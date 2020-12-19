var admin = require("firebase-admin");

var serviceAccount = require("../firebase/privateKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.notification = (req, res, next) => {
  var token =
    "f4bTVt3FTPy-nAJv23W559:APA91bFfkyC7YKLpgSJrXHxSQtslz3g0CMzeFc7iuw6Sfebk4DR8C79xnzrGpNY73nOxRZoSfzAybLI0nyqSRj7Sw0qb1kSzxwJNkLXZ-sKmyy6MLFdFmdDpOeM7uw790PxAYxtvRgDo";

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
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
