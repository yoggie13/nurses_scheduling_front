const { query } = require("express");
const express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "yoggie13",
    password: "Mmjesuper.13",
    database: "nurseschedulingdb"
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to mysql");
})

const PORT = process.env.PORT || 3001;

const app = express();

const checkIfRequestEmpty = (req) => {
    return req === undefined
        || req === null
        || Object.keys(req).length === 0
        || Object.getPrototypeOf(req) === Object.prototype
}
const beginTransaction = () => {
    connection.query("START TRANSACTION", (err) => {
        if (err) throw err;
    });
}
const commitTransaction = () => {
    connection.query("COMMIT", (err) => {
        if (err) throw err;
    });
}
const rollBackTransaction = () => {
    connection.query("ROLLBACK TRANSACTION", (err) => {
        if (err) throw err;
    });
}

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get('/nurses', (req, res) => {
    connection.query("SELECT * FROM nurses", (err, result, fields) => {
        if (err) {
            res.status(400).send("Greška pri čitanju podataka iz baze");
        }
        res.json(result);
    });
})

app.post('/nurses', (req, res) => {
    var nurses = req.body;

    if (checkIfRequestEmpty(nurses) || nurses.length <= 0) {
        res.status(400).send("Neispravno uneti podaci");
    }

    beginTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri unosu podataka u bazu");
    };
    nurses.forEach((nurse) => {
        connection.query(`INSERT INTO nurses (name, surname, experienced) value("${nurse.Name}", "${nurse.Surname}", ${nurse.Experienced})`, (err) => {
            if (err) {
                rollBackTransaction;
                res.status(500).send("Greška pri unosu podataka u bazu");
            }
        });
    })
    commitTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri unosu podataka u bazu");
    };
    res.status(200).send("Uspešno sačuvano :)")
})

app.get('/parameters', (req, res) => {
    connection.query("SELECT * FROM parameters", (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})
