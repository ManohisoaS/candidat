var jwt = require("jsonwebtoken");

module.exports = {
  generateToken: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        name: userData.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      // {
      //   expiresIn: "300m",
      // }
    );
  },

  getUserId: (authorization) => {
    var userId = -1;
    var token = module.exports.parseAuthorisation(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(jwtToken)
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {
        // console.log(err)
        console.log("JWT error");
      }
    }
    return userId;
  },
  getUser: (authorization) => {
    var user = null;
    var token = module.exports.parseAuthorisation(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(jwtToken)
        user = jwtToken;
      } catch (err) {
        // console.log(err)
        console.log("JWT error");
      }
    }
    return user;
  },
};
