import React, { useState } from 'react'
import '../assets/styles/CreateReport.css'
import AutoCompleteComponent from './AutoCompleteComponent';
import Calendar from './Calendar';
import NursesAndDays from './NursesAndDays';

export default function CreateReport() {
    const [nurse, setNurse] = useState();
    const [nurseArr, setNurseArr] = useState([
        {
            id: 1,
            label: "Marina Marinic"
        },
        {
            id: 2,
            label: "Milica Milicic"
        }
    ]);
    const [day, setDay] = useState();
    const [dayArr, setDayArr] = useState(
        [
            {
                id: 1,
                label: "Godisnji odmor"
            },
            {
                id: 2,
                label: "Slobodan dan"
            },
            {
                id: 3,
                label: "Plaćeni slobodan dan"
            }
        ]
    );
    const [paidDayType, setPaidDayType] = useState();
    const [paidDayTypeArr, setPaidDayTypeArr] = useState(
        [
            {
                id: 1,
                label: "8. mart"
            },
            {
                id: 2,
                label: "Bonus"
            }
        ]
    );
    const [dateRange, setDateRange] = useState();
    const [nursesAndDays, setNursesAndDays] = useState([
        {
            id: 1,
            nurse_id: 1,
            nurse_name: "Marina Marinic",
            date_from: "1.7.2022",
            date_until: "3.7.2022",
            day_type_id: 2,
            day_type: "Slobodan dan"
        },
        {
            id: 2,
            nurse_id: 1,
            nurse_name: "Marina Marinic",
            date_from: "4.7.2022",
            date_until: "5.7.2022",
            day_type_id: 2,
            day_type: "Slobodan dan"
        },
        {
            id: 2,
            nurse_id: 2,
            nurse_name: "Milica Milicic",
            date_from: "10.7.2022",
            date_until: "10.7.2022",
            day_type_id: 2,
            day_type: "Slobodan dan"
        }
    ])

    const handleSubmit = (e) => {
        e.preventDefault();
    }


    return (
        <div className='CreateReport'>
            <h1>Kreiranja rasporeda</h1>
            <div className='DataInput'>
                <AutoCompleteComponent
                    id='nurse-select'
                    label="Sestra/Tehničar"
                    value={nurse}
                    setValue={setNurse}
                    menuItems={nurseArr}
                />
                <AutoCompleteComponent
                    id='day-select'
                    label="Tip dana"
                    value={day}
                    setValue={setDay}
                    menuItems={dayArr}
                />
                <AutoCompleteComponent
                    id='pait-day-type-select'
                    label="Tip plaćenog dana"
                    value={paidDayType}
                    setValue={setPaidDayType}
                    menuItems={paidDayTypeArr}
                />
                <button onClick={e => { handleSubmit(e) }}>Unesi</button>
            </div>
            <Calendar
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
            <NursesAndDays
                nursesAndDays={nursesAndDays}
            />

        </div >
    )
}
