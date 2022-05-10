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

const getAllFixedPriceListing = async () => {
    return await FixedPriceListing.fetchAll();
};

async function fetchFixedPriceListing(fetchFixedPriceListingId) {
    const fixedPriceListing = await FixedPriceListing.where({
        id: fetchFixedPriceListingId,
    }).fetch({
        require: true,
        withRelated: ["art", "user"],
    });

    return fixedPriceListing;
}

async function fetchFixedPriceListingByArtId(artId) {
    console.log(artId)
    const fixedPriceListing = await FixedPriceListing.where({
        art_id: artId,
    }).fetchAll({
        require: false,
        withRelated: ["user"],
    });

    return fixedPriceListing;
}

async function fetchBalancesForUserArt(userId, artId) {
    let balances = await knex.select().from("arts_users").where("user_id", userId).where("art_id", artId);

    return balances[0].total_share - balances[0].share_in_order;
}

async function fetchBalancesForUserArt(artId) {
    let balances = await knex.select().from("arts_users").where("art_id", artId);

    return balances[0].total_share - balances[0].share_in_order;
}

module.exports = {
    getAllFixedPriceListing,
    fetchFixedPriceListing,
    fetchBalancesForUserArt,
    fetchFixedPriceListingByArtId,
};
