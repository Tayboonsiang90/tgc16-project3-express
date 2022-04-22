const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

router.get("/", checkIfAuthenticated, (req, res) => {
    const admin = req.session.admin;
    res.render("admin/index", {
        admin: admin,
    });
});

router.get("/logout", (req, res) => {
    req.session.admin = null;
    req.flash("success_messages", "Goodbye");
    res.redirect("/");
});

module.exports = router;
