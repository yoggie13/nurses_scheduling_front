import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import "../assets/styles/AllSchedules.css";
import services from "../services/services";
import Loading from "./Loading";
import Notification from "./Notification";

export default function AllSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();

  useEffect(() => {
    setLoading(true);
    getSchedules();
  }, []);
  // useEffect(() => {
  //   if (schedules !== undefined && schedules !== null) checkForTodaysReport();
  // }, [schedules]);

  // const checkForTodaysReport = async () => {
  //   var found = false;
  //   for (let i = 0; i < schedules.length; i++) {
  //     if (
  //       schedules[i].IsGenerated === 0 &&
  //       new Date(schedules[i].GeneratedOn).toLocaleDateString("sr-rs") ===
  //         new Date().toLocaleDateString("sr-rs")
  //     ) {
  //       found = true;
  //       break;
  //     }
  //   }
  //   if (found) {
  //     var intervalID = setInterval(async () => {
  //       await getSchedules();
  //     }, 60000);
  //     setTimeout(() => {
  //       clearInterval(intervalID);
  //     }, 600000);
  //   }
  // };

  const getSchedules = async () => {
    var res = await services.GetSchedules();

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setSchedules(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri čitanju iz baze",
      });
      setLoading(false);
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
        <div className="AllSchedules">
          <h1>Svi izveštaji</h1>
          <table className="AllSchedulesTable">
            <thead>
              <tr>
                <th>Rb</th>
                <th>Naziv</th>
                <th>Datum generisanja</th>
                <th>Generisan</th>
                <th>Odabran</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={index}>
                  <td>{`${index + 1}.`}</td>
                  <td>{schedule.NAME}</td>
                  <td>
                    {new Date(schedule.GeneratedOn).toLocaleDateString("sr-RS")}
                  </td>
                  <td>
                    {schedule.IsGenerated > 0 ? (
                      <CheckCircleIcon sx={{ color: "#00FF00" }} />
                    ) : (
                      <CancelRoundedIcon sx={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {schedule.Chosen === 1 ? (
                      <CheckCircleIcon sx={{ color: "#00FF00" }} />
                    ) : (
                      <CancelRoundedIcon sx={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Link to={`/rasporedi/${schedule.ScheduleID}`}>
                      <ArrowForwardIosIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
