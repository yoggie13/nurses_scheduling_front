const express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "yoggie13",
    password: "Mmjesuper.13"
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to mysql");
})

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});