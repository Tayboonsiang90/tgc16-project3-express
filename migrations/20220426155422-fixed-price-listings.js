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
    return db.createTable("fixed_price_listings", {
        id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
        share: { type: "int", unsigned: true },
        price: { type: "decimal", unsigned: true },
        date_created: { type: "timestamp", notNull: true },
    });
};

exports.down = function (db) {
    return db.dropTable("fixed_price_listings");
};

exports._meta = {
    version: 1,
};
