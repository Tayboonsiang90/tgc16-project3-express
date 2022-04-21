const checkIfAuthenticated = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        req.flash("error_messages", "You need to sign in to access this page");
        res.redirect("/");
    }
};

module.exports = {
    checkIfAuthenticated,
};
