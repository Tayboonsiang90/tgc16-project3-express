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
    return db.createTable("arts_users", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        user_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_users_user_fk",
                table: "users",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
        art_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_users_art_fk",
                table: "arts",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
        total_share: { type: "int", unsigned: true },
        share_in_order: { type: "int", unsigned: true },
    });
};

exports.down = function (db) {
    return db.dropTable("arts_users");
};

exports._meta = {
    version: 1,
};
