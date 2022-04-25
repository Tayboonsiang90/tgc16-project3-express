const { Tag } = require("../models");

async function fetchTag(tagId) {
    const tag = await Tag.where({
        id: tagId,
    }).fetch({
        require: true,
    });

    return tag;
}

module.exports = {
    fetchTag,
};