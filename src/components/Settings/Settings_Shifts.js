import { CheckBox } from '@mui/icons-material';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { useState } from 'react'
import services from '../../services/services';
import Loading from '../Loading';
import Notification from '../Notification';

export default function Settings_Shifts() {
    const [shifts, setShifs] = useState([]);
    const [shiftsToChange, setShifsToChange] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState();

    useEffect(() => {
        setLoading(true);
        getShifts();
    }, [])

    const getShifts = async () => {
        var res = await services.GetShifts();

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((response) => {
                    setShifs(response);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri učitavanju podataka"
            })
        }
    }
    const handleNameChange = (e, index) => {
        var n = shifts;
        n[index].Name = e.target.value;

        setShifs([...n]);

        addShiftsToChange(index);
    }
    const handleSymbolChange = (e, index) => {
        var n = shifts;
        n[index].Symbol = e.target.value;

        setShifs([...n]);

        addShiftsToChange(index);
    }
    const addShiftsToChange = (index) => {
        var n = shiftsToChange;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === index) {
                return;
            }
        }
        n.push(index)
        setShifsToChange([...n]);
    }
    const handleNumberChange = (e, index) => {

        if (e.target.value !== "" && (isNaN(parseFloat(e.target.value)) || /[a-zA-Z]/g.test(e.target.value)))
            return;
        // if (e.target.value !== "" && !/^[0-9]+$/.test(e.target.value))
        //     return;

        var n = shifts;
        n[index].Duration = e.target.value;

        setShifs([...n]);

        addShiftsToChange(index);
    }
    const handleSave = async (e) => {
        setLoading(true);

        if (shiftsToChange !== undefined &&
            shiftsToChange !== null &&
            shiftsToChange.length > 0) {

            debugger;
            var editData = [];
            for (let i = 0; i < shiftsToChange.length; i++) {
                if (shifts[shiftsToChange[i]].Duration === undefined
                    || shifts[shiftsToChange[i]].Duration === null
                    || shifts[shiftsToChange[i]].Duration === "") {
                    setAlert({
                        success: false,
                        message: "Parametar ne može biti prazan"
                    })
                    setLoading(false);
                    return;
                }
                editData.push(shifts[shiftsToChange[i]])
            }

            var res = await services.EditShifts(editData);
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
    const handleIntensityChange = (e, index) => {
        var n = shifts;
        n[index].StrongIntensity = e.target.checked ? 1 : 0;

        setShifs([...n]);

        addShiftsToChange(index);
    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='SettingsArray'>
                        {
                            shifts.map((shift, index) => <div key={index} className='SettingsRow'>
                                <TextField
                                    className='ShiftName'
                                    value={shift.Name}
                                    onChange={(e) => handleNameChange(e, index)}
                                    label='Naziv smene'
                                />
                                <TextField
                                    className='ShiftDuration'
                                    value={shift.Duration}
                                    onChange={(e) => handleNumberChange(e, index)}
                                    label='Trajanje smene'
                                />
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={shift.StrongIntensity === 1 ? true : false}
                                            onChange={(e) => handleIntensityChange(e, index)}
                                        />}
                                        label="Jak intenzitet" />
                                </FormGroup>
                                <TextField
                                    className='ShiftSymbol'
                                    value={shift.Symbol}
                                    onChange={(e) => handleSymbolChange(e, index)}
                                    label='Simbol smene'
                                />
                            </div>)
                        }
                        <button className='MyButton' disabled={
                            shiftsToChange === undefined || shiftsToChange === null || shiftsToChange.length <= 0
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
