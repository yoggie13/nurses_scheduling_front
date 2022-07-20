const { query } = require("express");
const express = require("express");
var mysql = require("mysql");
var cors = require('cors');

var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}



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

app.options("nurses/", cors());
app.use(cors())

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

app.get('/nursesForSelect', (req, res) => {
    connection.query("SELECT * FROM nurses", (err, result, fields) => {
        if (err) {
            res.status(400).send("Greška pri čitanju podataka iz baze");
        }
        var ret = [];
        result.forEach((nurse) => {
            ret.push({
                id: nurse.NurseID,
                label: `${nurse.Name} ${nurse.Surname}`
            })
        })
        res.json(ret);
    });
})
app.get('/daysForSelect', (req, res) => {
    connection.query("SELECT * FROM nonworkingdaytypes", (err, result, fields) => {
        if (err) {
            res.status(400).send("Greška pri učitavanju podataka iz baze")
        }
        var ret = [];
        result.forEach((day) => {
            ret.push({
                id: day.NonWorkingDayTypeID,
                label: day.Name
            })
        })
        res.json(ret)
    })
})

app.get('/nurses', (req, res) => {
    connection.query("SELECT * FROM nurses", (err, result, fields) => {
        if (err) {
            res.status(500).send("Greška pri čitanju iz baze");
        }
        res.json(result)
    })
})
app.put('/nurses', (req, res) => {
    var edit = req.body;

    if (checkIfRequestEmpty(edit) || edit.length <= 0) {
        res.status(400).send("Neispravno uneti podaci");
    }

    beginTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri unosu podataka u bazu");
    };

    edit.forEach((nurse) => {
        connection.query(`UPDATE nurses SET Name = '${nurse.Name}', Surname = '${nurse.Surname}', Experienced = ${nurse.Experienced} WHERE NurseID = ${nurse.NurseID}`,
            (err) => {
                if (err) {
                    rollBackTransaction;
                    res.status(500).send("Greška pri čuvanju izmena u bazi");
                }
            });
    });

    commitTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri čuvanju izmena u bazi");
    };

    res.status(200).send("Uspešno sačuvano :)");
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
        connection.query(`INSERT INTO nurses (name, surname, experienced) value("${nurse.Name}", "${nurse.Surname}", ${nurse.Experienced})`,
            (err) => {
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

app.delete('/nurses', (req, res) => {
    var nurses = req.body;

    if (checkIfRequestEmpty(nurses) || nurses.length <= 0) {
        res.status(400).send("Neispravno uneti podaci");
    }

    beginTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri unosu podataka u bazu");
    };
    nurses.forEach((nurse) => {
        connection.query(`DELETE FROM nurses WHERE NurseID = ${nurse})`, (err) => {
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
        if (err) {
            res.status(500).send("Greška pri čitanju iz baze");
        }
        res.json(result);
    });
})
app.put('/parameters', (req, res) => {
    var edit = req.body;

    if (checkIfRequestEmpty(edit) || edit.length <= 0) {
        res.status(400).send("Neispravno uneti podaci");
    }

    beginTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri unosu podataka u bazu");
    };

    edit.forEach((param) => {
        connection.query(`UPDATE parameters SET Name = '${param.Name}', Number = ${param.Number} WHERE ParameterID = ${param.ParameterID}`,
            (err) => {
                if (err) {
                    rollBackTransaction;
                    res.status(500).send("Greška pri čuvanju izmena u bazi");
                }
            });
    });

    commitTransaction(), (err) => {
        if (err)
            res.status(500).send("Greška pri čuvanju izmena u bazi");
    };

    res.status(200).send("Uspešno sačuvano :)");
})




