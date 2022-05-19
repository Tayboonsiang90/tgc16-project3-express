const { Art, Artist, Vault, Tag, Media, User } = require("../models");

async function fetchUsers() {
    return await User.fetchAll().map((user) => [user.get("id"), user.get("username") + " (" + user.get("email") + ")"]);
}

async function fetchArtists() {
    return await Artist.fetchAll().map((artist) => {
        return [artist.get("id"), artist.get("first_name") + " " + artist.get("last_name")];
    });
}

async function fetchVaults() {
    return await Vault.fetchAll().map((vault) => {
        return [vault.get("id"), vault.get("name")];
    });
}

async function fetchMedias() {
    return await Media.fetchAll().map((media) => [media.get("id"), media.get("name")]);
}

async function fetchTags() {
    return await Tag.fetchAll().map((tag) => [tag.get("id"), tag.get("name")]);
}

async function fetchArt(artId) {
    const art = await Art.where({
        id: artId,
    }).fetch({
        require: true,
        withRelated: ["artist", "vault", "tags", "medias"],
    });

    return art;
}

const getAllArts = async () => {
    return await Art.collection().fetch({ withRelated: ["artist", "vault", "tags", "medias"] });
};

module.exports = {
    fetchArtists,
    fetchVaults,
    fetchMedias,
    fetchTags,
    fetchArt,
    getAllArts,
    fetchUsers,
};
