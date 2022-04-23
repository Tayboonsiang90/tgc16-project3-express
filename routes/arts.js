const express = require("express");
const router = express.Router();

const { bootstrapField, createArtForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Art, Artist, Vault, Tag, Media } = require("../models");

async function fetchArt(artId) {
    const art = await Art.where({
        id: artId,
    }).fetch({
        require: true,
        withRelated: ["artist", "vault", "tags", "medias"],
    });

    return art;
}

async function fetchArtists() {
    return await Artist.fetchAll().map((artist) => {
        return [artist.get("id"), artist.get("first_name") + " " + artist.get("last_name")];
    });
}

async function fetchVaults() {
    return await Vault.fetchAll().map((vault) => {
        return [vault.get("id"), vault.get("name")];
    });
}

async function fetchMedias() {
    return await Media.fetchAll().map((media) => [media.get("id"), media.get("name")]);
}

async function fetchTags() {
    console.log("trying");
    return await Tag.fetchAll().map((tag) => [tag.get("id"), tag.get("name")]);
}

router.get("/", checkIfAuthenticated, async (req, res) => {
    let arts = await Art.collection().fetch({ withRelated: ["artist", "vault", "tags", "medias"] });

    res.render("arts/index", {
        arts: arts.toJSON(),
    });
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
    let allArtists = await fetchArtists();
    let allVaults = await fetchVaults();
    let allTags = await fetchTags();
    let allMedias = await fetchMedias();

    const createArtHTML = createArtForm(allVaults, allArtists, allTags, allMedias);

    res.render("arts/create", {
        form: createArtHTML.toHTML(bootstrapField),
    });
});

router.post("/create", async (req, res) => {
    let allArtists = await fetchArtists();
    let allVaults = await fetchVaults();
    let allTags = await fetchTags();
    let allMedias = await fetchMedias();

    const createArtHTML = createArtForm(allVaults, allArtists, allTags, allMedias);

    createArtHTML.handle(req, {
        success: async (form) => {
            // separate out tags from the other art data
            // as not to cause an error when we create
            // the new art
            console.log(form.data);
            let { tags, medias, ...formData } = form.data;
            formData.total_share = 10000;
            const art = new Art(formData);
            await art.save();
            // save the many to many relationship
            if (tags) {
                await art.tags().attach(tags.split(","));
            }
            if (medias) {
                await art.medias().attach(medias.split(","));
            }
            res.redirect("/arts");
        },
        error: async (form) => {
            res.render("arts/create", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:art_id/update", async (req, res) => {
    // retrieve the art
    let art = await fetchArt(req.params.art_id);
    let allArtists = await fetchArtists();
    let allVaults = await fetchVaults();
    let allTags = await fetchTags();
    let allMedias = await fetchMedias();

    const editArtHTML = createArtForm(allVaults, allArtists, allTags, allMedias);

    // fill in the existing values
    editArtHTML.fields.name.value = art.get("name");
    editArtHTML.fields.description.value = art.get("description");
    editArtHTML.fields.year.value = art.get("year");
    editArtHTML.fields.vault_id.value = art.get("vault_id");
    editArtHTML.fields.artist_id.value = art.get("artist_id");
    // fill in the multi-select for the tags
    let selectedTags = await art.related("tags").pluck("id");
    editArtHTML.fields.tags.value = selectedTags;
    // fill in the multi-select for the medias
    let selectedMedias = await art.related("medias").pluck("id");
    editArtHTML.fields.medias.value = selectedMedias;

    res.render("arts/update", {
        form: editArtHTML.toHTML(bootstrapField),
        art: art.toJSON(),
    });
});

router.post("/:art_id/update", async (req, res) => {
    // retrieve the art
    let art = await fetchArt(req.params.art_id);
    let allArtists = await fetchArtists();
    let allVaults = await fetchVaults();
    let allTags = await fetchTags();
    let allMedias = await fetchMedias();

    const editArtHTML = createArtForm(allVaults, allArtists, allTags, allMedias);

    editArtHTML.handle(req, {
        success: async (form) => {
            let { tags, medias, ...formData } = form.data;
            art.set(formData);
            art.save();

            let tagIds = tags.split(",");
            let existingTagIds = await art.related("tags").pluck("id");
            let tagToRemove = existingTagIds.filter((id) => tagIds.includes(id) === false);
            await art.tags().detach(tagToRemove);
            await art.tags().attach(tagIds);

            let mediaIds = medias.split(",");
            let existingMediaIds = await art.related("medias").pluck("id");
            let mediaToRemove = existingMediaIds.filter((id) => mediaIds.includes(id) === false);
            await art.medias().detach(mediaToRemove);
            await art.medias().attach(mediaIds);

            res.redirect("/arts");
        },
        error: async (form) => {
            res.render("arts/update", {
                form: form.toHTML(bootstrapField),
                art: art.toJSON(),
            });
        },
    });
});

router.get("/:art_id/delete", async (req, res) => {
    // fetch the art that we want to delete
    let art = await fetchArt(req.params.art_id);

    res.render("arts/delete", {
        art: art.toJSON(),
    });
});

router.post("/:art_id/delete", async (req, res) => {
    // fetch the art that we want to delete
    let art = await fetchArt(req.params.art_id);
    await art.destroy();
    res.redirect("/arts");
});

module.exports = router;
