import { DeleteForeverRounded } from '@mui/icons-material'
import React from 'react'

export default function SpecialNeedsShiftsTable({ specialNeedsShifts, setSpecialNeedsShifts }) {
    const handleDelete = (e, index) => {
        var sns = specialNeedsShifts;
        sns.splice(index, 1);
        setSpecialNeedsShifts([...sns]);
    }
    return (
        <div>
            <h3>Smene sa posebnim potrebama</h3>
            <table className='SpecialNeedShiftsTable'>
                <thead>
                    <th>Dan</th>
                    <th>Smena</th>
                    <th>Broj sestara</th>
                    <th>Izbrisati</th>
                </thead>
                <tbody>
                    {
                        specialNeedsShifts.map((sns, index) => <tr key={index}>
                            <td>{sns.Day}</td>
                            <td>{sns.ShiftID}</td>
                            <td>{sns.NumberOfNurses}</td>
                            <td><DeleteForeverRounded onClick={e => handleDelete(e, index)} /></td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}
