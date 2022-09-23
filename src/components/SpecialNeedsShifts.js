import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import ShiftPicker from "./ShiftPicker";
import Notification from "./Notification";

export default function SpecialNeedsShifts({
  handleSpecialNeedsShifts,
  dateRange,
  clearCheckedDates,
}) {
  const [allShifts, setAllShifts] = useState(true);
  const [shiftPick, setShiftPick] = useState([false, false, false]);
  const [number, setNumber] = useState();
  const [alert, setAlert] = useState();

  const handleSubmit = async (e) => {
    if (
      (allShifts || shiftPick.includes(true)) &&
      number !== undefined &&
      number != null &&
      number !== "" &&
      dateRange !== undefined &&
      dateRange !== null
    ) {
      await handleSpecialNeedsShifts(
        allShifts === true ? "all" : shiftPick,
        parseInt(number)
      );

      setAllShifts(true);
      setShiftPick([false, false, false]);
      setNumber("");
      clearCheckedDates();
    } else {
      setAlert({
        success: false,
        message: "Niste uneli sve potrebne podatke",
      });
    }
  };
  const handleNumberChange = (n) => {
    if (n !== "" && !/^[0-9]+$/.test(n)) return;

    setNumber(n);
  };

  return (
    <>
      {
        <>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={allShifts}
                  onChange={(e) => setAllShifts(e.target.checked)}
                />
              }
              label="Sve smene"
            />
          </FormGroup>
          {!allShifts ? (
            <ShiftPicker shiftPick={shiftPick} setShiftPick={setShiftPick} />
          ) : null}
          <TextField
            label="Broj sestara potrebnih"
            variant="standard"
            value={number}
            onChange={(e) => handleNumberChange(e.target.value)}
          />
          <button
            className="MyButton"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Unesi
          </button>
        </>
      }
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
