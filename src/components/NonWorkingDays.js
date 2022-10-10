import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import functions from "../services/functions";
import services from "../services/services";
import AutoCompleteComponent from "./AutoCompleteComponent";
import Loading from "./Loading";
import Notification from "./Notification";
import ShiftPicker from "./ShiftPicker";

export default function NonWorkingDays({
  nurse,
  setNurse,
  nurseArr,
  dateRange,
  setDateRange,
  nursesAndDays,
  setNursesAndDays,
  clearCheckedDates,
  isMandatory,
  setIsMandatory,
  checkOverlap,
}) {
  const [day, setDay] = useState("");
  const [dayArr, setDayArr] = useState([]);
  const [allShifts, setAllShifts] = useState(true);
  const [shiftPick, setShiftPick] = useState([false, false, false]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();

  useEffect(() => {
    setLoading(true);
    getDays();
  }, []);

  useEffect(() => {
    if (!allShifts) setDay(undefined);
  }, [allShifts]);

  const getDays = async () => {
    var res = await services.GetDaysForSelect();

    if (res === undefined) {
      setAlert({
        success: false,
        message: "Greška pri učitavanju",
      });
      return;
    }

    if (res.status === 200) {
      res.json().then((response) => {
        setDayArr(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju",
      });
    }
  };
  const setDefault = () => {
    setNurse();
    setDay();
    clearCheckedDates();
    setShiftPick([false, false, false]);
    setIsMandatory(true);
    setAllShifts(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !functions.isValidTextField(nurse) ||
      !functions.isValidTextField(dateRange) ||
      (allShifts && !functions.isValidTextField(day)) ||
      (!allShifts && !shiftPick[0] && !shiftPick[1] && !shiftPick[2])
    ) {
      setAlert({
        success: false,
        message: "Nisu popunjeni svi podaci",
      });
      return;
    }

    if (!checkOverlap(nurse.id, dateRange.date_from, dateRange.date_until)) {
      var nurseDay = {
        id: nursesAndDays.length,
        NurseID: nurse.id,
        Nurse_Name: nurse.label,
        DateFrom: dateRange.date_from,
        DateUntil: dateRange.date_until,
        DayType: day === undefined ? undefined : day.id,
        Day_Type_Label: day === undefined ? undefined : day.label,
        Shifts: allShifts ? "all" : shiftPick,
        IsMandatory: isMandatory,
      };

      var n = nursesAndDays;
      n.push(nurseDay);
      setNursesAndDays([...n]);
      setDefault();
    } else {
      setAlert({
        success: false,
        message: "Već ste za tu sestru uneli te dane",
      });
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AutoCompleteComponent
            id="nurse-select"
            label="Sestra/Tehničar"
            value={nurse}
            setValue={setNurse}
            menuItems={nurseArr}
          />
          <AutoCompleteComponent
            id="day-select"
            label="Tip dana"
            value={day}
            setValue={setDay}
            menuItems={dayArr}
            readOnly={!allShifts}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                />
              }
              label="Obavezan"
            />
          </FormGroup>
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
          <button
            className="MyButton"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Unesi
          </button>
        </>
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
