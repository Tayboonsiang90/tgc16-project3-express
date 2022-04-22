const bookshelf = require("../bookshelf");

const Admin = bookshelf.model("Admin", {
    tableName: "admins",
});

const Country = bookshelf.model("Country", {
    tableName: "countries",
});

const Media = bookshelf.model("Media", {
    tableName: "medias",
});

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
});

module.exports = { Admin, Country, Media, Tag };
