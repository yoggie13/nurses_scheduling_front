import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import services from "../../services/services";
import Loading from "../Loading";
import Notification from "../Notification";

export default function Settings_Patterns() {
  const [patterns, setPatterns] = useState([]);
  const [patternsToChange, setPatternsToChange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();

  useEffect(() => {
    setLoading(true);
    getPatterns();
  }, []);

  const getPatterns = async () => {
    var res = await services.GetPatterns();

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setPatterns(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju podataka",
      });
    }
  };
  const handleNameChange = (e, index) => {
    var n = patterns;
    n[index].Name = e.target.value;

    setPatterns([...n]);

    addPaternsToChange(index);
  };
  const handleSymbolChange = (e, index) => {
    var n = patterns;
    n[index].Symbol = e.target.value;

    setPatterns([...n]);

    addPaternsToChange(index);
  };
  const addPaternsToChange = (index) => {
    var n = patternsToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setPatternsToChange([...n]);
  };
  const handleNumberChange = (e, index) => {
    if (
      e.target.value !== "" &&
      (isNaN(parseFloat(e.target.value)) || /[a-zA-Z]/g.test(e.target.value))
    )
      return;
    // if (e.target.value !== "" && !/^[0-9]+$/.test(e.target.value))
    //     return;

    var n = patterns;
    n[index].Duration = e.target.value;

    setPatterns([...n]);

    addPaternsToChange(index);
  };
  const handleSave = async (e) => {
    setLoading(true);

    if (
      patternsToChange !== undefined &&
      patternsToChange !== null &&
      patternsToChange.length > 0
    ) {
      var editData = [];
      for (let i = 0; i < patternsToChange.length; i++) {
        if (
          patterns[patternsToChange[i]].Duration === undefined ||
          patterns[patternsToChange[i]].Duration === null ||
          patterns[patternsToChange[i]].Duration === ""
        ) {
          setAlert({
            success: false,
            message: "Parametar ne može biti prazan",
          });
          setLoading(false);
          return;
        }
        editData.push(patterns[patternsToChange[i]]);
      }

      var res = await services.EditPatterns(editData);
      if (res !== undefined && res.status === 200) {
        setAlert({
          success: true,
          message: "Uspešno sačuvane izmene",
        });
        setLoading(false);
      } else {
        setAlert({
          success: false,
          message: "Greška pri čuvanju izmena",
        });
      }
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="SettingsArray">
          {patterns.map((shift, index) => (
            <div key={index} className="SettingsRow">
              <TextField
                className="ShiftName"
                value={shift.Name}
                onChange={(e) => handleNameChange(e, index)}
                label="Naziv smene"
              />
              <TextField
                className="ShiftDuration"
                value={shift.Duration}
                onChange={(e) => handleNumberChange(e, index)}
                label="Trajanje smene"
              />
              <TextField
                className="ShiftSymbol"
                value={shift.Symbol}
                onChange={(e) => handleSymbolChange(e, index)}
                label="Simbol smene"
              />
            </div>
          ))}
          <button
            className="MyButton"
            disabled={
              patternsToChange === undefined ||
              patternsToChange === null ||
              patternsToChange.length <= 0
            }
            onClick={(e) => handleSave(e)}
          >
            Sačuvaj izmene
          </button>
        </div>
      )}
      {alert !== undefined && alert !== null ? (
        <Notification
          success={alert.success}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : null}
    </>
  );
}
