var express = require('express');
var router = express.Router();

/* to login */
router.post('/login', function(req, res, next) {
  // Parametre
  var email = req.body.Email;
  var password = req.body.Password;

  if (email == null || password == null) {
    // missing parameters
    return res.status(401).json({ error: "true", message:"L'email/password est manquant" });
  }

  
  res.status(200).render('login', { title: 'login' });
});

module.exports = router;