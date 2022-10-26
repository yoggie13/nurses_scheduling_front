import { DeleteForeverRounded } from '@mui/icons-material'
import React from 'react'

export default function MustWorkTable({ nurses, mustWorkShifts, setMustWorkShifts }) {
    const deleteMWS = (e, index) => {
        var mws = mustWorkShifts;
        mws.splice(index, 1);
        setMustWorkShifts([...mws]);
    }
    return (
        <div>
            <h3>Smene kada sestre / tehničari moraju da rade</h3>
            <table className='MustWorkTable'>
                <thead>
                    <tr>
                        <th>Sestra</th>
                        <th>Datum od</th>
                        <th>Datum do</th>
                        <th>Smena</th>
                        <th>Izbrisati</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        mustWorkShifts.map((mws, index) => <tr key={index}>
                            <td>{mws.NurseName}</td>
                            <td>{mws.DateFrom}.</td>
                            <td>{mws.DateUntil}.</td>
                            <td>{mws.ShiftID}</td>
                            <td><DeleteForeverRounded onClick={e => deleteMWS(e, index)} /></td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}
