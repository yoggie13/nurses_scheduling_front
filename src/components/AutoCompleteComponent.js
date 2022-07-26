import React from 'react'
import {
    Autocomplete,
    TextField,
} from '@mui/material'

export default function AutoCompleteComponent({ id, label, value, setValue, menuItems, readOnly = false }) {

    return (
        < div className='AutoCompleteComponent' >
            {
                readOnly
                    ? < Autocomplete
                        id={id}
                        value={null}
                        onChange={(event, newValue) => setValue(newValue)}
                        renderInput={(params) => <TextField {...params} label={label} />}
                        options={menuItems}
                        disablePortal
                        readOnly
                    />
                    : <Autocomplete
                        id={id}
                        value={value}
                        onChange={(event, newValue) => setValue(newValue)}
                        renderInput={(params) => <TextField {...params} label={label} />}
                        options={menuItems}
                        disablePortal
                    />
            }
        </div >
    )
}
