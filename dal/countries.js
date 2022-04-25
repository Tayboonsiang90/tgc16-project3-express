const { Country } = require("../models");

async function fetchCountry(countryId) {
    const country = await Country.where({
        id: countryId,
    }).fetch({
        require: true,
    });

    return country;
}

const getAllCountries = async () => {
    return await Country.fetchAll();
};

module.exports = {
    fetchCountry,
    getAllCountries,
};
