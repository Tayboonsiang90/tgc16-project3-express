const express = require("express");
const router = express.Router();

const { bootstrapField, createArtistForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Artist, Country } = require("../models");

async function fetchArtist(artistId) {
    const artist = await Artist.where({
        id: artistId,
    }).fetch({
        require: true,
    });

    return artist;
}

async function fetchCountries() {
    return await Country.fetchAll().map((country) => {
        return [country.get("id"), country.get("name")];
    });
}

router.get("/", checkIfAuthenticated, async (req, res) => {
    let artists = await Artist.collection().fetch({ withRelated: ["country"] });
    console.log(artists.toJSON())

    res.render("artists/index", {
        artists: artists.toJSON(),
    });
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
    let allCountries = await fetchCountries();

    const createArtistHTML = createArtistForm(allCountries);

    res.render("artists/create", {
        form: createArtistHTML.toHTML(bootstrapField),
    });
});

router.post("/create", async (req, res) => {
    let allCountries = await fetchCountries();

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
    let artist = await fetchArtist(req.params.artist_id);
    let allCountries = await fetchCountries();

    const editArtistHTML = createArtistForm(allCountries);

    // fill in the existing values
    editArtistHTML.fields.first_name.value = artist.get("first_name");
    editArtistHTML.fields.last_name.value = artist.get("last_name");
    editArtistHTML.fields.profile.value = artist.get("profile");
    editArtistHTML.fields.country_id.value = artist.get("country_id");

    res.render("artists/update", {
        form: editArtistHTML.toHTML(bootstrapField),
        artist: artist.toJSON(),
    });
});

router.post("/:artist_id/update", async (req, res) => {
    // retrieve the artist
    let artist = await fetchArtist(req.params.artist_id);
    let allCountries = await fetchCountries();

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
    let artist = await fetchArtist(req.params.artist_id);

    res.render("artists/delete", {
        artist: artist.toJSON(),
    });
});

router.post("/:artist_id/delete", async (req, res) => {
    // fetch the artist that we want to delete
    let artist = await fetchArtist(req.params.artist_id);
    await artist.destroy();
    res.redirect("/artists");
});

module.exports = router;
