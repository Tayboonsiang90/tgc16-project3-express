const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// import in the Admin model
const { Admin } = require("../models");

const { createLoginForm, bootstrapField } = require("../forms");

//Hashing function
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
};

router.get("/", (req, res) => {
    const loginForm = createLoginForm();
    res.render("landing/index", {
        form: loginForm.toHTML(bootstrapField),
    });
});

router.post("/", async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async (form) => {
            // process the login

            // ...find the admin by username and password
            let admin = await Admin.where({
                username: form.data.username,
            }).fetch({
                require: false,
            });

            if (!admin) {
                req.flash("error_messages", "Sorry, the authentication details you provided does not work.");
                res.redirect("/");
            } else {
                // check if the password matches
                if (admin.get("password") === getHashedPassword(form.data.password)) {
                    console.log("login successful");
                    // add to the session that login succeed

                    // store the admin details
                    req.session.admin = {
                        id: admin.get("id"),
                        username: admin.get("username"),
                    };

                    // setTimeout(() => {}, 2000);
                    req.flash("success_messages", "Welcome back, " + admin.get("username"));
                    res.redirect("/admin/");
                    console.log("Redirect should have happened!");
                } else {
                    console.log("WTF?");
                    req.flash("error_messages", "Sorry, the authentication details you provided does not work.");
                    res.redirect("/");
                }
            }
        },
        error: (form) => {
            console.log("WTF?");
            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again");
            res.render("landing/index", {
                form: form.toHTML(bootstrapField),
            });
        },
    });
});

module.exports = router;
