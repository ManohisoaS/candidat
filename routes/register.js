var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var moment = require("moment");
var jwtUtils = require("../utils/jwt.utils");
const mongoose = require("mongoose");
const User = require("../models/user");

// constantes de vérification
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$/;

/* to register */
router.post("/register", async function (req, res, next) {
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
    moment(date_naissance, "DD/MM/YYYY", true).isValid() == false ||
    !EMAIL_REGEX.test(email) ||
    !PASSWORD_REGEX.test(password)
  ) {
    // Donnée non-conforme
    return res.status(401).json({
      error: "true",
      message: "L'un des données obligatoire ne sont pas conformes",
    });
  }

  // generate salt to hash password
  // const salt = bcrypt.genSalt(10);
  // now we set user password to hashed password
  password = await bcrypt.hash(password, 10);

  // Verification dans la BD
  User.find({ email: email }, (err, _user) => {
    if(err){console.log(err)}
    if (_user.length == 0) {
      // Ecriture dans la base de donné
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        date_naissance: date_naissance,
        sexe: sexe,
        createdAt: Date.now(),
      });
      newUser
        .save()
        .then((user) => {
          req.app.set(user["_id"], true);
          res.status(201).json({
            error: false,
            message: "L'utilisateur a bien été créé avec succès",
            tokens: {
              token: jwtUtils.generateToken({ id: user["_id"] }),
              "refresh-token": jwtUtils.refreshToken({ id: user["_id"] }),
              createdAt: user["createdAt"],
            },
          });
        })
        .catch((err) => console.log(err));
    } else {
      // Email existe
      return res.status(401).json({
        error: "true",
        message: "Votre email n'est pas correct",
      });
    }
  });
});

module.exports = router;
