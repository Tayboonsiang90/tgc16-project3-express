const express = require("express");
const router = express.Router();

const { bootstrapField, createTagForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Tag } = require("../models");

async function fetchTag(tagId) {
    const tag = await Tag.where({
        id: tagId,
    }).fetch({
        require: true,
    });

    return tag;
}

router.get("/", checkIfAuthenticated, async (req, res) => {
    let tags = await Tag.collection().fetch();
    const createTagHTML = createTagForm();
    res.render("tags/index", {
        tags: tags.toJSON(),
        form: createTagHTML.toHTML(bootstrapField),
    });
});

router.post("/", async (req, res) => {
    const createTagHTML = createTagForm();
    createTagHTML.handle(req, {
        success: async (form) => {
            const tag = new Tag();
            console.log(form.data.name);
            tag.set("name", form.data.name);
            await tag.save();
            console.log("Added to database");
            res.redirect("/tags");
        },
        error: async (form) => {
            res.render("tags/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:tag_id/update", async (req, res) => {
    // retrieve the tag
    let tag = await fetchTag(req.params.tag_id);

    const editTagHTML = createTagForm();

    // fill in the existing values
    editTagHTML.fields.name.value = tag.get("name");

    res.render("tags/update", {
        form: editTagHTML.toHTML(bootstrapField),
        tag: tag.toJSON(),
    });
});

router.post("/:tag_id/update", async (req, res) => {
    // retrieve the tag
    let tag = await fetchTag(req.params.tag_id);

    // process the form
    const editTagHTML = createTagForm();
    editTagHTML.handle(req, {
        success: async (form) => {
            tag.set(form.data);
            tag.save();
            res.redirect("/tags");
        },
        error: async (form) => {
            res.render("tags/update", {
                form: form.toHTML(bootstrapField),
                tag: tag.toJSON(),
            });
        },
    });
});

router.get("/:tag_id/delete", async (req, res) => {
    // fetch the tag that we want to delete
    let tag = await fetchTag(req.params.tag_id);

    res.render("tags/delete", {
        tag: tag.toJSON(),
    });
});

router.post("/:tag_id/delete", async (req, res) => {
    // fetch the tag that we want to delete
    let tag = await fetchTag(req.params.tag_id);
    await tag.destroy();
    res.redirect("/tags");
});

module.exports = router;
