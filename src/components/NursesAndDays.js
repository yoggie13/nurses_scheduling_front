import React from 'react'
import '../assets/styles/NursesAndDays.css'

export default function NursesAndDays({ nursesAndDays }) {
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
                </tr>
            </thead>
            <tbody>
                {
                    formatNursesAndDays().map((nurse, index) => <> <tr key={index}>
                        <td rowSpan={nurse.days.length}>{nurse.nurse_name}</td>
                        <td>{nurse.days[0].date_from}</td>
                        <td>{nurse.days[0].date_until}</td>
                        <td>{nurse.days[0].day_type}</td>
                    </tr>
                        {
                            nurse.days.slice(1).map((day, index) => <tr key={index}>
                                <td>{day.date_from}</td>
                                <td>{day.date_until}</td>
                                <td>{day.day_type}</td>
                            </tr>)
                        }
                    </>)
                }
            </tbody>
        </table>
    )
}
