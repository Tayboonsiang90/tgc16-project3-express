const express = require("express");
const router = express.Router();

const { bootstrapField, createArtistForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Artist } = require("../models");
const dataLayer = require("../dal/artists");

router.get("/", checkIfAuthenticated, async (req, res) => {
    let artists = await Artist.collection().fetch({ withRelated: ["country"] });

    res.render("artists/index", {
        artists: artists.toJSON(),
    });
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
    let allCountries = await dataLayer.fetchCountries();

    const createArtistHTML = createArtistForm(allCountries);

    res.render("artists/create", {
        form: createArtistHTML.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
});

router.post("/create", async (req, res) => {
    let allCountries = await dataLayer.fetchCountries();

    const createArtistHTML = createArtistForm(allCountries);

    createArtistHTML.handle(req, {
        success: async (form) => {
            const artist = new Artist(form.data);
            await artist.save();
            res.redirect("/artists");
        },
        error: async (form) => {
            res.render("artists/create", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:artist_id/update", async (req, res) => {
    // retrieve the artist
    let artist = await dataLayer.fetchArtist(req.params.artist_id);
    let allCountries = await dataLayer.fetchCountries();

    const editArtistHTML = createArtistForm(allCountries);

    // fill in the existing values
    editArtistHTML.fields.first_name.value = artist.get("first_name");
    editArtistHTML.fields.last_name.value = artist.get("last_name");
    editArtistHTML.fields.profile.value = artist.get("profile");
    editArtistHTML.fields.country_id.value = artist.get("country_id");
    editArtistHTML.fields.image_url.value = artist.get("image_url");

    res.render("artists/update", {
        form: editArtistHTML.toHTML(bootstrapField),
        artist: artist.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
});

router.post("/:artist_id/update", async (req, res) => {
    // retrieve the artist
    let artist = await dataLayer.fetchArtist(req.params.artist_id);
    let allCountries = await dataLayer.fetchCountries();

    const editArtistHTML = createArtistForm(allCountries);

    editArtistHTML.handle(req, {
        success: async (form) => {
            artist.set(form.data);
            artist.save();
            res.redirect("/artists");
        },
        error: async (form) => {
            res.render("artists/update", {
                form: form.toHTML(bootstrapField),
                artist: artist.toJSON(),
            });
        },
    });
});

router.get("/:artist_id/delete", async (req, res) => {
    // fetch the artist that we want to delete
    let artist = await dataLayer.fetchArtist(req.params.artist_id);

    res.render("artists/delete", {
        artist: artist.toJSON(),
    });
});

router.post("/:artist_id/delete", async (req, res) => {
    // fetch the artist that we want to delete
    let artist = await dataLayer.fetchArtist(req.params.artist_id);
    await artist.destroy();
    res.redirect("/artists");
});

module.exports = router;
