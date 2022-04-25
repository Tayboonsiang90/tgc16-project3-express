const { Artist, Country } = require("../models");

async function fetchArtist(artistId) {
    const artist = await Artist.where({
        id: artistId,
    }).fetch({
        require: true,
    });

    return artist;
}

async function fetchCountries() {
    return await Country.fetchAll().map((country) => {
        return [country.get("id"), country.get("name")];
    });
}

const getAllArtists = async () => {
    return await Artist.fetchAll();
};

module.exports = {
    fetchArtist,
    fetchCountries,
    getAllArtists,
};
