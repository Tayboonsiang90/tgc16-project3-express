const bookshelf = require("../bookshelf");

const Admin = bookshelf.model("Admin", {
    tableName: "admins",
});

module.exports = {Admin};
