import React, { useEffect, useState } from 'react'
import '../assets/styles/CreateReport.css'
import AutoCompleteComponent from './AutoCompleteComponent';
import { FormControlLabel, FormGroup, TextField } from '@mui/material';
import Switch from '@mui/material/Switch';
import Calendar from './Calendar';
import NursesAndDays from './NursesAndDays';
import Notification from './Notification';
import services from '../services/services';
import Loading from './Loading';
import ShiftPicker from './ShiftPicker';

export default function CreateReport() {
    const [nurse, setNurse] = useState("");
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
    const [day, setDay] = useState("");
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
    const [dateRange, setDateRange] = useState();
    const [nursesAndDays, setNursesAndDays] = useState([])
    const [calendarDays, setCalendarDays] = useState();
    const [alert, setAlert] = useState();
    const [loading, setLoading] = useState();
    const [name, setName] = useState();
    const [isMandatory, setIsMandatory] = useState(true);
    const [allShifts, setAllShifts] = useState(true);
    const [shiftPick, setShiftPick] = useState([false, false, false]);

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
        getDays()
    }, [])

    const getNurses = async () => {
        var res = await services.GetNursesForSelect();

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
    const getDays = async () => {
        var res = await services.GetDaysForSelect();

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
                    setDayArr(response);
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
            if (`${n[i].NurseID}` === id.substring(1, id.indexOf(','))) {
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

        if ((!isValid(nurse)
            || !isValid(dateRange))
            || (allShifts && !isValid(day))
            || (!allShifts && !shiftPick[0] && !shiftPick[1] && !shiftPick[2])) {
            setAlert({
                success: false,
                message: "Nisu popunjeni svi podaci"
            });
            return;
        }
        var nurseDay = {
            id: nursesAndDays.length,
            NurseID: nurse.id,
            Nurse_Name: nurse.label,
            Date_From: dateRange.date_from,
            Date_Until: dateRange.date_until,
            Day_Type: day === undefined ? undefined : day.id,
            Day_Type_Label: day === undefined ? undefined : day.label,
            Shifts: allShifts ? 'all' : shiftPick,
            IsMandatory: isMandatory
        }

        var n = nursesAndDays
        n.push(nurseDay)
        setNursesAndDays([...n])
        setDefault();
    }
    useEffect(() => {
        if (!allShifts)
            setDay(undefined)
    }, [allShifts])
    const setDefault = () => {
        setNurse()
        setDay()
        clearCheckedDates()
        setShiftPick([false, false, false])
        setIsMandatory(true)
        setAllShifts(true)
    }
    const formatBack = (date) => {
        var a = date.split(".")
        var y = a.pop();
        var m = a.pop();
        var d = a.pop();

        return new Date(new Date(Date.parse(`${m}/${d}/${y}`)).setHours(6)).toISOString();
    }
    const formatForSending = () => {
        var n = []
        nursesAndDays.forEach((nd) => {
            n.push({
                Date_From: formatBack(nd.Date_From),
                Date_Until: formatBack(nd.Date_Until),
                NurseID: nd.NurseID,
                Day_Type: nd.Day_Type
            });
        })

        return n;
    }
    const handleSave = async (e) => {

        if (!isValid(name)) {
            setAlert({
                success: false,
                message: "Nije unet naziv"
            })
            return;
        }

        var res = await services.TryNewReport(name, formatForSending());

        if (res === undefined) {
            setAlert({
                success: false,
                message: "Nije uspelo"
            })
        }

        if (res.status === 200) {
            setAlert({
                success: true,
                message: "Uspelo, uskoro izveštaj"
            });
        }
        else {
            setAlert({
                success: false,
                message: "Nije uspelo"
            })
        }
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
                                readOnly={!allShifts}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isMandatory}
                                            onChange={(e) => setIsMandatory(e.target.checked)}
                                        />
                                    }
                                    label="Obavezan" />
                            </FormGroup>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={allShifts}
                                            onChange={(e) => setAllShifts(e.target.checked)}
                                        />
                                    }
                                    label="Sve smene" />
                            </FormGroup>
                            {
                                !allShifts
                                    ? <ShiftPicker
                                        shiftPick={shiftPick}
                                        setShiftPick={setShiftPick}
                                    />
                                    : null
                            }
                            <button className='MyButton' onClick={e => { handleSubmit(e) }}>Unesi</button>
                        </div>
                        <Calendar
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            calendarDays={calendarDays}
                            setCalendarDays={setCalendarDays}
                            clearCheckedDates={clearCheckedDates}
                            isMandatory={isMandatory}
                        />
                        <NursesAndDays
                            nursesAndDays={nursesAndDays}
                            deleteNurseDay={deleteNurseDay}
                        />
                        <div className='name-submit'>
                            <TextField id="standard-basic"
                                label="Naziv izveštaja"
                                variant="standard"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <button className='MyButton' onClick={e => handleSave(e)}>Potvrdi</button>
                        </div>
                    </div >
            }
        </>
    )
}
