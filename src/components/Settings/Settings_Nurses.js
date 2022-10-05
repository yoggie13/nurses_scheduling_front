import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Loading from "../Loading";
import services from "../../services/services";
import { DeleteForeverRounded } from "@mui/icons-material";
import Modal from "../Modal";
import Notification from "../Notification";

export default function Settings_Nurses() {
  const [nurses, setNurses] = useState([]);
  const [nursesToChange, setNursesToChange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [nursesToDelete, setNursesToDelete] = useState();
  const [modal, setModal] = useState();
  const [newNurse, setNewNurse] = useState({
    Name: "",
    Surname: "",
    Experienced: false,
    Main: false,
  });
  const [deleteModal, setDeleteModal] = useState();

  const isValid = (field) => {
    if (field === undefined || field === null) return false;
    return true;
  };

  useEffect(() => {
    setLoading(true);
    getNurses();
  }, []);

  const getNurses = async () => {
    var res = await services.GetNurses();

    if (res !== undefined && res.status === 200) {
      res.json().then((response) => {
        setNurses(response);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri učitavanju",
      });
    }
  };
  const handleNameChange = (e, index) => {
    var n = nurses;
    n[index].Name = e.target.value;

    setNurses([...n]);

    addNurseForChange(index);
  };
  const handleSurnameChange = (e, index) => {
    var n = nurses;
    n[index].Surname = e.target.value;

    setNurses([...n]);

    addNurseForChange(index);
  };
  const handleExperienceChange = (e, index) => {
    var n = nurses;
    n[index].Experienced = e.target.checked ? 1 : 0;

    setNurses([...n]);

    addNurseForChange(index);
  };
  const handleMainChange = (e, index) => {
    var n = nurses;
    n[index].Main = e.target.checked ? 1 : 0;

    setNurses([...n]);

    addNurseForChange(index);
  };
  const handleInDepartmentChange = (e, index) => {
    var n = nurses;
    n[index].InDepartment = e.target.checked ? 1 : 0;

    setNurses([...n]);

    addNurseForChange(index);
  };
  const addNurseForChange = (index) => {
    var n = nursesToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setNursesToChange([...n]);
  };
  const handleCallDelete = (e, index) => {
    setNursesToDelete(nurses[index].NurseID);
    console.log(nurses[index].NurseID);
    setDeleteModal(true);
  };
  const handleDelete = async () => {
    setLoading(true);
    var res = await services.DeleteNurses(nursesToDelete);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno obrisana sestra",
      });
      await getNurses();
      setLoading(false);
      setDeleteModal(false);
    } else {
      setAlert({
        success: false,
        message: "Greška pri brisanju",
      });
      setLoading(false);
      setDeleteModal(false);
    }
  };

  const handleSave = async (e) => {
    setLoading(true);

    if (
      nursesToChange !== undefined &&
      nursesToChange !== null &&
      nursesToChange.length > 0
    ) {
      var editData = [];
      nursesToChange.forEach((nurse) => {
        editData.push(nurses[nurse]);
      });

      var res = await services.EditNurses(editData);
      if (res !== undefined && res.status === 200) {
        setAlert({
          success: true,
          message: "Uspešno sačuvane izmene",
        });
      } else {
        setAlert({
          success: false,
          message: "Greška pri čuvanju izmena",
        });
      }
    }

    if (
      nursesToDelete !== undefined &&
      nursesToDelete !== null &&
      nursesToDelete.length > 0
    ) {
      var ret = await services.DeleteNurses(nursesToDelete);
      if (ret !== undefined && ret.status === 200) {
        setAlert({
          success: true,
          message: "Uspešno izbrisane sestre",
        });
        setLoading(false);
      } else {
        setAlert({
          success: false,
          message: "Greška pri brisanju",
        });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  const addNurse = async () => {
    setLoading(true);

    if (!isValid(newNurse.Name) || !isValid(newNurse.Surname)) {
      setAlert({
        success: false,
        message: "Polja nisu popunjena kako treba",
      });
      setLoading(false);
      return;
    } else {
      var res = await services.AddNurse(newNurse);
      if (res !== undefined && res.status === 200) {
        setAlert({
          success: true,
          message: "Uspešno dodato",
        });
        setNewNurse({
          Name: "",
          Surname: "",
          Experienced: false,
        });
        setModal(false);
        getNurses();
      } else {
        setAlert({
          success: false,
          message: "Greška pri čuvanju",
        });
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
          {nurses.map((nurse, index) => (
            <div className="SettingsRow" key={nurse.NurseID}>
              <TextField
                value={nurse.Name}
                onChange={(e) => handleNameChange(e, index)}
                label="Ime"
              />
              <TextField
                value={nurse.Surname}
                onChange={(e) => handleSurnameChange(e, index)}
                label="Prezime"
              />

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nurse.Experienced === 1 ? true : false}
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  }
                  label="Iskusna"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nurse.Main === 1 ? true : false}
                      onChange={(e) => handleMainChange(e, index)}
                    />
                  }
                  label="Glavna"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nurse.InDepartment === 1 ? true : false}
                      onChange={(e) => handleInDepartmentChange(e, index)}
                    />
                  }
                  label="Na odeljenju"
                />
              </FormGroup>
              <DeleteForeverRounded
                onClick={(e) => handleCallDelete(e, index)}
              />
            </div>
          ))}
          <div className="NursesFooter">
            <button className="MyButton" onClick={(e) => setModal(true)}>
              Dodaj setru
            </button>
            <button
              className="MyButton"
              disabled={
                (nursesToChange === undefined ||
                  nursesToChange === null ||
                  nursesToChange.length <= 0) &&
                (nursesToDelete === undefined ||
                  nursesToDelete === null ||
                  nursesToDelete.length <= 0)
              }
              onClick={(e) => handleSave(e)}
            >
              Sačuvaj izmene
            </button>
          </div>
        </div>
      )}
      {modal ? (
        <Modal
          content={
            <>
              <TextField
                label="Ime"
                value={newNurse.Name}
                onChange={(e) =>
                  setNewNurse({ ...newNurse, Name: e.target.value })
                }
              />
              <TextField
                label="Prezime"
                value={newNurse.Surname}
                onChange={(e) =>
                  setNewNurse({ ...newNurse, Surname: e.target.value })
                }
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newNurse.Experienced}
                      onChange={(e) =>
                        setNewNurse({
                          ...newNurse,
                          Experienced: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Iskusna"
                />
              </FormGroup>
              <button className="MyButton" onClick={(e) => addNurse()}>
                Sačuvaj
              </button>
            </>
          }
          setModal={setModal}
        />
      ) : null}
      {deleteModal ? (
        <Modal
          content={
            <>
              <h3>Da li ste sigurni da želite da izbrišete ovu sestru?</h3>
              <div className="Buttons">
                <button
                  className="MyButton"
                  onClick={(e) => setDeleteModal(false)}
                >
                  Ne
                </button>
                <button className="MyButton" onClick={(e) => handleDelete()}>
                  Da
                </button>
              </div>
            </>
          }
          setModal={setDeleteModal}
        />
      ) : null}
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
