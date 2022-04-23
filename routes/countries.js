const express = require("express");
const router = express.Router();

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Country } = require("../models");

router.get("/", checkIfAuthenticated, async (req, res) => {
    let countries = await Country.collection().fetch();
    res.render("countries/index", {
        countries: countries.toJSON(),
    });
});

module.exports = router;
