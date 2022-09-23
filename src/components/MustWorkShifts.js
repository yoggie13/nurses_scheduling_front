import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import AutoCompleteComponent from "./AutoCompleteComponent";
import Notification from "./Notification";

export default function MustWorkShifts({
  nurse,
  setNurse,
  nurseArr,
  handleMustWorkSubmit,
  dateRange,
  clearCheckedDates,
  checkOverlap,
}) {
  const [shiftChecked, setShiftChecked] = useState(1);
  const [alert, setAlert] = useState();

  const handleSubmit = async (e) => {
    if (
      nurse !== undefined &&
      nurse !== null &&
      shiftChecked !== undefined &&
      shiftChecked !== null &&
      dateRange !== undefined &&
      dateRange !== null
    ) {
      if (
        !checkOverlap(
          nurse.id,
          dateRange.date_from,
          dateRange.date_until,
          "mws"
        )
      ) {
        await handleMustWorkSubmit(shiftChecked);

        setNurse();
        clearCheckedDates();
      } else {
        setAlert({
          success: false,
          message: "Već ste za tu sestru uneli te dane neradne",
        });
      }
    } else {
      setAlert({
        success: false,
        message: "Niste uneli sve potrebne podatke",
      });
    }
  };
  return (
    <>
      {
        <>
          <AutoCompleteComponent
            id="nurse-select"
            label="Sestra/Tehničar"
            value={nurse}
            setValue={setNurse}
            menuItems={nurseArr}
          />
          <FormControl>
            <FormLabel id="label-id">Odabir smene</FormLabel>
            <RadioGroup
              aria-labelledby="label-id"
              name="radio-buttons-group"
              value={shiftChecked}
              onChange={(e) => setShiftChecked(e.target.value)}
            >
              <FormControlLabel value={1} control={<Radio />} label="Prva" />
              <FormControlLabel value={2} control={<Radio />} label="Druga" />
              <FormControlLabel value={3} control={<Radio />} label="Treća" />
              <FormControlLabel
                value={4}
                control={<Radio />}
                label="Celodnevna"
              />
            </RadioGroup>
          </FormControl>
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
