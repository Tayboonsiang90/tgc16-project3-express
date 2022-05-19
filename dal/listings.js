const { FixedPriceListing, User } = require("../models");
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

const getAllFixedPriceListing = async (userId) => {
    const fixedPriceListing = await FixedPriceListing.where({
        user_id: userId,
    }).fetchAll({
        require: true,
        withRelated: ["art"],
    });

    return fixedPriceListing.toJSON();
};

async function fetchFixedPriceListing(fetchFixedPriceListingId) {
    const fixedPriceListing = await FixedPriceListing.where({
        id: fetchFixedPriceListingId,
    }).fetchAll({
        require: true,
        withRelated: ["art", "user"],
    });

    return fixedPriceListing;
}

async function fetchFixedPriceListingByArtId(artId) {
    const fixedPriceListing = await FixedPriceListing.where({
        art_id: artId,
    }).fetchAll({
        require: false,
        withRelated: ["user"],
    });

    return fixedPriceListing;
}

async function fetchBalancesForUserArt(userId, artId) {
    console.log("thjis knex shit happened");
    let balances = await knex.select().from("arts_users").where("user_id", userId).where("art_id", artId);
    console.log(balances);

    return balances[0].total_share - balances[0].share_in_order;
}

async function fetchBalancesForArt(artId) {
    let balances = await knex.select().from("arts_users").where("art_id", artId);

    return balances[0].total_share - balances[0].share_in_order;
}

module.exports = {
    getAllFixedPriceListing,
    fetchFixedPriceListing,
    fetchBalancesForArt,
    fetchFixedPriceListingByArtId,
    fetchBalancesForUserArt,
};
