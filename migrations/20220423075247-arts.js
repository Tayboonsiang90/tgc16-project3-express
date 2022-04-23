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
    return db.createTable("arts", {
        id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
        name: { type: "string", length: 300 },
        description: { type: "string", length: 10000 },
        year: { type: "smallint", unsigned: true },
        total_share: { type: "int", unsigned: true },
    });
};

exports.down = function (db) {
    return db.dropTable("arts");
};
exports._meta = {
    version: 1,
};
