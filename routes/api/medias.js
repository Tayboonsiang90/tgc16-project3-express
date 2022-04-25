const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/medias");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllMedias());
});

module.exports = router;
