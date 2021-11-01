'use strict';

const sqlite = require("sqlite3");

const db = new sqlite.Database('/Users/alessandrobacci/Github/lab-dsp/databases/databaseV1.db', err => {
    if (err) throw err;
})

module.exports = db;