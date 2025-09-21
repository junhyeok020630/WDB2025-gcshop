// 202136049 최준혁
var mysql = require('mysql');
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2025',
    multipleStatements: true
});
db.connect();
module.exports = db;