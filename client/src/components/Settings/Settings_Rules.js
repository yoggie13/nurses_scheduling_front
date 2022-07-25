import { DeleteForeverOutlined } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import services from '../../services/services';
import Loading from '../Loading';

export default function Settings_Rules() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();
    const [rules, setRules] = useState([]);

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
                            />
                            <DeleteForeverOutlined
                                onClick={e => handleDelete(rule.SequenceRuleID)}
                            />
                        </div>)
                    }
                    </div>
            }
        </>
    )
}
