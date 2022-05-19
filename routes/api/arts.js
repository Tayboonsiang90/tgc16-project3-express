const express = require("express");
const router = express.Router();
const { Art } = require("../../models");

const knex = require("knex")({
    client: process.env.DB_DRIVER,
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

const productDataLayer = require("../../dal/arts");

router.get("/", async (req, res) => {
    console.log("hi");
    console.log(req.query);
    let q = Art.collection();

    if (req.query.name) {
        q.where("name", "like", "%" + req.query.name + "%");
    }

    if (req.query.min_year) {
        q.where("year", ">=", req.query.min_year);
    }

    if (req.query.max_year) {
        q.where("year", "<=", req.query.max_year);
    }

    // if (req.query.artist) {
    //     q.where("category_id", "=", req.query.category_id);
    // }

    // if (req.query.tags) {
    //     // joining in bookshelf:
    //     q.query("join", "products_tags", "products.id", "product_id").where("tag_id", "in", form.data.tags.split(","));
    //     // eqv:
    //     // SELECT * FROM products JOIN products_tags ON products.id = product_id
    //     // WHERE tag_id in (1,4)
    // }

    // 3. execute the query and fetch the results
    let arts = await q.fetch({
        withRelated: ["artist"],
    }); // execute the query

    // console.log(arts.toJSON());

    res.send(
        arts.toJSON()
    );
});

router.get("/:art_id", async (req, res) => {
    res.send(await productDataLayer.fetchArt(req.params.art_id));
});

router.get("/:art_id/ownership", async (req, res) => {
    let arts = await Art.where({
        id: req.params.art_id,
    }).fetch({
        withRelated: ["users"],
    });

    res.send(arts.toJSON().users);
});

module.exports = router;
