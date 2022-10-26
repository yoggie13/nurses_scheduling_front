import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import functions from "../../services/functions";
import services from "../../services/services";
import settings_functions from "../../services/settings_functions";
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

  const handleSave = async (e) => {
    setLoading(true);

    if (!functions.isEmptyArray(patternsToChange)) {
      var editData = [];
      for (let i = 0; i < patternsToChange.length; i++) {
        if (
          !functions.isValidTextField(patterns[patternsToChange[i]].Duration)
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
                onChange={(e) =>
                  settings_functions.updateTextState(
                    patterns,
                    setPatterns,
                    e.target.value,
                    index,
                    addPaternsToChange,
                    "Name"
                  )
                }
                label="Naziv smene"
              />
              <TextField
                className="ShiftDuration"
                value={shift.Duration}
                onChange={(e) =>
                  settings_functions.updateFloatNumbersState(
                    patterns,
                    setPatterns,
                    e.target.value,
                    index,
                    addPaternsToChange,
                    "Duration"
                  )
                }
                label="Trajanje smene"
              />
              <TextField
                className="ShiftSymbol"
                value={shift.Symbol}
                onChange={(e) =>
                  settings_functions.updateTextState(
                    patterns,
                    setPatterns,
                    e.target.value,
                    index,
                    addPaternsToChange,
                    "Symbol"
                  )
                }
                label="Simbol smene"
              />
            </div>
          ))}
          <button
            className="MyButton"
            disabled={functions.isEmptyArray(patternsToChange)}
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
