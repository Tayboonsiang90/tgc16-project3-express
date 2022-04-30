const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const CartServices = require("../../services/cart_services");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
    // Create a new object
    let cart = new CartServices(req.user.id);

    res.send((await cart.getCart()).toJSON());
});

//need a parameter quantity in the body
router.post("/:listing_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        let cart = new CartServices(req.user.id);
        await cart.addToCart(req.params.listing_id, req.body.quantity);

        res.send({
            message: "Your order have been added to the cart.",
        });
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

//need a parameter quantity in the body
router.put("/:listing_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        let cart = new CartServices(req.user.id);
        await cart.setQuantity(req.params.listing_id, req.body.quantity);

        res.send({
            message: "Your cart order has been updated.",
        });
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

router.delete("/:listing_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        let cart = new CartServices(req.user.id);
        await cart.remove(req.params.product_id);
        res.send({
            message: "Your cart order has been deleted.",
        });
    } catch (e) {
        res.status(500);
        res.send({
            message: e,
        });
    }
});

module.exports = router;
