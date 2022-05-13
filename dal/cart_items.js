const { CartItem } = require("../models");

const getCart = async (userId) => {
    return await CartItem.collection()
        .where({
            user_id: userId,
        })
        .fetch({
            require: false,
            withRelated: ["fixedPriceListing", "fixedPriceListing.art"],
        });
};

const getCartItemByUserAndListing = async (userId, listingId) => {
    let cartItem = await CartItem.where({
        user_id: userId,
        fixed_price_listing_id: listingId,
    }).fetch({
        require: false,
    });

    return cartItem;
};

async function createCartItem(userId, listingId, quantity) {
    let cartItem = new CartItem({
        user_id: userId,
        fixed_price_listing_id: listingId,
        quantity: quantity,
    });
    await cartItem.save();
    return cartItem;
}

async function removeFromCart(userId, listingId) {
    let cartItem = await getCartItemByUserAndListing(userId, listingId);

    await cartItem.destroy();
}

async function updateQuantity(userId, listingId, newQuantity) {
    let cartItem = await getCartItemByUserAndListing(userId, listingId);
    cartItem.set("quantity", newQuantity);
    cartItem.save();
}

module.exports = { getCart, getCartItemByUserAndListing, createCartItem, removeFromCart, updateQuantity };
