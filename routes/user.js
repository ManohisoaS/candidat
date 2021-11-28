var express = require("express");
var router = express.Router();
var url = require("url");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwtUtils = require("../utils/jwt.utils");

function checkToken(req, res, next) {
  var path_splited = url.parse(req.url, true).pathname.split("/");
  var token = path_splited[path_splited.length - 1];
  var token_parsed = jwtUtils.parse(token);
  
  if (token_parsed.error) {
    switch (token_parsed.id) {
      case 0:
        // Donnée format erronée
        return res.status(401).json({
          error: true,
          message: "Le token envoyez n'est pas conforme",
        });
      // case 1:
      default:
        // Token révoque
        return res.status(401).json({
          error: true,
          message: "Votre token n'ai plus valide, veuiller le réinitialiser",
        });
    }
  }
  req.userId = token_parsed.id;
  if(!req.app.get(req.userId)){
    return res
      .status(401)
      .json({ error: true, message: "Le token envoyez n'existe pas" });
  }
  next();
}

router.get("/user/*", checkToken, function (req, res, next) {
  // get all information about user
  User.findById(
    req.userId,
    "-_id firstname lastname email date_naissance sexe createdAt",
    (err, user) => {
      if (user) {
        return res.status(200).json({
          error: false,
          user,
        });
      }
    }
  );
});

router.put("/user/*", checkToken, function (req, res, next) {
  var user = req.body;
  if (Object.keys(user).length == 0) {
    return res
      .status(401)
      .json({ error: true, message: "Aucun données n'a été envoyée" });
  }

  // Modification dans la base de donnée
  User.findByIdAndUpdate(req.userId, user, { new: true }, (err, _user) => {
    console.log(_user);
    if (_user) {
      return res
        .status(200)
        .json({ error: false, message: "L'utilisateur a été modifiée succès" });
    }
  });
});

router.get("/users/*", checkToken, function (req, res, next) {
  // get all users informations
  User.find({}, "-_id firstname lastname email sexe", (err, users) => {
    if (users) {
      return res.status(200).json({ error: false, users });
    } 
  });
});

router.delete("/user/*", checkToken, function (req, res, next) {
  // deconnexion de l'utilisateur
  if (req.app.get(req.userId)) {
    req.app.set(req.userId, false);
    return res.status(200).json({
      error: false,
      message: "L'utilisateur a été déconnecté succès",
    });
  }
});

router.patch("/user/*", checkToken, async function (req, res, next) {
  var user = req.body;
  if (user && user["password"]) {
    User.findByIdAndUpdate(
      req.userId,
      { password: await bcrypt.hash(user["password"], 10) },
      { new: true },
      (err, _user) => {
        console.log(_user);
        if (_user) {
          return res.status(200).json({
            error: false,
            message: "Le mot de passe de l'utilisateur a été modifiée succès",
          });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Aucune modification n'as été faite" });
  }
});

module.exports = router;
