var admin = require("firebase-admin");

var serviceAccount = require("../firebase/privateKey.json");

exports.notification = (token) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  var payload = {
    notification: {
      title: "This is title",
      body: "This is body",
    },
  };

  var option = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
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
