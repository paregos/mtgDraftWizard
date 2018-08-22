"use strict";

var pg = require("pg");

exports.handler = function(event, context) {
    var dbConfig = {
        user: "",
        password: "",
        database: "",
        host: "",
        port: 5432
    };
    var client = new pg.Client(dbConfig);
    client.connect((err) => {
        if (err) {
            return console.log("Something broke: " + err);
        }
    });

    const query = client.query("SELECT * FROM card");

    // Stream results back one row at a time
    query.on("row", function(row, result) {
        result.addRow(row);
    });

    query.on("end", function(result) {
        var jsonString = JSON.stringify(result.rows);
        var jsonObj = JSON.parse(jsonString);
        console.log(jsonString);
        client.end();
        context.succeed(jsonObj);
    });
};
