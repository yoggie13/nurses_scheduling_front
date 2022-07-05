import React from 'react'
import '../assets/styles/NursesAndDays.css'
import { DeleteForeverRounded } from '@mui/icons-material';

export default function NursesAndDays({ nursesAndDays, deleteNurseDay }) {
    const formatNursesAndDays = () => {
        var arr = [];
        nursesAndDays.forEach(nurDay => {
            let found = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].nurse_id === nurDay.nurse_id) {
                    arr[i].days.push({
                        date_from: nurDay.date_from,
                        date_until: nurDay.date_until,
                        day_type: nurDay.day_type
                    })
                    found = true;
                    break;
                }
            }
            if (!found) {
                arr.push({
                    nurse_id: nurDay.nurse_id,
                    nurse_name: nurDay.nurse_name,
                    days: [{
                        date_from: nurDay.date_from,
                        date_until: nurDay.date_until,
                        day_type: nurDay.day_type
                    }]
                })
            }
        });
        return arr;
    }
    return (
        <table className='NursesAndDays'>
            <thead>
                <tr>
                    <th>Sestra</th>
                    <th>Datum od</th>
                    <th>Datum do</th>
                    <th>Tip</th>
                    <th>Izbrisati</th>
                </tr>
            </thead>
            <tbody>
                {
                    formatNursesAndDays().map((nurse) => <><tr key={`[${nurse.nurse_id},0]`}>
                        <td rowSpan={nurse.days.length}>{nurse.nurse_name}</td>
                        <td>{nurse.days[0].date_from}</td>
                        <td>{nurse.days[0].date_until}</td>
                        <td>{nurse.days[0].day_type}</td>
                        <td><DeleteForeverRounded id={`[${nurse.nurse_id},0]`} onClick={e => deleteNurseDay(e)} /></td>
                    </tr>
                        {
                            nurse.days.slice(1).map((day, index) => <tr key={`[${nurse.nurse_id},${index + 1}]`}>
                                <td>{day.date_from}</td>
                                <td>{day.date_until}</td>
                                <td>{day.day_type}</td>
                                <td><DeleteForeverRounded id={`[${nurse.nurse_id},${index + 1}]`} onClick={e => deleteNurseDay(e)} /></td>
                            </tr>)
                        }
                    </>)
                }
            </tbody>
        </table >
    )
}
