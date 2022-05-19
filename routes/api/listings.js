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
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const listingDataLayer = require("../../dal/listings");

const { FixedPriceListing } = require("../../models");

router.get("/fixed_price_listings", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        res.send(await listingDataLayer.getAllFixedPriceListing(req.user.id));
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

router.get("/fixed_price_listings/:listing_id", async (req, res) => {
    res.send(await listingDataLayer.fetchFixedPriceListing(req.params.listing_id));
});

router.get("/fixed_price_listings/art/:art_id", async (req, res) => {
    if (req.params.art_id == "undefined") {
        res.send("");
    } else {
        res.send(await listingDataLayer.fetchFixedPriceListingByArtId(req.params.art_id));
    }
});

// Body input is art_id, price, share
router.post("/fixed_price_listings", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        console.log(req.body);
        //for a fixed price listing, we need
        //the user_id, the art_id, the price and the share to be sold
        //Information from JWT
        const user = req.user;
        console.log("userid", user.id);

        //first lets check if the user have enough shares to even be sold in the first place...
        let availableBalance = await listingDataLayer.fetchBalancesForUserArt(user.id, req.body.art_id);

        console.log(availableBalance);

        //if there is enough shares... then we create the order
        if (availableBalance >= req.body.share) {
            let input = req.body;
            input.date_created = new Date();
            input.user_id = user.id;
            const fixedPriceListing = new FixedPriceListing(input);
            await fixedPriceListing.save();

            // Update the number of shares in order in the pivot table
            await knex("arts_users").where("user_id", user.id).where("art_id", input.art_id).increment("share_in_order", input.share);

            res.send({
                message: "Your listing have been successfully created.",
            });
        } else {
            throw "You do not have enough shares to create this listing.";
        }
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

//Body input is price, share
router.put("/fixed_price_listings/:listing_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        //Information from JWT
        const user = req.user;

        //Retrieve the listing details
        let listing = await listingDataLayer.fetchFixedPriceListing(req.params.listing_id);
        listingData = listing.toJSON();

        // if this order doesn't belong to authenticated user, throw
        if (user.id != listingData[0].user_id) {
            throw "You are not the owner of this listing...";
        }

        // if it is incrementing
        if (req.body.share > listingData[0].share) {
            // Check if the user have enough shares to spend
            let extraShare = req.body.share - listingData[0].share;
            let availableBalance = await listingDataLayer.fetchBalancesForUserArt(listingData[0].user_id, listingData[0].art_id);
            if (extraShare > availableBalance) {
                throw "You do not have enough shares of the art to sell...";
            } else {
                await knex("arts_users").where("user_id", listingData[0].user_id).where("art_id", listingData[0].art_id).increment("share_in_order", extraShare);
            }
            // if it is decrementing
        } else if (req.body.share < listingData[0].share) {
            await knex("arts_users")
                .where("id", listingData[0].user_id)
                .decrement("share_in_order", listingData[0].share - req.body.share);
        }

        await knex("fixed_price_listings")
            .where("id", Number(req.params.listing_id))
            .update({
                price: Number(req.body.price),
                share: req.body.share,
            });


        res.send({
            message: "You have successfully updated your listing.",
        });
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

router.delete("/fixed_price_listings/:listing_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        //Information from JWT
        const user = req.user;

        //retrieve existing listing
        let listing = await listingDataLayer.fetchFixedPriceListing(req.params.listing_id);
        listingData = listing.toJSON();

        // if this order doesn't belong to authenticated user, throw
        if (user.id != listingData[0].user_id) {
            throw "You are not the owner of this listing...";
        }

        //Update the in order amount of the user (decrement)
        await knex("arts_users").where("user_id", listingData[0].user_id).where("art_id", listingData[0].art_id).decrement("share_in_order", listingData[0].share);

        //destroy the listing
        await knex("fixed_price_listings").where("id", req.params.listing_id).del();

        res.send({
            message: "You have successfully deleted your listing.",
        });
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

module.exports = router;
