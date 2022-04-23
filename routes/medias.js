const express = require("express");
const router = express.Router();

const { bootstrapField, createMediaForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Media } = require("../models");

async function fetchMedia(mediaId) {
    const media = await Media.where({
        id: mediaId,
    }).fetch({
        require: true,
    });

    return media;
}

router.get("/", checkIfAuthenticated, async (req, res) => {
    let medias = await Media.collection().fetch();
    const createMediaHTML = createMediaForm();
    res.render("medias/index", {
        medias: medias.toJSON(),
        form: createMediaHTML.toHTML(bootstrapField),
    });
});

router.post("/", async (req, res) => {
    const createMediaHTML = createMediaForm();
    createMediaHTML.handle(req, {
        success: async (form) => {
            const media = new Media();
            console.log(form.data.name);
            media.set("name", form.data.name);
            await media.save();
            console.log("Added to database");
            res.redirect("/medias");
        },
        error: async (form) => {
            res.render("medias/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:media_id/update", async (req, res) => {
    // retrieve the media
    let media = await fetchMedia(req.params.media_id);

    const editMediaHTML = createMediaForm();

    // fill in the existing values
    editMediaHTML.fields.name.value = media.get("name");

    res.render("medias/update", {
        form: editMediaHTML.toHTML(bootstrapField),
        media: media.toJSON(),
    });
});

router.post("/:media_id/update", async (req, res) => {
    // retrieve the media
    let media = await fetchMedia(req.params.media_id);

    // process the form
    const editMediaHTML = createMediaForm();
    editMediaHTML.handle(req, {
        success: async (form) => {
            media.set(form.data);
            media.save();
            res.redirect("/medias");
        },
        error: async (form) => {
            res.render("medias/update", {
                form: form.toHTML(bootstrapField),
                media: media.toJSON(),
            });
        },
    });
});

router.get("/:media_id/delete", async (req, res) => {
    // fetch the media that we want to delete
    let media = await fetchMedia(req.params.media_id);

    res.render("medias/delete", {
        media: media.toJSON(),
    });
});

router.post("/:media_id/delete", async (req, res) => {
    // fetch the media that we want to delete
    let media = await fetchMedia(req.params.media_id);
    await media.destroy();
    res.redirect("/medias");
});

module.exports = router;
