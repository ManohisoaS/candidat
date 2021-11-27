var express = require("express");
var router = express.Router();
var moment = require("moment");
var jwtUtils = require("../utils/jwt.utils");

// constantes
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$/;

/* to login */
router.post("/login", function (req, res, next) {
  // Parametre
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.Email;
  var password = req.body.Password;
  var date_naissance = req.body.date_naissance;
  var sexe = req.body.sexe;

  if (
    firstname == null ||
    lastname == null ||
    email == null ||
    password == null ||
    date_naissance == null ||
    sexe == null
  ) {
    // Donnée manquante
    return res.status(401).json({
      error: "true",
      message: "L'une des données obligatoire sont manquantes",
    });
  }

  if (
    !moment(date_naissance, "MM/DD/YYYY", true).isValid() ||
    !moment(date_naissance, moment.ISO_8601, true).isValid() ||
    !EMAIL_REGEX.test(email) ||
    !PASSWORD_REGEX.test(password)
  ) {
    // Donnée non-conforme
    return res.status(401).json({
      error: "true",
      message: "L'un des données obligatoire ne sont pas conformes",
    });
  }

  //   if (isEmailExist()) {
  //     // Email existe
  //     return res.status(401).json({
  //       error: "true",
  //       message: "Votre email n'est pas correct",
  //     });
  //   }

  // succès
  res
    .status(201)
    .json({
      "error": false,
      "message": "L'utilisateur a bien été créé avec succès",
      "token":{
          "token":"<token>",
          "refresh-token":"<refresh-token>",
          "createAt":"<CREATE AT>",
      }
    });
});

module.exports = router;
