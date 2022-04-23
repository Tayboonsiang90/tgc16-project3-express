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
    art() {
        return this.hasMany("Art");
    },
});

const Artist = bookshelf.model("Artist", {
    tableName: "artists",
    country() {
        return this.belongsTo("Country");
    },
    art() {
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
});

module.exports = { Admin, Country, Media, Tag, Vault, Art, Artist };
