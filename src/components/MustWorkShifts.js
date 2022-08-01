import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import AutoCompleteComponent from './AutoCompleteComponent'

export default function MustWorkShifts({ nurse, setNurse, nurseArr, handleMustWorkSubmit }) {
    const [shiftChecked, setShiftChecked] = useState();

    const handleSubmit = async (e) => {
        if (nurse !== undefined && nurse !== null && shiftChecked !== undefined && shiftChecked !== null) {
            await handleMustWorkSubmit(shiftChecked);
        }
    }
    return (
        <>
            <AutoCompleteComponent
                id='nurse-select'
                label="Sestra/Tehničar"
                value={nurse}
                setValue={setNurse}
                menuItems={nurseArr}
            />
            <FormControl>
                <FormLabel id='label-id'>Odabir smene</FormLabel>
                <RadioGroup
                    aria-labelledby='label-id'
                    name="radio-buttons-group"
                    value={shiftChecked}
                    onChange={e => setShiftChecked(e.target.value)}
                >
                    <FormControlLabel value={1} control={<Radio />} label="Prva" />
                    <FormControlLabel value={2} control={<Radio />} label="Druga" />
                    <FormControlLabel value={3} control={<Radio />} label="Treća" />
                    <FormControlLabel value={4} control={<Radio />} label="Celodnevna" />
                </RadioGroup>
            </FormControl>
            <button className='MyButton' onClick={e => { handleSubmit(e) }}>Unesi</button>
        </>
    )
}
