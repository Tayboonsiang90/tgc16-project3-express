const { Vault, Country } = require("../models");

async function fetchVault(vaultId) {
    const vault = await Vault.where({
        id: vaultId,
    }).fetch({
        require: true,
    });

    return vault;
}

async function fetchCountries() {
    return await Country.fetchAll().map((country) => {
        return [country.get("id"), country.get("name")];
    });
}

const getAllVaults = async () => {
    return await Vault.fetchAll();
};

module.exports = {
    fetchVault,
    fetchCountries,
    getAllVaults,
};
