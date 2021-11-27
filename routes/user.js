var express = require("express");
var router = express.Router();
var url = require("url");
const jwtUtils = require("../utils/jwt.utils");

function checkToken(req, res, next) {
  var path_splited = url.parse(req.url, true).pathname.split("/");
  var token = path_splited[path_splited.length - 1];
  var token_parsed = jwtUtils.parse(token);
  if (token_parsed.error) {
    switch (token_parsed.id) {
      case 0:
        // Donnée format erronée
        return res
          .status(401)
          .json({
            error: true,
            message: "Le token envoyez n'est pas conforme",
          });
      case 1:
        // Donnée valide
        return res
          .status(401)
          .json({ error: true, message: "Le token envoyez n'existe pas" });
      default:
        // Token révoque
        return res
          .status(401)
          .json({
            error: true,
            message: "Votre token n'ai plus valide, veuiller le réinitialiser",
          });
    }
  }
  req.userId = token_parsed.id;
  next();
}

router.get("/", checkToken, function (req, res, next) {
    // get all user information 
    var user = null;

    return res.status(201).json({error: false, user})
});

module.exports = router;
