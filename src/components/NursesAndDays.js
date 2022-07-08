import React from 'react'
import '../assets/styles/NursesAndDays.css'
import { DeleteForeverRounded } from '@mui/icons-material';

export default function NursesAndDays({ nursesAndDays, deleteNurseDay }) {
    const formatNursesAndDays = () => {
        var arr = [];
        nursesAndDays.forEach(nurDay => {
            let found = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].NurseID === nurDay.NurseID) {
                    arr[i].days.push({
                        Date_From: nurDay.Date_From,
                        Date_Until: nurDay.Date_Until,
                        Day_Type_Label: nurDay.Day_Type_Label
                    })
                    found = true;
                    break;
                }
            }
            if (!found) {
                arr.push({
                    NurseID: nurDay.NurseID,
                    Nurse_Name: nurDay.Nurse_Name,
                    days: [{
                        Date_From: nurDay.Date_From,
                        Date_Until: nurDay.Date_Until,
                        Day_Type_Label: nurDay.Day_Type_Label
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
                    formatNursesAndDays().map((nurse) => <><tr key={`[${nurse.NurseID},0]`}>
                        <td rowSpan={nurse.days.length}>{nurse.Nurse_Name}</td>
                        <td>{nurse.days[0].Date_From}</td>
                        <td>{nurse.days[0].Date_Until}</td>
                        <td>{nurse.days[0].Day_Type_Label}</td>
                        <td><DeleteForeverRounded id={`[${nurse.NurseID},0]`} onClick={e => deleteNurseDay(e)} /></td>
                    </tr>
                        {
                            nurse.days.slice(1).map((day, index) => <tr key={`[${nurse.NurseID},${index + 1}]`}>
                                <td>{day.Date_From}</td>
                                <td>{day.Date_Until}</td>
                                <td>{day.Day_Type_Label}</td>
                                <td><DeleteForeverRounded id={`[${nurse.NurseID},${index + 1}]`} onClick={e => deleteNurseDay(e)} /></td>
                            </tr>)
                        }
                    </>)
                }
            </tbody>
        </table >
    )
}
