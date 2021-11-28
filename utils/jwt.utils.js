var jwt = require("jsonwebtoken");

module.exports = {
  generateToken: function (userData) {
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  },
  refreshToken: function (userData) {
    return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
  },
  parse: (token) => {
    var id = -1;
    var error = false;
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (jwtToken != null) id = jwtToken.id;
      } catch (err) {
        error = true;
        if (err.name == "TokenExpiredError") {
          id = 1;
        } else {
          id = 0;
        }
      }
    }
    return { error, id };
  },
};
