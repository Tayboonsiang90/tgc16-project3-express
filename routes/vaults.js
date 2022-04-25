const express = require("express");
const router = express.Router();

const { bootstrapField, createVaultForm } = require("../forms");

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

const { Vault } = require("../models");
const dataLayer = require("../dal/vaults");

router.get("/", checkIfAuthenticated, async (req, res) => {
    let vaults = await Vault.collection().fetch({ withRelated: ["country"] });
    let allCountries = await dataLayer.fetchCountries();

    const createVaultHTML = createVaultForm(allCountries);

    res.render("vaults/index", {
        vaults: vaults.toJSON(),
        form: createVaultHTML.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
});

router.post("/", async (req, res) => {
    let allCountries = await dataLayer.fetchCountries();

    const createVaultHTML = createVaultForm(allCountries);

    createVaultHTML.handle(req, {
        success: async (form) => {
            const vault = new Vault(form.data);
            await vault.save();
            res.redirect("/vaults");
        },
        error: async (form) => {
            res.render("vaults/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

router.get("/:vault_id/update", async (req, res) => {
    // retrieve the vault
    let vault = await dataLayer.fetchVault(req.params.vault_id);
    let allCountries = await dataLayer.fetchCountries();

    const editVaultHTML = createVaultForm(allCountries);

    // fill in the existing values
    editVaultHTML.fields.name.value = vault.get("name");
    editVaultHTML.fields.address.value = vault.get("address");
    editVaultHTML.fields.postal.value = vault.get("postal");
    editVaultHTML.fields.country_id.value = vault.get("country_id");
    editVaultHTML.fields.image_url.value = vault.get("image_url");

    res.render("vaults/update", {
        form: editVaultHTML.toHTML(bootstrapField),
        vault: vault.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
});

router.post("/:vault_id/update", async (req, res) => {
    // retrieve the vault
    let vault = await dataLayer.fetchVault(req.params.vault_id);
    let allCountries = await dataLayer.fetchCountries();

    const editVaultHTML = createVaultForm(allCountries);

    editVaultHTML.handle(req, {
        success: async (form) => {
            vault.set(form.data);
            vault.save();
            res.redirect("/vaults");
        },
        error: async (form) => {
            res.render("vaults/update", {
                form: form.toHTML(bootstrapField),
                vault: vault.toJSON(),
            });
        },
    });
});

router.get("/:vault_id/delete", async (req, res) => {
    // fetch the vault that we want to delete
    let vault = await dataLayer.fetchVault(req.params.vault_id);

    res.render("vaults/delete", {
        vault: vault.toJSON(),
    });
});

router.post("/:vault_id/delete", async (req, res) => {
    // fetch the vault that we want to delete
    let vault = await dataLayer.fetchVault(req.params.vault_id);
    await vault.destroy();
    res.redirect("/vaults");
});

module.exports = router;
