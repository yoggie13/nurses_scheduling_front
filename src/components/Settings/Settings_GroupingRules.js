import {
  DeleteForeverOutlined,
  ExpandCircleDownOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import functions from "../../services/functions";
import services from "../../services/services";
import settings_functions from "../../services/settings_functions";
import AutoCompleteComponent from "../AutoCompleteComponent";
import Loading from "../Loading";
import Modal from "../Modal";
import Notification from "../Notification";

export default function Settings_GroupingRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState();
  const [ruleSelected, setRuleSelected] = useState();
  const [nursesForRule, setNursesForRule] = useState([]);
  const [modal, setModal] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [nurse, setNurse] = useState();
  const [rulesToChange, setRulesToChange] = useState([]);

  useEffect(() => {
    setLoading(true);
    getRules();
  }, []);

  const getRules = async () => {
    var res = await services.GetGroupingRules();

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
  const getNursesForRule = async (id) => {
    var res = await services.GetNursesGroupingRules(id);

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
  const handleExpand = async (id) => {
    setLoading(true);
    if (id === ruleSelected) {
      setRuleSelected();
      setLoading(false);
      return;
    } else setRuleSelected(id);

    getNursesForRule(id);
  };
  const removeNurseFromRule = async (grID, nID) => {
    setLoading(true);

    var res = await services.DeleteNurseFromGroupingRule(grID, nID);

    if (res !== undefined && res.status === 200) {
      setAlert({
        success: true,
        message: "Uspešno sklonjeno pravilo za sestru",
      });
      getNursesForRule(grID);
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
  const handleAddNurse = async () => {
    setLoading(true);
    getNurses();
    setModal(true);
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

    var res = await services.AddNurseToGroupingRule(ruleSelected, nurse.id);

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
  const handleDelete = async (id) => {
    setLoading(true);
    var res = await services.DeleteGroupingRule(id);

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
  // const handleNameChange = (e, index) => {
  //   var n = rules;
  //   n[index].Name = e.target.value;

  //   setRules([...n]);

  //   addRulesToChange(index);
  // };
  // const handleDurationChange = (e, index) => {
  //   if (e.target.value !== "" && !/^[0-9]+$/.test(e.target.value)) return;

  //   var n = rules;
  //   n[index].Duration = e.target.value;

  //   setRules([...n]);

  //   addRulesToChange(index);
  // };
  // const handleMaxChange = (e, index) => {
  //   if (e.target.value !== "" && !/^[0-9]+$/.test(e.target.value)) return;

  //   var n = rules;
  //   n[index].Max = e.target.value;

  //   setRules([...n]);

  //   addRulesToChange(index);
  // };
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
        if (!functions.isValidTextField(rules[rulesToChange[i]].Max)) {
          setAlert({
            success: false,
            message: "Dozvoljen broj ne može biti prazan",
          });
          setLoading(false);
          return;
        }
        editData.push(rules[rulesToChange[i]]);
      }

      var res = await services.EditGroupingRules(editData);
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
          {rules.map((grule, index) => (
            <div key={index}>
              <div className="SettingsRow">
                <TextField
                  className="RuleName"
                  value={grule.Name}
                  onChange={(e) =>
                    settings_functions.updateTextState(
                      rules,
                      setRules,
                      e.target.value,
                      index,
                      addRulesToChange,
                      "Name"
                    )
                  }
                  label="Naziv"
                />
                <TextField
                  className="RuleNumber"
                  value={grule.Max}
                  onChange={(e) =>
                    settings_functions.updateNumbersState(
                      rules,
                      setRules,
                      e.target.value,
                      index,
                      addRulesToChange,
                      "Max"
                    )
                  }
                  label="Dozvoljen broj"
                />
                <TextField
                  className="RuleNumber"
                  value={grule.Duration}
                  onChange={(e) =>
                    settings_functions.updateNumbersState(
                      rules,
                      setRules,
                      e.target.value,
                      index,
                      addRulesToChange,
                      "Duration"
                    )
                  }
                  label="U koliko dana"
                />
                <ExpandCircleDownOutlined
                  onClick={(e) => handleExpand(grule.GroupingRuleID)}
                  id={ruleSelected === grule.GroupingRuleID ? "up" : "down"}
                />
                <DeleteForeverOutlined
                  onClick={(e) => handleDelete(grule.GroupingRuleID)}
                />
              </div>
              <div
                className="GroupingRuleNursesArray"
                id={ruleSelected === grule.GroupingRuleID ? "show" : "hidden"}
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
                            grule.GroupingRuleID,
                            nurse.NurseID
                          )
                        }
                      />
                    </p>
                  </div>
                ))}
                <button
                  className="MyButton"
                  onClick={(e) => handleAddNurse(grule.GroupingRuleID)}
                >
                  Dodaj sestru
                </button>
              </div>
            </div>
          ))}
          <button
            className="MyButton"
            disabled={functions.isEmptyArray(rulesToChange)}
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
