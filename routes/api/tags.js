const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/tags");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllTags());
});

module.exports = router;
