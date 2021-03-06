const bookshelf = require("../bookshelf");

const Admin = bookshelf.model("Admin", {
    tableName: "admins",
});

const Country = bookshelf.model("Country", {
    tableName: "countries",
    vaults() {
        return this.hasMany("Vault");
    },
    artists() {
        return this.hasMany("Artist");
    },
    users() {
        return this.hasMany("User");
    },
});

const Media = bookshelf.model("Media", {
    tableName: "medias",
    arts() {
        return this.belongsToMany("Art");
    },
});

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
    arts() {
        return this.belongsToMany("Art");
    },
});

const Vault = bookshelf.model("Vault", {
    tableName: "vaults",
    country() {
        return this.belongsTo("Country");
    },
    arts() {
        return this.hasMany("Art");
    },
});

const Artist = bookshelf.model("Artist", {
    tableName: "artists",
    country() {
        return this.belongsTo("Country");
    },
    arts() {
        return this.hasMany("Art");
    },
});

const Art = bookshelf.model("Art", {
    tableName: "arts",
    artist() {
        return this.belongsTo("Artist");
    },
    vault() {
        return this.belongsTo("Vault");
    },
    tags() {
        return this.belongsToMany("Tag");
    },
    medias() {
        return this.belongsToMany("Media");
    },
    users() {
        return this.belongsToMany("User").withPivot(["total_share", "share_in_order"]);
    },
    fixedPriceListings() {
        return this.hasMany("FixedPriceListing");
    },
});

const User = bookshelf.model("User", {
    tableName: "users",
    country() {
        return this.belongsTo("Country");
    },
    arts() {
        return this.belongsToMany("Art").withPivot(["total_share", "share_in_order"]);
    },
    fixedPriceListings() {
        return this.hasMany("FixedPriceListing");
    },
});

const BlacklistedToken = bookshelf.model("BlacklistedToken", {
    tableName: "blacklisted_tokens",
});

const FixedPriceListing = bookshelf.model("FixedPriceListing", {
    tableName: "fixed_price_listings",
    user() {
        return this.belongsTo("User");
    },
    art() {
        return this.belongsTo("Art");
    },
    cartItems() {
        return this.hasMany("CartItem");
    },
});

const CartItem = bookshelf.model("CartItem", {
    tableName: "cart_items",
    fixedPriceListing() {
        return this.belongsTo("FixedPriceListing");
    },
});

module.exports = { BlacklistedToken, Admin, Country, Media, Tag, Vault, Art, Artist, User, FixedPriceListing, CartItem };
