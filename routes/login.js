var express = require("express");
var router = express.Router();
const User = require("../models/user");
const jwtUtils = require("../utils/jwt.utils");
const MAX_TENTATIVE = 5;
var tentatives = {};

/* to login */
router.post("/login", function (req, res, next) {
  var email = req.body.Email;
  var password = req.body.Password;

  if (email == null || password == null) {
    // Donnée manquante
    return res
      .status(401)
      .json({ error: "true", message: "L'email/password est manquant" });
  }

  //  Incrémentation du tentative
  if (tentatives[email] == undefined) {
    tentatives[email] = { count:0 };
  }
  tentatives[email]["count"] += 1;

  if (tentatives[email]["count"] > MAX_TENTATIVE) {
    var time = new Date();
    if (time - tentatives[email]["last_time"] >= 60 * 60 * 1000) {
      tentatives[email]["count"] = 0;
    } else {
      // Trop de tentative - sur email
      return res
        .status(409)
        .json({
          error: true,
          message: `Trop de tentative sur l'email ${email} - Veuillez patientez 1h`,
        });
    }
  }
  
  tentatives[email]["last_time"] = Date.now();

   console.log(tentatives);
  // Recherche dans la BDD
  User.findOne({ email: email, password: password }, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      // Succès
      tentatives[email]["count"] = 0;
      return res.status(200).json({
        error: false,
        message: "L'utilisateur a été authentifié succès",
        tokens: {
          token: jwtUtils.generateToken({ id: user["_id"] }),
          "refresh-token": jwtUtils.refreshToken({ id: user["_id"] }),
          createdAt: user["createdAt"],
        },
      });
    } else {
      // password erroné/Email inconnu
      return res
        .status(401)
        .json({ error: true, message: "Votre email ou password est erroné" });
    }
  });
});

module.exports = router;
