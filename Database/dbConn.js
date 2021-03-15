"use strict";

// local RDBMS(Mysql)
const mysql = require("mysql");
const connection = mysql.createConnection({
    host        : "127.0.0.1",
    user        : "root",
    password    : "password",
    database    : "testdb",
});

module.exports = connection;
