import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import functions from "../../services/functions";
import services from "../../services/services";
import settings_functions from "../../services/settings_functions";
import Loading from "../Loading";
import Notification from "../Notification";

export default function Settings_Shifts() {
  const [shifts, setShifs] = useState([]);
  const [shiftsToChange, setShifsToChange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();

  useEffect(() => {
    setLoading(true);
    getShifts();
  }, []);

  const getShifts = async () => {
    var res = await services.GetShifts();

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setShifs(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju podataka",
      });
    }
  };

  const addShiftsToChange = (index) => {
    var n = shiftsToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setShifsToChange([...n]);
  };

  const handleSave = async (e) => {
    setLoading(true);

    if (!functions.isEmptyArray(shiftsToChange)) {
      var editData = [];
      for (let i = 0; i < shiftsToChange.length; i++) {
        editData.push(shifts[shiftsToChange[i]]);
      }

      var res = await services.EditShifts(editData);
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
          {shifts.map((shift, index) => (
            <div key={index} className="SettingsRow">
              <p>{shift.ShiftID}.</p>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shift.StrongIntensity === 1 ? true : false}
                      onChange={(e) =>
                        settings_functions.updateBoolState(
                          shifts,
                          setShifs,
                          e.target.checked,
                          index,
                          addShiftsToChange,
                          "StrongIntensity"
                        )
                      }
                    />
                  }
                  label="Jak intenzitet"
                />
              </FormGroup>
            </div>
          ))}
          <button
            className="MyButton"
            disabled={functions.isEmptyArray(shiftsToChange)}
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
