const cartDataLayer = require("../dal/cart_items");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }
    async addToCart(listingId, quantity) {
        // check if the user has added the product to the shopping cart before
        let cartItem = await cartDataLayer.getCartItemByUserAndListing(this.user_id, listingId);
        if (cartItem) {
            return await cartDataLayer.updateQuantity(this.user_id, listingId, cartItem.get("quantity") + 1);
        } else {
            let newCartItem = cartDataLayer.createCartItem(this.user_id, listingId, quantity);
            return newCartItem;
        }
    }

    async remove(listingId) {
        return await cartDataLayer.removeFromCart(this.user_id, listingId);
    }

    async setQuantity(listingId, quantity) {
        return await cartDataLayer.updateQuantity(this.user_id, listingId, quantity);
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }
}

module.exports = CartServices;
