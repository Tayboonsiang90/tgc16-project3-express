const { Media } = require("../models");

async function fetchMedia(mediaId) {
    const media = await Media.where({
        id: mediaId,
    }).fetch({
        require: true,
    });

    return media;
}

module.exports = {
    fetchMedia,
};