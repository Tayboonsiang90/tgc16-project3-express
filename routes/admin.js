const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require("../middlewares");

// Landing page after logging in
router.get("/", checkIfAuthenticated, (req, res) => {
    const admin = req.session.admin;
    res.render("admin/index", {
        admin: admin,
    });
});
// Logging out brings you to login page
router.get("/logout", (req, res) => {
    req.session.admin = null;
    req.flash("success_messages", "Goodbye");
    res.redirect("/");
});

module.exports = router;
