const express = require("express");
const router = express.Router();
const knex = require("knex")({
    client: process.env.DB_DRIVER,
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

const listingDataLayer = require("../../dal/listings");

const { FixedPriceListing } = require("../../models");

router.get("/fixed_price_listings", async (req, res) => {
    res.send(await listingDataLayer.getAllFixedPriceListing());
});

router.get("/fixed_price_listings/:listing_id", async (req, res) => {
    res.send(await listingDataLayer.getAllFixedPriceListing());
});

router.post("/fixed_price_listings/create", async (req, res) => {
    //for a fixed price listing, we need
    //the user_id, the art_id, the price and the share to be sold

    //first lets check if the user have enough shares to even be sold in the first place...
    availableBalance = await listingDataLayer.fetchBalancesForUserArt(req.body.user_id, req.body.art_id);

    if (availableBalance >= req.body.share) {
        let input = req.body;
        input.date_created = new Date();
        const fixedPriceListing = new FixedPriceListing(input);
        await fixedPriceListing.save();

        // Update the number of shares in order in the pivot table
        await knex("arts_users").where("user_id", input.user_id).where("art_id", input.art_id).increment("share_in_order", input.share);

        res.send({
            message: "Your listing have been successfully created.",
        });
    }
});

router.put("/fixed_price_listings/:listing_id/update", async (req, res) => {});

router.delete("/fixed_price_listings/:listing_id/delete", async (req, res) => {
    let listing = await 
});

module.exports = router;
