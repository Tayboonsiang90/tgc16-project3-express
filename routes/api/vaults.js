const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/vaults");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllVaults());
});

module.exports = router;
