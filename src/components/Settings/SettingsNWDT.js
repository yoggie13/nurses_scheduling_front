import React from "react";
import services from "../../services/services";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Loading from "../Loading";
import Notification from "../Notification";
import { DeleteForeverOutlined } from "@mui/icons-material";
import Modal from "../Modal";
import functions from "../../services/functions";
import settings_functions from "../../services/settings_functions";

export default function SettingsNWDT() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [types, setTypes] = useState([]);
  const [typesToChange, setTypesToChange] = useState([]);
  const [modal, setModal] = useState(false);
  const [newDay, setNewDay] = useState({
    Name: "",
    Symbol: "",
    NumberOfHours: 0,
  });

  useEffect(() => {
    setLoading(true);
    getTypes();
  }, []);

  const getTypes = async () => {
    var res = await services.GetNWDTypes();

    if (res !== undefined && res.status === 200) {
      res.json().then((result) => {
        setTypes(result);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri dovlačenju podataka",
      });
    }
  };

  const addTypesToChange = (index) => {
    var n = typesToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setTypesToChange([...n]);
  };

  const handleSave = async (e) => {
    setLoading(true);

    if (!functions.isEmptyArray(typesToChange)) {
      var editData = [];
      for (let i = 0; i < typesToChange.length; i++) {
        editData.push(types[typesToChange[i]]);
      }

      var res = await services.EditNWDTypes(editData);
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
  const handleDelete = async (id) => {
    setLoading(true);
    var res = await services.DeleteNWDTypes(id);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno obrisano",
      });
      getTypes();
      setLoading(false);
    } else {
      setAlert({
        success: false,
        message: "Greška pri brisanju",
      });
      setLoading(false);
    }
  };

  const handleNewNumberChange = (e, index) => {
    if (
      e.target.value !== "" &&
      (isNaN(parseFloat(e.target.value)) || /[a-zA-Z]/g.test(e.target.value))
    )
      return;

    setNewDay({ ...newDay, NumberOfHours: e.target.value });
  };
  const handleNewDaySave = async () => {
    setLoading(true);
    console.log(newDay.length);
    if (
      functions.isValidTextField(newDay) &&
      functions.isValidTextField(newDay.Name) &&
      functions.isValidTextField(newDay.Symbol) &&
      functions.isValidTextField(newDay.NumberOfHours)
    ) {
      var res = await services.AddNewDay(newDay);

      if (res !== undefined && res.status === 200) {
        setAlert({ success: true, message: "Uspešno dodavanje" });
        getTypes();
        setModal(false);
      } else {
        setAlert({ success: false, message: "Greška pri dodavanju" });
        setLoading(false);
      }
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="SettingsArray">
          {types.map((type, index) => (
            <div key={index} className="SettingsRow">
              <TextField
                value={type.Name}
                className="TypeName"
                onChange={(e) =>
                  settings_functions.updateTextState(
                    types,
                    setTypes,
                    e.target.value,
                    index,
                    addTypesToChange,
                    "Name"
                  )
                }
                label="Naziv"
              />
              <TextField
                value={type.Symbol}
                className="TypeSymbol"
                onChange={(e) =>
                  settings_functions.updateTextState(
                    types,
                    setTypes,
                    e.target.value,
                    index,
                    addTypesToChange,
                    "Symbol"
                  )
                }
                label="Simbol"
              />
              <TextField
                value={type.NumberOfHours}
                className="TypeSymbol"
                onChange={(e) =>
                  settings_functions.updateFloatNumbersState(
                    types,
                    setTypes,
                    e.target.value,
                    index,
                    addTypesToChange,
                    "NumberOfHours"
                  )
                }
                label="Br. sati"
              />
              <DeleteForeverOutlined
                onClick={(e) => handleDelete(type.NonWorkingDayTypeID)}
              />
            </div>
          ))}
          <div>
            <button className="MyButton" onClick={(e) => setModal(true)}>
              Dodaj slobodan dan
            </button>
            <button
              className="MyButton"
              disabled={functions.isEmptyArray(typesToChange)}
              onClick={(e) => handleSave(e)}
            >
              Sačuvaj izmene
            </button>
          </div>
        </div>
      )}
      {alert !== undefined && alert !== null ? (
        <Notification
          success={alert.success}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : null}
      {modal ? (
        <Modal
          content={
            <>
              <TextField
                label="Naziv"
                value={newDay.Name}
                onChange={(e) => setNewDay({ ...newDay, Name: e.target.value })}
              />
              <TextField
                label="Simbol"
                value={newDay.Symbol}
                onChange={(e) =>
                  setNewDay({ ...newDay, Symbol: e.target.value })
                }
              />
              <TextField
                label="Trajanje"
                value={newDay.NumberOfHours}
                onChange={(e) => handleNewNumberChange(e)}
              />
              <button className="MyButton" onClick={(e) => handleNewDaySave()}>
                Dodaj
              </button>
            </>
          }
          setModal={setModal}
        />
      ) : null}
    </>
  );
}
