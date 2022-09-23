import React from 'react'
import services from '../../services/services';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Loading from '../Loading';
import Notification from '../Notification';
import { DeleteForeverOutlined } from '@mui/icons-material';

export default function SettingsNWDT() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();
    const [types, setTypes] = useState([]);
    const [typesToChange, setTypesToChange] = useState([]);

    useEffect(() => {
        setLoading(true);
        getTypes();
    }, [])

    const getTypes = async () => {
        var res = await services.GetNWDTypes();

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((result) => {
                    setTypes(result);
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
    const handleNameChange = (e, index) => {
        var t = types;
        t[index].Name = e.target.value;

        setTypes([...t]);

        addTypesToChange(index);
    }
    const handleSymbolChange = (e, index) => {
        var t = types;
        t[index].Symbol = e.target.value;

        setTypes([...t]);

        addTypesToChange(index);
    }
    const addTypesToChange = (index) => {
        var n = typesToChange;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === index) {
                return;
            }
        }
        n.push(index)
        setTypesToChange([...n]);
    }

    const handleSave = async (e) => {
        setLoading(true);

        if (typesToChange !== undefined &&
            typesToChange !== null &&
            typesToChange.length > 0) {

            var editData = [];
            for (let i = 0; i < typesToChange.length; i++) {
                editData.push(types[typesToChange[i]])
            }

            var res = await services.EditNWDTypes(editData);
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
    const handleDelete = async (id) => {
        setLoading(true);
        var res = await services.DeleteNWDTypes(id);

        if (res !== undefined && res.status === 200) {
            setAlert({
                success: true,
                message: "Uspešno obrisano"
            });
            getTypes();
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
    const handleNumberChange = (e, index) => {

        if (e.target.value !== "" && (isNaN(parseFloat(e.target.value)) || /[a-zA-Z]/g.test(e.target.value)))
            return;
        // if (e.target.value !== "" && !/^[0-9]+$/.test(e.target.value))
        //     return;

        var t = types;
        t[index].NumberOfHours = e.target.value;

        setTypes([...t]);

        addTypesToChange(index);
    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='SettingsArray'>
                     {  types.map((type, index) => <div key={index} className='SettingsRow'>
                            <TextField
                                value={type.Name}
                                className="TypeName"
                                onChange={e => handleNameChange(e, index)}
                                label="Naziv"
                            />
                            <TextField
                                value={type.Symbol}
                                className="TypeSymbol"
                                onChange={e => handleSymbolChange(e, index)}
                                label="Simbol"
                            />
                            <TextField
                                value={type.NumberOfHours}
                                className="TypeSymbol"
                                onChange={e => handleNumberChange(e, index)}
                                label="Br. sati"
                            />
                            <DeleteForeverOutlined
                                onClick={e => handleDelete(type.NonWorkingDayTypeID)}
                            />
                        </div>)
                        }
                        <button className='MyButton' disabled={
                            typesToChange === undefined || typesToChange === null || typesToChange.length <= 0
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
