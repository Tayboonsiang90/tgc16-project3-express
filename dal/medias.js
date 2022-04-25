const { Media } = require("../models");

async function fetchMedia(mediaId) {
    const media = await Media.where({
        id: mediaId,
    }).fetch({
        require: true,
    });

    return media;
}

const getAllMedias = async () => {
    return await Media.fetchAll();
};

module.exports = {
    fetchMedia,
    getAllMedias,
};