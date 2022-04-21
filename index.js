const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false,
    })
);

// set up sessions
app.use(
    session({
        store: new FileStore({ path: "./sessions/" }),
        secret: "process.env.SESSION_SECRET_KEY",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// Share the admin data with hbs files
app.use(function (req, res, next) {
    res.locals.admin = req.session.admin;
    next();
});

// import in routes
const landingRoutes = require("./routes/landing");
const adminRoutes = require("./routes/admin");

async function main() {
    app.use("/", landingRoutes);
    app.use("/admin", adminRoutes);
}

main();

app.listen(process.env.PORT, () => {
    console.log("Server has started");
});
