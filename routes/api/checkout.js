const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");
const bodyParser = require("body-parser");

const CartServices = require("../../services/cart_services");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
            amount: Number(item.related("fixedPriceListing").get("price")) * 100,
            quantity: item.get("quantity"),
            currency: "SGD",
        };
        if (referencedArt.get("image_url")) {
            lineItem["images"] = [referencedArt.get("image_url")];
        }
        console.log(lineItem);
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
    let stripeSession = await stripe.checkout.sessions.create(payment);
    res.send({
        sessionId: stripeSession.id, // 4. Get the ID of the session
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post(
    "/process_payment",
    express.raw({
        type: "application/json",
    }),
    async (req, res) => {
        console.log("A PROCESS PAYMENT REQUEST HAVE BEEN RECIEVED");
        let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let sigHeader = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
            console.log(event)
        } catch (e) {
            res.send({
                error: e.message,
            });
            console.log(e.message);
        }
        if (event.type == "checkout.session.completed") {
            let stripeSession = event.data.object;
            console.log(stripeSession);
            // process stripeSession
        }
        res.send({ received: true });
    }
);

module.exports = router;
