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
    return db.createTable("artists", {
        id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
        first_name: { type: "string", length: 100 },
        last_name: { type: "string", length: 100 },
        profile: { type: "string", length: 10000 },
    });
};

exports.down = function (db) {
    return db.dropTable("artists");
};

exports._meta = {
  "version": 1
};
