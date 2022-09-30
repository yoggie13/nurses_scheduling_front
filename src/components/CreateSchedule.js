import React, { useEffect, useState } from "react";
import "../assets/styles/CreateSchedule.css";
import Calendar from "./Calendar";
import NonWorkingTable from "./NonWorkingTable";
import Notification from "./Notification";
import services from "../services/services";
import Loading from "./Loading";
import NonWorkingDays from "./NonWorkingDays";
import MustWorkShifts from "./MustWorkShifts";
import SpecialNeedsShifts from "./SpecialNeedsShifts";
import MustWorkTable from "./MustWorkTable";
import SpecialNeedsShiftsTable from "./SpecialNeedsShiftsTable";
import { TextField } from "@mui/material";

export default function CreateSchedule() {
  const [nurse, setNurse] = useState("");
  const [nurseArr, setNurseArr] = useState([]);
  const [dateRange, setDateRange] = useState();
  const [nursesAndDays, setNursesAndDays] = useState([]);
  const [calendarDays, setCalendarDays] = useState();
  const [alert, setAlert] = useState();
  const [loading, setLoading] = useState();
  const [name, setName] = useState();
  const [isMandatory, setIsMandatory] = useState(true);
  const [mustWorkShifts, setMustWorkShifts] = useState([]);
  const [specialNeedsShifts, setSpecialNeedsShifts] = useState([]);
  const [inputChecked, setInputChecked] = useState(1);
  const [chosenMonth, setChosenMonth] = useState();

  const isValid = (field) => {
    if (field === undefined || field === null) return false;
    return true;
  };

  useEffect(() => {
    setLoading(true);
    getNurses();
  }, []);

  const checkOverlap = (nurse, dateFrom, dateUntil, parentArray) => {
    if (parentArray === "mws") {
      for (let i = 0; i < nursesAndDays.length; i++) {
        var n = nursesAndDays[i];
        if (n.NurseID === nurse) {
          if (
            dateFrom === n.DateFrom ||
            dateFrom === n.DateUntil ||
            dateUntil === n.DateFrom ||
            dateUntil === n.DateUntil
          )
            return true;
          if (dateFrom < n.DateFrom && dateUntil > n.DateFrom) return true;
          if (dateFrom > n.DateFrom && dateFrom < n.DateUntil) return true;
        }
      }
    } else if (parentArray === "nwd") {
      for (let i = 0; i < mustWorkShifts.length; i++) {
        var n = mustWorkShifts[i];
        if (n.NurseID === nurse) {
          if (
            dateFrom === n.DateFrom ||
            dateFrom === n.DateUntil ||
            dateUntil === n.DateFrom ||
            dateUntil === n.DateUntil
          )
            return true;
          if (dateFrom < n.DateFrom && dateUntil > n.DateFrom) return true;
          if (dateFrom > n.DateFrom && dateFrom < n.DateUntil) return true;
        }
      }
    }
    return false;
  };
  const getNurses = async () => {
    var res = await services.GetNursesForSelect();

    if (res === undefined) {
      setAlert({
        success: false,
        message: "Greška pri učitavanju",
      });
      return;
    }

    if (res.status === 200) {
      res.json().then((response) => {
        setNurseArr(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju",
      });
    }
  };
  const handleMustWorkSubmit = async (shift) => {
    var m = mustWorkShifts;
    m.push({
      NurseID: nurse.id,
      NurseName: nurse.label,
      DateFrom: dateRange.date_from,
      DateUntil: dateRange.date_until,
      ShiftID: parseInt(shift),
    });
    setMustWorkShifts([...m]);

    setNurse();
    clearCheckedDates();
  };
  const handleSpecialNeedsShifts = async (shift, n) => {
    var s = specialNeedsShifts;
    for (let i = dateRange.date_from; i <= dateRange.date_until; i++) {
      if (shift === "all") {
        for (let j = 1; j <= 3; j++) {
          s.push({
            Day: i,
            ShiftID: j,
            NumberOfNurses: n,
          });
        }
      } else {
        for (let j = 0; j < shift.length; j++) {
          if (shift[j]) {
            s.push({
              Day: i,
              ShiftID: j + 1,
              NumberOfNurses: n,
            });
          }
        }
      }
    }

    setSpecialNeedsShifts([...s]);
    clearCheckedDates();
  };
  const deleteNurseDay = (e) => {
    e.preventDefault();
    var id = e.target.id;
    if (id === undefined || id === null || id === "") {
      id = e.target.parentNode.id;
    }
    var n = nursesAndDays;
    var c = 0;
    for (let i = 0; i < n.length; i++) {
      if (`${n[i].NurseID}` === id.substring(1, id.indexOf(","))) {
        if (`${c}` === id.substring(id.indexOf(",") + 1, id.indexOf("]"))) {
          n.splice(i, 1);
          break;
        }
        c++;
      }
    }
    setNursesAndDays([...n]);
  };
  const clearCheckedDates = (e = undefined) => {
    if (e !== undefined) e.preventDefault();
    var d = calendarDays;
    d.forEach((day) => {
      day.checked = false;
    });
    setCalendarDays([...d]);
    setDateRange(undefined);
  };
  const formatForSending = () => {
    var data = [];
    var daysData = [];
    var shiftsData = [];

    nursesAndDays.forEach((nd) => {
      if (nd.Shifts === "all") {
        daysData.push({
          DateFrom: nd.DateFrom,
          DateUntil: nd.DateUntil,
          NurseID: nd.NurseID,
          DayType: nd.DayType,
          IsMandatory: nd.IsMandatory,
        });
      } else {
        shiftsData.push({
          DateFrom: nd.DateFrom,
          DateUntil: nd.DateUntil,
          NurseID: nd.NurseID,
          Shifts: nd.Shifts,
          IsMandatory: nd.IsMandatory,
        });
      }
    });
    data = {
      schedule: {
        Name: name,
        Month: chosenMonth.id + 1,
      },
      days: daysData,
      shifts: shiftsData,
      mustWork: mustWorkShifts,
      specialNeeds: specialNeedsShifts,
    };
    return data;
  };
  const handleSave = async (e) => {
    if (!isValid(name)) {
      setAlert({
        success: false,
        message: "Nije unet naziv",
      });
      return;
    }

    var res = await services.TryNewSchedule(name, formatForSending());

    if (res === undefined) {
      setAlert({
        success: false,
        message: "Nije uspelo",
      });
    }

    if (res.status === 200) {
      setAlert({
        success: true,
        message: "Uspelo, uskoro izveštaj",
      });
    } else {
      setAlert({
        success: false,
        message: "Nije uspelo",
      });
    }
  };
  return (
    <>
      {alert !== undefined && alert !== null ? (
        <Notification
          success={alert.success}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="CreateSchedule">
          <h1>Kreiranje rasporeda</h1>
          <div className="DataInputPickerWrapper">
            <ul className="DataInputPicker">
              <li
                id={1}
                className={inputChecked === 1 ? "checked" : ""}
                onClick={(e) => setInputChecked(1)}
              >
                Slobodni dani i odmori
              </li>
              <li
                id={2}
                className={inputChecked === 2 ? "checked" : ""}
                onClick={(e) => setInputChecked(2)}
              >
                Obavezne smene
              </li>
              <li
                id={3}
                className={inputChecked === 3 ? "checked" : ""}
                onClick={(e) => setInputChecked(3)}
              >
                Posebni zahtevi
              </li>
            </ul>
          </div>
          <div className="DataInput">
            {inputChecked === 1 ? (
              <NonWorkingDays
                nurseArr={nurseArr}
                nurse={nurse}
                setNurse={setNurse}
                dateRange={dateRange}
                setDateRange={setDateRange}
                nursesAndDays={nursesAndDays}
                setNursesAndDays={setNursesAndDays}
                clearCheckedDates={clearCheckedDates}
                isMandatory={isMandatory}
                setIsMandatory={setIsMandatory}
                checkOverlap={checkOverlap}
              />
            ) : inputChecked === 2 ? (
              <MustWorkShifts
                nurseArr={nurseArr}
                nurse={nurse}
                setNurse={setNurse}
                dateRange={dateRange}
                handleMustWorkSubmit={handleMustWorkSubmit}
                clearCheckedDates={clearCheckedDates}
                checkOverlap={checkOverlap}
              />
            ) : inputChecked === 3 ? (
              <SpecialNeedsShifts
                handleSpecialNeedsShifts={handleSpecialNeedsShifts}
                dateRange={dateRange}
                clearCheckedDates={clearCheckedDates}
              />
            ) : null}
          </div>
          <Calendar
            dateRange={dateRange}
            setDateRange={setDateRange}
            calendarDays={calendarDays}
            setCalendarDays={setCalendarDays}
            clearCheckedDates={clearCheckedDates}
            isMandatory={isMandatory}
            chosenMonth={chosenMonth}
            setChosenMonth={setChosenMonth}
          />
          <div className="Tables">
            <h2>Kontrolne tabele</h2>
            <NonWorkingTable
              nursesAndDays={nursesAndDays}
              deleteNurseDay={deleteNurseDay}
            />
            <MustWorkTable
              mustWorkShifts={mustWorkShifts}
              setMustWorkShifts={setMustWorkShifts}
            />
            <SpecialNeedsShiftsTable
              specialNeedsShifts={specialNeedsShifts}
              setSpecialNeedsShifts={setSpecialNeedsShifts}
            />
          </div>
          <div className="name-submit">
            <TextField
              id="standard-basic"
              label="Naziv izveštaja"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="MyButton" onClick={(e) => handleSave(e)}>
              Potvrdi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
