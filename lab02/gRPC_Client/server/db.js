'use strict';
const database = "../databases/databaseV2.db";
const sqlite = require("sqlite3");

const db = new sqlite.Database(database, err => {
    if (err) throw err;
})

module.exports = db;