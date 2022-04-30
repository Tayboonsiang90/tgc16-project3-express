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
    return await CartItem.where({
        user_id: userId,
        fixed_price_listing_id: listingId,
    }).fetch({
        require: false,
    });
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
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function updateQuantity(userId, listingId, newQuantity) {
    let cartItem = await getCartItemByUserAndListing(userId, listingId);
    if (cartItem) {
        cartItem.set("quantity", newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}

module.exports = { getCart, getCartItemByUserAndListing, createCartItem, removeFromCart, updateQuantity };
