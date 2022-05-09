const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        secret,
        {
            expiresIn: expiresIn,
        }
    );
};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
};

const { User, BlacklistedToken } = require("../../models");

//Create Account
router.post("/register", async (req, res) => {
    try {
        if (req.body.password != req.body.repeat_password) throw "The passwords provided do not match.";
        if (!req.body.username) throw "The username wasn't filled in.";
        let findRepeatUsername = await User.where({
            username: req.body.username,
        }).fetch({
            require: false,
        });
        if (findRepeatUsername) throw "This username is currently in use.";
        if (!req.body.email) throw "The email wasn't filled in.";
        let findRepeatEmail = await User.where({
            email: req.body.email,
        }).fetch({
            require: false,
        });
        if (findRepeatEmail) throw "This email is currently in use.";
        if (!req.body.password) throw "The password wasn't filled in.";
        if (!req.body.first_name) throw "The first name wasn't filled in.";
        if (!req.body.last_name) throw "The last name wasn't filled in.";
        if (!req.body.contact_number) throw "The contact number wasn't filled in.";
        if (!req.body.country_id) throw "The country wasn't filled in.";

        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: getHashedPassword(req.body.password),
            country_id: req.body.country_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact_number: req.body.contact_number,
            date_created: new Date(),
        });
        await user.save();
        res.status(200);
        res.send({
            message: "Successfully registered.",
        });
    } catch (e) {
        res.status(400);
        res.send({
            error: e,
        });
    }
});

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    let arts = await User.where({
        id: user.id,
    }).fetch({
        withRelated: ["arts"],
    });
    returnObject = arts.toJSON();
    delete returnObject.password;
    res.send(returnObject);
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body.email) throw "The email wasn't filled in.";
        if (!req.body.password) throw "The password wasn't filled in.";

        let user = await User.where({
            email: req.body.email,
        }).fetch({
            require: false,
        });

        // if user exists and the password is equals
        if (user && user.get("password") == getHashedPassword(req.body.password)) {
            const userObject = {
                email: user.get("email"),
                id: user.get("id"),
            };
            let accessToken = generateAccessToken(userObject, process.env.TOKEN_SECRET, "15m");
            let refreshToken = generateAccessToken(userObject, process.env.REFRESH_TOKEN_SECRET, "7d");
            res.status(200);
            res.send({
                accessToken,
                refreshToken,
            });
        } else {
            throw "Wrong email or password";
        }
    } catch (e) {
        res.status(400);
        res.send({
            error: e,
        });
    }
});

router.post("/refresh", async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    }

    // check if the refresh token has been black listed
    let blacklistedToken = await BlacklistedToken.where({
        token: refreshToken,
    }).fetch({
        require: false,
    });

    // if the refresh token has already been blacklisted
    if (blacklistedToken) {
        res.status(401);
        return res.send("The refresh token has already expired");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, "15m");
        res.send({
            accessToken,
        });
    });
});

router.post("/logout", async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set("token", refreshToken);
            token.set("date_created", new Date()); // use current date
            await token.save();
            res.send({
                message: "logged out",
            });
        });
    }
});

module.exports = router;
