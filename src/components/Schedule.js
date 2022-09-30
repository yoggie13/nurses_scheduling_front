import { FileDownload } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import "../assets/styles/Schedule.css";
import services from "../services/services";
import Loading from "./Loading";
import Notification from "./Notification";

export default function Schedule({ setScheduleName }) {
  const [schedule, setSchedule] = useState();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();
  const [headerState, setHeaderState] = useState([]);
  const [rowsState, setRowsState] = useState([]);
  const weekdays = ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"];

  const location = useLocation().pathname;
  var loc = location.slice(location.lastIndexOf("/") + 1, location.length);

  useEffect(() => {
    setLoading(true);
    getSchedule();
  }, []);
  useEffect(() => {
    if (schedule !== undefined && schedule !== null) {
      generateTableHeader();
      generateRows();
    }
  }, [schedule]);

  const getSchedule = async () => {
    var res = await services.GetSchedule(parseInt(loc));

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setSchedule(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri dovlačenju podataka iz baze",
      });
      setLoading(false);
    }
  };

  const generateTableHeader = () => {
    const headerNumbers = ["Sestre/Datumi"];
    const headerDays = ["Dani u nedelji"];
    for (let i = 1; i <= schedule.NumberOfDays; i++) {
      headerDays.push(
        weekdays[new Date(schedule.Year, schedule.Month - 1, i).getDay()]
      );
      headerNumbers.push(i);
    }

    headerDays.push("Br. sati");
    headerNumbers.push("R", "O", "Uk.");
    setHeaderState([...[headerDays, headerNumbers]]);
  };
  const generateRows = () => {
    const rows = [];

    schedule.NursesAndDays.forEach((nurDay) => {
      var row = [];
      row.push(nurDay.NurseName);
      let j = 1;

      for (let i = 0; i < nurDay.Days.length; i++) {
        if (nurDay.Days[i].Day === j) {
          row.push(nurDay.Days[i].Symbol);
          j++;
          if (i === nurDay.Days.length - 1 && j <= schedule.NumberOfDays) {
            for (let k = j; k <= schedule.NumberOfDays; k++) {
              row.push("");
            }
          }
        } else {
          let k = i === 0 ? 1 : nurDay.Days[i - 1].Day + 1;
          if (i + 1 >= nurDay.Days.length) {
            for (k; k <= schedule.NumberOfDays; k++) {
              if (k === nurDay.Days[i].Day) {
                row.push(nurDay.Days[i].Symbol);
              } else row.push("");
            }
          } else {
            for (k; k < nurDay.Days[i + 1].Day; k++) {
              if (k === nurDay.Days[i].Day) {
                row.push(nurDay.Days[i].Symbol);
              } else row.push("");
            }
            j = k;
          }
        }
      }
      row.push(calculateNumberOfHours(nurDay.Days)[0]);
      row.push(calculateNumberOfHours(nurDay.Days)[1]);
      row.push(calculateNumberOfHours(nurDay.Days)[2]);
      rows.push(row);
    });
    setRowsState([...rows]);
  };
  const calculateNumberOfHours = (days) => {
    var hoursWork = 0;
    var hoursVac = 0;
    days.forEach((day) => {
      if (day.Working) hoursWork += day.Duration;
      else hoursVac += day.Duration;
    });
    return [hoursWork, hoursVac, hoursWork + hoursVac];
  };
  const choseThisSchedule = async () => {
    var res = await services.ChoseSchedule(schedule.ScheduleID);

    if (res !== undefined && res.status === 200) {
      var s = schedule;
      s.Chosen = 1;
      setSchedule(s);
      setAlert({
        success: true,
        message: "Uspešno odabran",
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri odabiru",
      });
    }
  };
  const generateCSV = async () => {
    let csvContent =
      "data:text/csv;charset=unicode," +
      headerState.map((h) => h.join(";")).join("\n") +
      rowsState.map((r) => r.join(";")).join("\n");

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
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
        <div className="Schedule">
          <div className="schedule-header">
            <h1>{schedule.Name}</h1>
            <div className="Buttons">
              <button className="MyButton" onClick={(e) => generateCSV()}>
                Eksportuj
              </button>
              <button
                className="MyButton"
                disabled={schedule.Chosen === 1}
                onClick={(e) => choseThisSchedule()}
              >
                Odaberi
              </button>
            </div>
          </div>
          <table className="ScheduleTable">
            <thead>
              {headerState.map((headerRow) => (
                <tr>
                  {headerRow.map((hrEl) => (
                    <th>{hrEl}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rowsState.map((row) => (
                <tr>
                  {row.map((rowEl) => (
                    <td>{rowEl}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Signature">
            <div className="alignLeft">
              <p>{new Date(Date.now()).toLocaleDateString("sr-rs")}</p>
              <p>Beograd</p>
            </div>
            <div className="alignRight">
              <p>_______________________</p>
              <p style={{ textAlign: "center" }}>Ružica Nikolić</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
