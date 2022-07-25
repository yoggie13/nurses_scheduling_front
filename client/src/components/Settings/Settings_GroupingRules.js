import { DeleteForeverOutlined, ExpandCircleDownOutlined } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import services from '../../services/services';
import AutoCompleteComponent from '../AutoCompleteComponent';
import Loading from '../Loading';
import Modal from '../Modal';

export default function Settings_GroupingRules() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState();
    const [ruleSelected, setRuleSelected] = useState();
    const [nursesForRule, setNursesForRule] = useState([]);
    const [modal, setModal] = useState(false);
    const [nurses, setNurses] = useState([]);
    const [nurse, setNurse] = useState();

    useEffect(() => {
        setLoading(true);
        getRules();
    }, [])

    const getRules = async () => {
        var res = await services.GetGroupingRules();

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((result) => {
                    setRules(result);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri dovlačenju podataka"
            });
        }
    }
    const getNursesForRule = async (id) => {
        var res = await services.GetNursesGroupingRules(id);

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((result) => {
                    setNursesForRule(result);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri dovlačenju podataka"
            });
            setNursesForRule([]);
            setLoading(false);
        }
    }
    const handleExpand = async (id) => {
        setLoading(true);
        if (id === ruleSelected) {
            setRuleSelected();
            setLoading(false);
            return;
        }
        else
            setRuleSelected(id);

        getNursesForRule(id);

    }
    const removeNurseFromRule = async (grID, nID) => {
        setLoading(true);

        var res = await services.DeleteNurseFromGroupingRule(grID, nID);

        if (res !== undefined && res.status === 200) {
            setAlert({
                success: true,
                message: "Uspešno sklonjeno pravilo za sestru"
            })
            getNursesForRule(grID);
            setLoading(false);
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri uklanjanju"
            })
            setLoading(false);
        }
    }
    const getNurses = async () => {
        var res = await services.GetNursesForSelect();

        if (res === undefined) {
            setAlert({
                success: false,
                message: "Greška pri učitavanju"
            })
            return;
        }

        if (res.status === 200) {
            res.json()
                .then((response) => {
                    setNurses(response);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri učitavanju"
            })
        }
    }
    const handleAddNurse = async (grid) => {
        setLoading(true);
        getNurses();
        setModal(true);
    }
    const addNurseToRule = async () => {
        var res = await services.AddNurseToGroupingRule(ruleSelected, nurse.id);

        if (res !== undefined && res.status === 200) {
            setAlert({
                success: true,
                message: "Uspešno dodato pravilo za sestru"
            })
            getNursesForRule(ruleSelected);
            setModal(false)
            setLoading(false);
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri uklanjanju"
            })
            setLoading(false);
        }
    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='SettingsArray'>
                        {
                            rules.map((grule) => <div>
                                <div className='SettingsRow'>
                                    <TextField
                                        className='RuleName'
                                        value={grule.Name}
                                        label="Naziv"
                                    />
                                    <TextField
                                        className='RuleNumber'
                                        value={grule.Max}
                                        label="Dozvoljen broj"
                                    />
                                    <TextField
                                        className='RuleNumber'
                                        value={grule.Duration}
                                        label="U koliko dana"
                                    />
                                    <ExpandCircleDownOutlined
                                        onClick={e => handleExpand(grule.GroupingRuleID)}
                                        id={ruleSelected === grule.GroupingRuleID ? 'up' : 'down'}
                                    />
                                </div>
                                <div className='GroupingRuleNursesArray' id={ruleSelected === grule.GroupingRuleID ? 'show' : 'hidden'}>
                                    <h4>Važi za: </h4>
                                    {
                                        nursesForRule.map((nurse, index) => <div className='GroupingRuleNurse'>
                                            <p>{index + 1}</p>
                                            <p>{`${nurse.Name} ${nurse.Surname}`}</p>
                                            <p><DeleteForeverOutlined
                                                onClick={e => removeNurseFromRule(grule.GroupingRuleID, nurse.NurseID)}
                                            /></p>
                                        </div>)
                                    }
                                    <button className='MyButton'
                                        onClick={e => handleAddNurse(grule.GroupingRuleID)}>Dodaj sestru</button>
                                </div>
                            </div>)
                        }
                        {
                            modal
                                ? <Modal
                                    content={
                                        <>
                                            <AutoCompleteComponent
                                                id='nurse-select'
                                                label="Sestra/Tehničar"
                                                value={nurse}
                                                setValue={setNurse}
                                                menuItems={nurses}
                                            />
                                            <button className="MyButton" onClick={(e) => addNurseToRule()}>Sačuvaj</button>
                                        </>
                                    }
                                    setModal={setModal}
                                />
                                : null
                        }
                    </div>
            }
        </>
    )
}
