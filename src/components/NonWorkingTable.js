import React from 'react'
import '../assets/styles/NursesAndDays.css'
import { DeleteForeverRounded } from '@mui/icons-material';

export default function NonWorkingTable({ nursesAndDays, deleteNurseDay }) {
    const formatDayTypeShifts = (day_type, shifts) => {
        if (shifts === 'all')
            return day_type;

        var s = '';
        for (let i = 0; i < shifts.length; i++) {
            if (shifts[i]) {
                if (s === '')
                    s += `${i + 1}`
                else
                    s += ` / ${i + 1}`
            }
        }
        return s;
    }
    const formatNursesAndDays = () => {
        var arr = [];
        nursesAndDays.forEach(nurDay => {
            let found = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].NurseID === nurDay.NurseID) {
                    arr[i].days.push({
                        DateFrom: nurDay.DateFrom,
                        DateUntil: nurDay.DateUntil,
                        Day_Type_Label: formatDayTypeShifts(nurDay.Day_Type_Label, nurDay.Shifts),
                        IsMandatory: nurDay.IsMandatory ? "Obavezno" : "Opciono"
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
                        DateFrom: nurDay.DateFrom,
                        DateUntil: nurDay.DateUntil,
                        Day_Type_Label: formatDayTypeShifts(nurDay.Day_Type_Label, nurDay.Shifts),
                        IsMandatory: nurDay.IsMandatory ? "Obavezno" : "Opciono"
                    }]
                })
            }
        });
        return arr;
    }
    return (
        <div>
            <h3>Dani / smene kada sestre / tehničari bi voleli / moraju da ne rade</h3>
            <table className='NursesAndDays'>
                <thead>
                    <tr>
                        <th>Sestra</th>
                        <th>Datum od</th>
                        <th>Datum do</th>
                        <th>Tip / Smene</th>
                        <th>Obavezno / Opciono</th>
                        <th>Izbrisati</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formatNursesAndDays().map((nurse) => <><tr key={`[${nurse.NurseID},0]`}>
                            <td rowSpan={nurse.days.length}>{nurse.Nurse_Name}</td>
                            <td>{nurse.days[0].DateFrom}</td>
                            <td>{nurse.days[0].DateUntil}</td>
                            <td>{nurse.days[0].Day_Type_Label}</td>
                            <td>{nurse.days[0].IsMandatory}</td>
                            <td><DeleteForeverRounded id={`[${nurse.NurseID},0]`} onClick={e => deleteNurseDay(e)} /></td>
                        </tr>
                            {
                                nurse.days.slice(1).map((day, index) => <tr key={`[${nurse.NurseID},${index + 1}]`}>
                                    <td>{day.DateFrom}</td>
                                    <td>{day.DateUntil}</td>
                                    <td>{day.Day_Type_Label}</td>
                                    <td>{day.IsMandatory}</td>
                                    <td><DeleteForeverRounded id={`[${nurse.NurseID},${index + 1}]`} onClick={e => deleteNurseDay(e)} /></td>
                                </tr>)
                            }
                        </>)
                    }
                </tbody>
            </table >
        </div>
    )
}
