"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable("arts_tags", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        art_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_tags_art_fk",
                table: "arts",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
        tag_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_tags_tag_fk",
                table: "tags",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    version: 1,
};
