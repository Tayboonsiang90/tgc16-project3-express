const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/arts");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllArts());
});

router.get("/:art_id", async (req, res) => {
    res.send(await productDataLayer.fetchArt(req.params.art_id));
});

module.exports = router;
