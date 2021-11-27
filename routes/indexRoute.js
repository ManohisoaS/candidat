var router = require("express").Router();


// revoye de la page index.html
router.get("/", (req, res)=>{
    res.status(200).sendFile( __dirname + "/" + "index.html" );
});



module.exports = router;
