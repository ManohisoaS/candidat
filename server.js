const express = require("express");

// Instance du server
var app = express();

// Configuration du server
app.use(express.static('public'));

// Lancement du serveur
app.listen(3000, () => {
    console.log("Lancement du serveur");
});
