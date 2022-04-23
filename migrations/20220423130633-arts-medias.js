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
    return db.createTable("arts_medias", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        art_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_medias_art_fk",
                table: "arts",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
        media_id: {
            type: "int",
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: "arts_medias_media_fk",
                table: "medias",
                rules: {
                    onDelete: "CASCADE",
                    onUpdate: "RESTRICT",
                },
                mapping: "id",
            },
        },
    });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
