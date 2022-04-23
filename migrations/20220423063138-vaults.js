'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
    return db.createTable("vaults", {
        id: { type: "int", unsigned: true, primaryKey: true, autoIncrement: true },
        name: { type: "string", length: 500 },
        address: { type: "string", length: 1000 },
        postal: { type: "int"},
    });
};

exports.down = function (db) {
    return db.dropTable("vaults");
};

exports._meta = {
  "version": 1
};
