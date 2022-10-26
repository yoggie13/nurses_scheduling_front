import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import functions from "../../services/functions";
import services from "../../services/services";
import settings_functions from "../../services/settings_functions";
import Loading from "../Loading";
import Notification from "../Notification";

export default function Settings_Parameters() {
  const [parameters, setParameters] = useState([]);
  const [parametersToChange, setParametersToChange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();

  useEffect(() => {
    setLoading(true);
    getParameters();
  }, []);

  const getParameters = async () => {
    var res = await services.GetParameters();

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setParameters(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju podataka",
      });
    }
  };

  const addParametersForChange = (index) => {
    var n = parametersToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setParametersToChange([...n]);
  };
  const handleSave = async (e) => {
    setLoading(true);

    if (!functions.isEmptyArray(parametersToChange)) {
      var editData = [];
      for (let i = 0; i < parametersToChange.length; i++) {
        if (
          !functions.isValidTextField(parameters[parametersToChange[i]].Number)
        ) {
          setAlert({
            success: false,
            message: "Parametar ne može biti prazan",
          });
          break;
        }
        editData.push(parameters[parametersToChange[i]]);
      }

      var res = await services.EditParameters(editData);
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
          {parameters.map((param, index) => (
            <div key={index} className="SettingsRow">
              <TextField
                className="ParameterName"
                value={param.Name}
                onChange={(e) =>
                  settings_functions.updateTextState(
                    parameters,
                    setParameters,
                    e.target.value,
                    index,
                    addParametersForChange,
                    "Name"
                  )
                }
                label="Naziv parametra"
              />
              <TextField
                className="ParameterNumber"
                value={param.Number}
                onChange={(e) =>
                  settings_functions.updateNumbersState(
                    parameters,
                    setParameters,
                    e.target.value,
                    index,
                    addParametersForChange,
                    "Number"
                  )
                }
                label="Vrednost"
              />
            </div>
          ))}
          <button
            className="MyButton"
            disabled={functions.isEmptyArray(parametersToChange)}
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
