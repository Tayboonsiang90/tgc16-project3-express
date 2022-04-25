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
    return db.createTable("users", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        email: { type: "string", length: 200, notNull: true },
        password: { type: "string", length: 100, notNull: true },
        first_name: { type: "string", length: 100 },
        last_name: { type: "string", length: 100 },
        contact_number: { type: "bigint" },
        date_created: { type: "datetime", notNull: true },
    });
};

exports.down = function (db) {
    return db.dropTable("users");
};

exports._meta = {
    version: 1,
};
