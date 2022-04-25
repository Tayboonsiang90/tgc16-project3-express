const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/countries");

router.get("/", async (req, res) => {
    res.send(await productDataLayer.getAllCountries());
});

module.exports = router;
