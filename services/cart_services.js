const cartDataLayer = require("../dal/cart_items");
const listingDataLayer = require("../dal/listings");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }
    async addToCart(listingId, quantity) {
        // check if the user has added the product to the shopping cart before
        let cartItem = await cartDataLayer.getCartItemByUserAndListing(this.user_id, listingId);
        let listing = await listingDataLayer.fetchFixedPriceListing(listingId);
        if (cartItem) {
            if (cartItem.get("quantity") + quantity > listing.get("share")) {
                return "FAILED: You attempted to add more quantity than what is available...";
            }
            await cartDataLayer.updateQuantity(this.user_id, listingId, cartItem.get("quantity") + quantity);
            return "SUCCESS: Your order have been added to the cart.";
        } else {
            await cartDataLayer.createCartItem(this.user_id, listingId, quantity);
            return "SUCCESS: Your order have been added to the cart.";
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
