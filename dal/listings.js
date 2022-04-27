const { FixedPriceListing } = require("../models");

const getAllFixedPriceListing = async () => {
    return await FixedPriceListing.fetchAll();
};

module.exports = {
    getAllFixedPriceListing,
};
