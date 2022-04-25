const { Country } = require("../models");

async function fetchCountry(countryId) {
    const country = await Country.where({
        id: countryId,
    }).fetch({
        require: true,
    });

    return country;
}

module.exports = {
    fetchCountry,
};