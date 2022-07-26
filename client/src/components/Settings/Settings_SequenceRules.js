import { DeleteForeverOutlined } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import services from '../../services/services';
import Loading from '../Loading';
import Notification from '../Notification';

export default function Settings_SequenceRules() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();
    const [rules, setRules] = useState([]);
    const [rulesToChange, setRulesToChange] = useState([]);

    useEffect(() => {
        setLoading(true);
        getRules();
    }, [])

    const getRules = async () => {
        var res = await services.GetSequenceRules();

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
    const handleDelete = async (id) => {
        setLoading(true);
        var res = await services.DeleteSequenceRule(id);

        if (res !== undefined && res.status === 200) {
            setAlert({
                success: true,
                message: "Uspešno obrisano"
            });
            getRules();
            setLoading(false);
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri brisanju"
            });
            setLoading(false);
        }
    }
    const handleNameChange = (e, index) => {
        var n = rules;
        n[index].Name = e.target.value;

        setRules([...n]);

        addRulesToChange(index);
    }
    const addRulesToChange = (index) => {
        var n = rulesToChange;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === index) {
                return;
            }
        }
        n.push(index)
        setRulesToChange([...n]);
    }
    const handleSave = async (e) => {
        setLoading(true);

        if (rulesToChange !== undefined &&
            rulesToChange !== null &&
            rulesToChange.length > 0) {

            var editData = [];
            for (let i = 0; i < rulesToChange.length; i++) {
                editData.push(rules[rulesToChange[i]])
            }

            var res = await services.EditSequenceRules(editData);
            if (res !== undefined && res.status === 200) {
                setAlert({
                    success: true,
                    message: "Uspešno sačuvane izmene"
                });
                setLoading(false);
            }
            else {
                setAlert({
                    success: false,
                    message: "Greška pri čuvanju izmena"
                })
            }
        }
    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='SettingsArray'>{
                        rules.map((rule, index) => <div key={index} className='SettingsRow'>
                            <TextField
                                value={rule.Name}
                                className="RuleName"
                                onChange={e => handleNameChange(e, index)}
                                label="Naziv"
                            />
                            <DeleteForeverOutlined
                                onClick={e => handleDelete(rule.SequenceRuleID)}
                            />
                        </div>)
                    }
                        <button className='MyButton' disabled={
                            rulesToChange === undefined || rulesToChange === null || rulesToChange.length <= 0
                        }
                            onClick={(e) => handleSave(e)}>Sačuvaj izmene</button>
                    </div>
            }
            {
                alert !== undefined && alert !== null
                    ? <Notification
                        success={alert.success}
                        message={alert.message}
                        setAlert={setAlert}
                    />
                    : null
            }
        </>
    )
}
