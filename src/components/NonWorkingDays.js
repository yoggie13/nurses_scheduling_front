import { FormControlLabel, FormGroup, Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import services from '../services/services';
import AutoCompleteComponent from './AutoCompleteComponent'
import Loading from './Loading';
import ShiftPicker from './ShiftPicker'

export default function NonWorkingDays({ nurse, setNurse, nurseArr, dateRange, setDateRange, nursesAndDays, setNursesAndDays, setAlert, clearCheckedDates, isMandatory, setIsMandatory }) {
    const [day, setDay] = useState("");
    const [dayArr, setDayArr] = useState([]);
    const [allShifts, setAllShifts] = useState(true);
    const [shiftPick, setShiftPick] = useState([false, false, false]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        getDays()
    }, [])

    useEffect(() => {
        if (!allShifts)
            setDay(undefined)
    }, [allShifts])

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
    const isValid = (field) => {
        if (field === undefined || field === null)
            return false;
        return true;
    }
    const setDefault = () => {
        setNurse()
        setDay()
        clearCheckedDates()
        setShiftPick([false, false, false])
        setIsMandatory(true)
        setAllShifts(true)
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
            DateFrom: dateRange.date_from,
            DateUntil: dateRange.date_until,
            DayType: day === undefined ? undefined : day.id,
            Day_Type_Label: day === undefined ? undefined : day.label,
            Shifts: allShifts ? 'all' : shiftPick,
            IsMandatory: isMandatory
        }

        var n = nursesAndDays
        n.push(nurseDay)
        setNursesAndDays([...n])
        setDefault();
    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <><AutoCompleteComponent
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
                    </>
            }
        </>
    )
}
