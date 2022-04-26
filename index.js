const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
const cors = require("cors");

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

app.use(cors());

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
const countryRoutes = require("./routes/countries");
const tagRoutes = require("./routes/tags");
const mediaRoutes = require("./routes/medias");
const vaultRoutes = require("./routes/vaults");
const adminRoutes = require("./routes/admin");
const artRoutes = require("./routes/arts");
const artistRoutes = require("./routes/artists");
const cloudinaryRoutes = require("./routes/cloudinary.js");
const api = {
    countries: require("./routes/api/countries"),
    artists: require("./routes/api/artists"),
    medias: require("./routes/api/medias"),
    tags: require("./routes/api/tags"),
    vaults: require("./routes/api/vaults"),
    arts: require("./routes/api/arts"),
    users: require("./routes/api/users"),
    listings: require("./routes/api/listings"),
};

// enable CSRF
const csurfInstance = csrf();
app.use(function (req, res, next) {
    // exclude whatever url we want from CSRF protection
    if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) == "/api/") {
        return next();
    }
    csurfInstance(req, res, next);
});
// Share CSRF with hbs files
app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }

    next();
});
app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired. Please try again");
        res.redirect("back");
    } else {
        next();
    }
});

async function main() {
    app.use("/", landingRoutes);
    app.use("/admin", adminRoutes);
    app.use("/countries", countryRoutes);
    app.use("/medias", mediaRoutes);
    app.use("/tags", tagRoutes);
    app.use("/vaults", vaultRoutes);
    app.use("/arts", artRoutes);
    app.use("/artists", artistRoutes);
    app.use("/cloudinary", cloudinaryRoutes);
    app.use("/api/countries", express.json(), api.countries);
    app.use("/api/artists", express.json(), api.artists);
    app.use("/api/medias", express.json(), api.medias);
    app.use("/api/tags", express.json(), api.tags);
    app.use("/api/vaults", express.json(), api.vaults);
    app.use("/api/arts", express.json(), api.arts);
    app.use("/api/users", express.json(), api.users);
    app.use("/api/listings", express.json(), api.listings);
}

main();

app.listen(process.env.PORT, () => {
    console.log("Server has started");
});
