const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/listings");

router.get("/", async (req, res) => {
    console.log("kek")
    res.send(await productDataLayer.getAllFixedPriceListing());
});






module.exports = router;
