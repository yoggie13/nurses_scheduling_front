import {
  DeleteForeverOutlined,
  ExpandCircleDownOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import services from "../../services/services";
import AutoCompleteComponent from "../AutoCompleteComponent";
import Loading from "../Loading";
import Modal from "../Modal";
import Notification from "../Notification";

export default function Settings_SequenceRules() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();
  const [rules, setRules] = useState([]);
  const [rulesToChange, setRulesToChange] = useState([]);
  const [nursesForRule, setNursesForRule] = useState([]);
  const [ruleSelected, setRuleSelected] = useState();
  const [nurses, setNurses] = useState([]);
  const [nurse, setNurse] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRules();
  }, []);

  const getRules = async () => {
    var res = await services.GetSequenceRules();

    if (res !== undefined && res.status === 200) {
      res.json().then((result) => {
        setRules(result);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri dovlačenju podataka",
      });
    }
  };
  const handleExpand = async (id) => {
    setLoading(true);
    if (id === ruleSelected) {
      setRuleSelected();
      setLoading(false);
      return;
    } else setRuleSelected(id);

    getNursesForRule(id);
  };
  const getNursesForRule = async (id) => {
    var res = await services.GetNursesSequenceRules(id);

    if (res !== undefined && res.status === 200) {
      res.json().then((result) => {
        setNursesForRule(result);
        setLoading(false);
      });
    } else {
      setAlert({
        success: false,
        message: "Greška pri dovlačenju podataka",
      });
      setNursesForRule([]);
      setLoading(false);
    }
  };
  const removeNurseFromRule = async (srID, nID) => {
    setLoading(true);

    var res = await services.DeleteNurseFromSequenceRule(srID, nID);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno sklonjeno pravilo za sestru",
      });
      getNursesForRule(srID);
      setLoading(false);
    } else {
      setAlert({
        success: false,
        message: "Greška pri uklanjanju",
      });
      setLoading(false);
    }
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
  const addNurseToRule = async () => {
    setLoading(true);

    for (let i = 0; i < nursesForRule.length; i++) {
      if (nursesForRule[i].NurseID === nurse.id) {
        setAlert({
          success: false,
          message: "Ta sestra je već dodata na to pravilo",
        });
        setLoading(false);
        return;
      }
    }

    var res = await services.AddNurseToSequenceRule(ruleSelected, nurse.id);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno dodato pravilo za sestru",
      });
      getNursesForRule(ruleSelected);
      setModal(false);
      setLoading(false);
    } else {
      setAlert({
        success: false,
        message: "Greška pri uklanjanju",
      });
      setLoading(false);
    }
  };
  const handleAddNurse = async () => {
    setLoading(true);
    getNurses();
    setModal(true);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    var res = await services.DeleteSequenceRule(id);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno obrisano",
      });
      getRules();
      setLoading(false);
    } else {
      setAlert({
        success: false,
        message: "Greška pri brisanju",
      });
      setLoading(false);
    }
  };
  const handleNameChange = (e, index) => {
    var n = rules;
    n[index].Name = e.target.value;

    setRules([...n]);

    addRulesToChange(index);
  };
  const addRulesToChange = (index) => {
    var n = rulesToChange;
    for (let i = 0; i < n.length; i++) {
      if (n[i] === index) {
        return;
      }
    }
    n.push(index);
    setRulesToChange([...n]);
  };
  const handleSave = async (e) => {
    setLoading(true);

    if (
      rulesToChange !== undefined &&
      rulesToChange !== null &&
      rulesToChange.length > 0
    ) {
      var editData = [];
      for (let i = 0; i < rulesToChange.length; i++) {
        editData.push(rules[rulesToChange[i]]);
      }

      var res = await services.EditSequenceRules(editData);
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
          {rules.map((rule, index) => (
            <div key={index}>
              <div className="SettingsRow">
                <TextField
                  value={rule.Name}
                  className="RuleName"
                  onChange={(e) => handleNameChange(e, index)}
                  label="Naziv"
                />
                <ExpandCircleDownOutlined
                  onClick={(e) => handleExpand(rule.SequenceRuleID)}
                  id={ruleSelected === rule.SequenceRuleID ? "up" : "down"}
                />
                <DeleteForeverOutlined
                  onClick={(e) => handleDelete(rule.SequenceRuleID)}
                />
              </div>
              <div
                className="GroupingRuleNursesArray"
                id={ruleSelected === rule.SequenceRuleID ? "show" : "hidden"}
              >
                <h4>Važi za: </h4>
                {nursesForRule.map((nurse, index) => (
                  <div className="GroupingRuleNurse">
                    <p>{index + 1}</p>
                    <p>{`${nurse.Name} ${nurse.Surname}`}</p>
                    <p>
                      <DeleteForeverOutlined
                        onClick={(e) =>
                          removeNurseFromRule(
                            rule.SequenceRuleID,
                            nurse.NurseID
                          )
                        }
                      />
                    </p>
                  </div>
                ))}
                <button
                  className="MyButton"
                  onClick={(e) => handleAddNurse(rule.SequenceRuleID)}
                >
                  Dodaj sestru
                </button>
              </div>
            </div>
          ))}
          <button
            className="MyButton"
            disabled={
              rulesToChange === undefined ||
              rulesToChange === null ||
              rulesToChange.length <= 0
            }
            onClick={(e) => handleSave(e)}
          >
            Sačuvaj izmene
          </button>
        </div>
      )}
      {modal ? (
        <Modal
          content={
            <>
              <AutoCompleteComponent
                id="nurse-select"
                label="Sestra/Tehničar"
                value={nurse}
                setValue={setNurse}
                menuItems={nurses}
              />
              <button className="MyButton" onClick={(e) => addNurseToRule()}>
                Sačuvaj
              </button>
            </>
          }
          setModal={setModal}
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
