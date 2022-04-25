const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/arts");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllArts());
});

module.exports = router;
