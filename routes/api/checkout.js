const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const CartServices = require("../../services/cart_services");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const artDataLayer = require("../../dal/arts");

const listingDataLayer = require("../../dal/listings");

const { CartItem } = require("../../models");

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

let app = express();

app.use((req, res, next) => {
    console.log("originalURL", req.originalUrl);
    if (req.originalUrl === "/process_payment") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
    const cart = new CartServices(req.user.id);

    // get all the items from the cart
    let items = await cart.getCart();

    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        let listingId = item.get("fixed_price_listing_id");
        artId = item.related("fixedPriceListing").get("art_id");
        referencedArt = await artDataLayer.fetchArt(artId);

        const lineItem = {
            name: referencedArt.get("name"),
            amount: Number(item.related("fixedPriceListing").get("price")) * 100,
            quantity: item.get("quantity"),
            currency: "SGD",
        };
        if (referencedArt.get("image_url")) {
            lineItem["images"] = [referencedArt.get("image_url")];
        }

        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            user_id: req.user.id,
            listing_id: listingId,
            art_id: artId,
            quantity: item.get("quantity"),
        });
    }

    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + `?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            orders: metaData,
        },
    };

    // step 3: register the session
    let stripeSession = await stripe.checkout.sessions.create(payment);
    res.send({
        sessionId: stripeSession.id, // 4. Get the ID of the session
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

// this is the webhook route
// stripe will send a POST request to this route when a
// payment is completed
router.post(
    "/process_payment",
    express.raw({
        type: "application/json",
    }),
    async function (req, res) {
        let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let sigHeader = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

            if (event.type === "checkout.session.completed") {
                let stripeSession = event.data.object;
                let soldItems = JSON.parse(stripeSession.metadata.orders);

                for (let i of soldItems) {
                    console.log("Iteration", i);
                    //adjust fixed price listings amount
                    let listing_id = i.listing_id;
                    let art_id = i.art_id;
                    let quantity = i.quantity;
                    let user_id = i.user_id;

                    //Retrieve the listing details
                    let listing = await listingDataLayer.fetchFixedPriceListing(listing_id);
                    listingData = listing.toJSON()[0];
                    console.log("Listing Data", listingData);

                    console.log(listingData.user_id != user_id);

                    if (listingData.user_id != user_id) {
                        console.log("Checking", listingData.share, quantity);
                        if (listingData.share > quantity) {
                            console.log("listing > ordered");
                            await listing.set("share", listingData.share - quantity);
                            //decrement sellers balances
                            await knex("arts_users").where("user_id", listingData.user_id).where("art_id", art_id).decrement("total_share", quantity);
                            await knex("arts_users").where("user_id", listingData.user_id).where("art_id", art_id).decrement("share_in_order", quantity);
                            //increment buyers balances
                            console.log("where user_id", user_id, "where art_id", art_id, "increment", quantity);
                            findExisting = await knex("arts_users").where("user_id", user_id).where("art_id", art_id);
                            console.log(findExisting)
                            console.log(findExisting.length);
                            if (findExisting.length == 0) {
                                console.log("length0");
                                await knex("arts_users").insert({ user_id: user_id, art_id: art_id, total_share: quantity, share_in_order: 0 });
                            } else {
                                console.log("length >0");
                                await knex("arts_users").where("user_id", user_id).where("art_id", art_id).increment("total_share", quantity);
                            }
                        } else if (listingData.share == quantity) {
                            console.log("listing == ordered");
                            await listing.destroy();
                            //decrement sellers balances
                            await knex("arts_users").where("user_id", listingData.user_id).where("art_id", art_id).decrement("total_share", quantity);
                            await knex("arts_users").where("user_id", listingData.user_id).where("art_id", art_id).decrement("share_in_order", quantity);
                            //increment buyers balances
                            console.log("where user_id", user_id, "where art_id", art_id, "increment", quantity);
                            findExisting = await knex("arts_users").where("user_id", user_id).where("art_id", art_id);
                            console.log(findExisting);
                            if (findExisting.length == 0) {
                                await knex("arts_users").insert({ user_id: user_id, art_id: art_id, total_share: quantity, share_in_order: 0 });
                            } else {
                                await knex("arts_users").where("user_id", user_id).where("art_id", art_id).increment("total_share", quantity);
                            }
                        }
                    }
                }
                // delete cart items
                console.log("Deletion Cart in Progress, id:", soldItems[0].user_id);
                await knex("cart_items").where("user_id", soldItems[0].user_id).del();
            }
            res.send({
                recieved: true,
            });
        } catch (e) {
            res.send({
                error: e.message,
            });
        }
    }
);

module.exports = router;
