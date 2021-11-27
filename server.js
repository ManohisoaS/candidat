const express = require("express");

// instance du server
var app = express();

// Lancer le serveur
app.listen(3000, () => {
    console.log("Lancement du serveur");
});
