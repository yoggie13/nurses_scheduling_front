import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material'
import React, { useState } from 'react'
import ShiftPicker from './ShiftPicker'

export default function SpecialNeedsShifts({ handleSpecialNeedsShifts }) {
    const [allShifts, setAllShifts] = useState(true);
    const [shiftPick, setShiftPick] = useState([false, false, false]);
    const [number, setNumber] = useState();

    const handleSubmit = async (e) => {
        await handleSpecialNeedsShifts(allShifts === true ? "all" : shiftPick, parseInt(number));

        setAllShifts(true);
        setShiftPick([false, false, false])
        setNumber("");
    }
    const handleNumberChange = (n) => {
        if (n !== "" && !/^[0-9]+$/.test(n))
            return;

        setNumber(n);
    }

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={allShifts}
                            onChange={(e) => setAllShifts(e.target.checked)}
                        />
                    }
                    label="Sve smene" />
            </FormGroup>
            {
                !allShifts
                    ? <ShiftPicker
                        shiftPick={shiftPick}
                        setShiftPick={setShiftPick}
                    />
                    : null
            }
            <TextField
                label="Broj sestara potrebnih"
                variant="standard"
                value={number}
                onChange={e => handleNumberChange(e.target.value)}
            />
            <button className='MyButton' onClick={e => { handleSubmit(e) }}>Unesi</button>
        </>
    )
}
