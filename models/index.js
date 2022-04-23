const bookshelf = require("../bookshelf");

const Admin = bookshelf.model("Admin", {
    tableName: "admins",
});

const Country = bookshelf.model("Country", {
    tableName: "countries",
    vaults() {
        return this.belongsTo("Vault");
    },
});

const Media = bookshelf.model("Media", {
    tableName: "medias",
});

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
});

const Vault = bookshelf.model("Vault", {
    tableName: "vaults",
    country() {
        return this.belongsTo("Country");
    },
});

module.exports = { Admin, Country, Media, Tag, Vault };
