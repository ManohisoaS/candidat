var express = require("express");
var router = express.Router();
var url = require("url");
// const jwtUtils = require("../utils/jwt.utils");

var UESRS = [{
  "firstname":"rakoto",
  "lastname" :"rabe",
  "sexe": "homme",
  "date_naissance": "10/12/1992",
  "Email":"rabe@gmail.com",
  "Password": "Rakoto0" 
},{
  "firstname":"rakfdfgoto",
  "lastname" :"rabsfgse",
  "sexe": "homme",
  "date_naissance": "10/12/1992",
  "Email":"rabeg@gmail.com",
  "Password": "Rakoto0" 
}]

function checkToken(req, res, next) {
  var path_splited = url.parse(req.url, true).pathname.split("/");
  var token = path_splited[path_splited.length - 1];
  // var token_parsed = jwtUtils.parse(token);
  // var token_parsed = JSON.parse(token);
  console.log(token)
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
      // case 1:
      //  verificatin sur un DB
      //   // Donnée valide
      //   return res
      //     .status(401)
      //     .json({ error: true, message: "Le token envoyez n'existe pas" });
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

router.get("/user", checkToken, function (req, res, next) {
    // get all user information 
    // use req.id
    // ......................
    console.log(req.userId);
    var user = null;
    return res.status(200).json({error: false, user})
});

router.put("/user", checkToken, function (req, res, next) {
    
    var user = req.body
    if(Object.keys(user).length == 0){
        return res.status(401).json({error:true, message: "Aucun données n'a été envoyée"});
    }

    // Modification dans la base de donnée
    // ...........
    return res.status(200).json({error: false, message:"L'utilisateur a été modifiée succès"});

});

router.get("/users", checkToken, function (req, res, next) {
    // get all users informations 
    // ......................
    var users = []

    return res.status(200).json({error: false, users});

});

router.delete("/user", checkToken, function (req, res, next) {
    // suppression de l'utilisateur 
    // ...........
    return res.status(200).json({error: false, message:"L'utilisateur a été déconnecté succès"});

});

module.exports = router;
