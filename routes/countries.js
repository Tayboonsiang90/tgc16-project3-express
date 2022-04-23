const express = require("express");
const router = express.Router();

const { bootstrapField, createCountryForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Country } = require("../models");

async function fetchCountry(countryId) {
    const country = await Country.where({
        id: countryId,
    }).fetch({
        require: true,
    });

    return country;
}

router.get("/", checkIfAuthenticated, async (req, res) => {
    let countries = await Country.collection().fetch();
    const createCountryHTML = createCountryForm();
    res.render("countries/index", {
        countries: countries.toJSON(),
        form: createCountryHTML.toHTML(bootstrapField),
    });
});

router.post("/", async (req, res) => {
    const createCountryHTML = createCountryForm();
    createCountryHTML.handle(req, {
        success: async (form) => {
            const country = new Country();
            console.log(form.data.name);
            country.set("name", form.data.name);
            await country.save();
            console.log("Added to database");
            res.redirect("/countries");
        },
        error: async (form) => {
            res.render("countries/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:country_id/update", async (req, res) => {
    // retrieve the country
    let country = await fetchCountry(req.params.country_id);

    const editCountryHTML = createCountryForm();

    // fill in the existing values
    editCountryHTML.fields.name.value = country.get("name");

    res.render("countries/update", {
        form: editCountryHTML.toHTML(bootstrapField),
        country: country.toJSON(),
    });
});

router.post("/:country_id/update", async (req, res) => {
    // retrieve the country
    let country = await fetchCountry(req.params.country_id);

    // process the form
    const editCountryHTML = createCountryForm();
    editCountryHTML.handle(req, {
        success: async (form) => {
            country.set(form.data);
            country.save();
            res.redirect("/countries");
        },
        error: async (form) => {
            res.render("countries/update", {
                form: form.toHTML(bootstrapField),
                country: country.toJSON(),
            });
        },
    });
});

router.get("/:country_id/delete", async (req, res) => {
    // fetch the country that we want to delete
    let country = await fetchCountry(req.params.country_id);

    res.render("countries/delete", {
        country: country.toJSON(),
    });
});

router.post("/:country_id/delete", async (req, res) => {
    // fetch the country that we want to delete
    let country = await fetchCountry(req.params.country_id);
    await country.destroy();
    res.redirect("/countries");
});

module.exports = router;
