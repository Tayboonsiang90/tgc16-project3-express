const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const CartServices = require("../../services/cart_services");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const artDataLayer = require("../../dal/arts");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
    const cart = new CartServices(req.user.id);

    // get all the items from the cart
    let items = await cart.getCart();

    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        artId = item.related("fixedPriceListing").get("art_id");
        referencedArt = await artDataLayer.fetchArt(artId);

        console.log(referencedArt.get("name"), item.related("fixedPriceListing").get("price"), item.get("quantity"));
        console.log(referencedArt.get("image_url"));

        const lineItem = {
            name: referencedArt.get("name"),
            amount: Number(item.related("fixedPriceListing").get("price"))*100,
            quantity: item.get("quantity"),
            currency: "SGD",
        };
        if (referencedArt.get("image_url")) {
            lineItem["images"] = [referencedArt.get("image_url")];
        }
        console.log(lineItem)
        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            product_id: artId,
            quantity: item.get("quantity"),
        });
    }

    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    console.log(process.env.STRIPE_ERROR_URL);
    console.log(process.env.STRIPE_SUCCESS_URL + `?sessionId={CHECKOUT_SESSION_ID}`);
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
    let stripeSession = await Stripe.checkout.sessions.create(payment);
    console.log(Stripe(process.env.STRIPE_PUBLISHABLE_KEY));
    res.send({
        sessionId: stripeSession.id, // 4. Get the ID of the session
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

module.exports = router;
