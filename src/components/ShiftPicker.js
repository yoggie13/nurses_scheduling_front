import React from 'react'
import { FormGroup, FormControlLabel } from '@mui/material'
import Switch from '@mui/material/Switch'

export default function ShiftPicker({ shiftPick, setShiftPick }) {
    const handleShifts = (e, i) => {
        var s = shiftPick;
        s[i] = e.target.checked;
        setShiftPick([...s]);
    }
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch
                        checked={shiftPick[0]}
                        onChange={(e) => handleShifts(e, 0)}
                    />
                }
                label="Prva smena" />
            <FormControlLabel
                control={
                    <Switch
                        checked={shiftPick[1]}
                        onChange={(e) => handleShifts(e, 1)}
                    />
                }
                label="Druga smena" />
            <FormControlLabel
                control={
                    <Switch
                        checked={shiftPick[2]}
                        onChange={(e) => handleShifts(e, 2)}
                    />
                }
                label="Treća smena" />
        </FormGroup>
    )
}
