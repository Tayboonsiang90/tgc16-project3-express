const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/artists");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllArtists());
});

module.exports = router;
