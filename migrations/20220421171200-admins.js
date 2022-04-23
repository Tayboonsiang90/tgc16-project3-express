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
    await db.createTable("admins", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        username: { type: "string", length: 100, notNull: true },
        password: { type: "string", length: 100, notNull: true },
    });

    return db.insert("admins", ["username", "password"], ["root", "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg="]);
};

exports.down = function (db) {
    return db.dropTable("admins");
};

exports._meta = {
    version: 1,
};
