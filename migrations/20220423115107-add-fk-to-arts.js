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

exports.up = async function (db) {
    await db.addColumn("arts", "vault_id", {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
            name: "art_vault_fk",
            table: "arts",
            rules: {
                onDelete: "cascade",
                onUpdate: "restrict",
            },
            mapping: "id",
        },
    });

    return db.addColumn("arts", "artist_id", {
        type: "int",
        unsigned: true,
        notNull: true,
        foreignKey: {
            name: "art_artist_fk",
            table: "arts",
            rules: {
                onDelete: "cascade",
                onUpdate: "restrict",
            },
            mapping: "id",
        },
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    version: 1,
};
