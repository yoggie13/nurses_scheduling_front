import React, { useEffect, useState } from 'react'
import '../assets/styles/CreateReport.css'
import AutoCompleteComponent from './AutoCompleteComponent';
import Calendar from './Calendar';
import NursesAndDays from './NursesAndDays';
import Notification from './Notification';
import services from '../services/services';
import Loading from './Loading';

export default function CreateReport() {
    const [nurse, setNurse] = useState();
    const [nurseArr, setNurseArr] = useState([
        {
            id: 0,
            label: "Marina Marinic"
        },
        {
            id: 1,
            label: "Milica Milicic"
        }
    ]);
    const [day, setDay] = useState();
    const [dayArr, setDayArr] = useState(
        [
            {
                id: 0,
                label: "Godisnji odmor"
            },
            {
                id: 1,
                label: "Slobodan dan"
            },
            {
                id: 2,
                label: "Plaćeni slobodan dan"
            }
        ]
    );
    const [paidDayType, setPaidDayType] = useState();
    const [paidDayTypeArr, setPaidDayTypeArr] = useState(
        [
            {
                id: 0,
                label: "8. mart"
            },
            {
                id: 1,
                label: "Bonus"
            }
        ]
    );
    const [dateRange, setDateRange] = useState();
    const [nursesAndDays, setNursesAndDays] = useState([])
    const [calendarDays, setCalendarDays] = useState();
    const [alert, setAlert] = useState();
    const [loading, setLoading] = useState();

    const isValid = (field) => {
        if (field === undefined || field === null)
            return false;
        return true;
    }

    useEffect(() => {
        if (alert !== undefined && alert !== null) {
            setTimeout(() => {
                setAlert(undefined)
            }, 3000)
        }
    }, [alert])

    useEffect(() => {
        setLoading(true)
        getNurses()
    }, [])
    const getNurses = async () => {
        var res = await services.GetNurses();

        if (res === undefined) {
            setAlert({
                success: false,
                message: "Greška pri učitavanju"
            })
            return;
        }

        if (res.status === 200) {
            res.json()
                .then((response) => {
                    setNurseArr(response);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri učitavanju"
            })
        }
    }

    const deleteNurseDay = (e) => {
        e.preventDefault();
        var id = e.target.id;
        if (id === undefined || id === null || id === "") {
            id = e.target.parentNode.id
        }
        var n = nursesAndDays;
        var c = 0;
        for (let i = 0; i < n.length; i++) {
            if (`${n[i].nurse_id}` === id.substring(1, id.indexOf(','))) {
                if (`${c}` === id.substring(id.indexOf(',') + 1, id.indexOf(']'))) {
                    n.splice(i, 1)
                    break;
                }
                c++;
            }
        }
        setNursesAndDays([...n]);
    }
    const clearCheckedDates = (e = undefined) => {
        if (e !== undefined)
            e.preventDefault();
        var d = calendarDays;
        d.forEach(day => {
            day.checked = false;
        });
        setCalendarDays([...d]);
        setDateRange(undefined)
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if ((!isValid(nurse) || !isValid(day) || !isValid(dateRange)) || (day.id === 3 && !isValid(paidDayType))) {
            setAlert({
                success: false,
                message: "Nisu popunjeni svi podaci"
            });
            return;
        }
        var nurseDay = {
            id: nursesAndDays.length,
            nurse_id: nurse.id,
            nurse_name: nurse.label,
            date_from: dateRange.date_from,
            date_until: dateRange.date_until,
            day_type_id: day.id,
            day_type: day.label
        }
        if (nurseDay.day_type_id === 2) {
            nurseDay.paidDayType_id = paidDayType.id;
            nurseDay.day_type = nurseDay.day_type + '/' + paidDayType.label;
        }
        var n = nursesAndDays
        n.push(nurseDay)
        setNursesAndDays([...n])

        setPaidDayType(undefined)
        clearCheckedDates()
    }

    return (
        <>
            {
                alert !== undefined && alert !== null
                    ? <Notification
                        success={alert.success}
                        message={alert.message}
                    />
                    : null
            }
            {
                loading
                    ? <Loading />
                    : <div className='CreateReport'>
                        <h1>Kreiranje rasporeda</h1>
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
                            <button className='MyButton' onClick={e => { handleSubmit(e) }}>Unesi</button>
                        </div>
                        <Calendar
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            calendarDays={calendarDays}
                            setCalendarDays={setCalendarDays}
                            clearCheckedDates={clearCheckedDates}
                        />
                        <NursesAndDays
                            nursesAndDays={nursesAndDays}
                            deleteNurseDay={deleteNurseDay}
                        />
                        <button className='MyButton'>Potvrdi</button>
                    </div >
            }
        </>
    )
}
