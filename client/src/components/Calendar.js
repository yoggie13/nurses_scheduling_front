import React, { useEffect, useState } from 'react'
import {
    Box,
    Grid,
    Paper
} from '@mui/material'
import { styled } from '@mui/material/styles';
import AutoCompleteComponent from './AutoCompleteComponent';
import '../assets/styles/Calendar.css'

export default function Calendar({ calendarDays, setCalendarDays, dateRange, setDateRange, clearCheckedDates, isMandatory }) {
    const months = [
        {
            id: 0,
            label: "Januar"
        },
        {
            id: 1,
            label: "Februar"
        },
        {
            id: 2,
            label: "Mart"
        },
        {
            id: 3,
            label: "April"
        },
        {
            id: 4,
            label: "Maj"
        },
        {
            id: 5,
            label: "Jun"
        },
        {
            id: 6,
            label: "Jul"
        },
        {
            id: 7,
            label: "Avgust"
        },
        {
            id: 8,
            label: "Septembar"
        },
        {
            id: 9,
            label: "Oktobar"
        },
        {
            id: 10,
            label: "Novembar"
        },
        {
            id: 10,
            label: "Decembar"
        },
    ]
    const [chosenMonth, setChosenMonth] = useState();

    const getDaysOfTheChosenMonth = () => {
        if (chosenMonth === undefined || chosenMonth === null) return [];
        var date = new Date(new Date(Date.now()).getFullYear(), chosenMonth.id, 1);
        var days = [];
        if (date.getDay() === 0) {
            for (let i = 7; i > 1; i--) {
                days.push({
                    checked: false,
                    date: ""
                })
            }
        }
        else {
            for (let i = date.getDay(); i > 1; i--) {
                days.push({
                    checked: false,
                    date: ""
                })
            }
        }
        while (date.getMonth() === chosenMonth.id) {
            days.push({
                checked: false,
                date: new Date(date).toLocaleDateString("sr-RS")
            });
            date.setDate(date.getDate() + 1);
        }
        return days;
    }
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: "20px",
    }));
    const formatDay = (date) => {
        if (date === "")
            return ""
        return date.substr(0, date.indexOf('.'))
    }
    const handleDateClick = (e) => {
        e.preventDefault();
        var d = calendarDays;
        if (e.target.innerText === "") return;
        d[e.target.id].checked = true;
        var minDate;
        var maxDate;
        var firstReal;
        for (let i = 0; i < d.length; i++) {
            if (firstReal === undefined && d[i].date !== "") {
                firstReal = i - 1;
            }
            if (minDate === undefined && d[i].checked) {
                minDate = i;
            }
            if (maxDate === undefined && d[d.length - i - 1].checked) {
                maxDate = d.length - i - 1;
            }
            if (minDate !== undefined && maxDate !== undefined) {
                for (let i = minDate + 1; i < maxDate; i++) {
                    d[i].checked = true;
                }
                break;
            }
        }
        setCalendarDays([...d]);
        setDateRange({
            date_from: `${minDate - firstReal}.${chosenMonth.id + 1}.${new Date(Date.now()).getFullYear()}`,
            date_until: `${maxDate - firstReal}.${chosenMonth.id + 1}.${new Date(Date.now()).getFullYear()}`
        })
    }

    useEffect(() => {
        setChosenMonth(months[new Date(Date.now()).getMonth()])
    }, [])

    useEffect(() => {
        setCalendarDays(getDaysOfTheChosenMonth())
    }, [chosenMonth])

    return (
        <div className='Calendar'>
            <AutoCompleteComponent
                id='month-select'
                label="Mesec"
                value={chosenMonth}
                setValue={setChosenMonth}
                menuItems={months}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Grid id="calendar-header" container spacing={2} columns={7} >
                    <Grid item xs={1}>
                        <Item>Pon</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Uto</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Sre</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Čet</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Pet</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Sub</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>Ned</Item>
                    </Grid>
                </Grid>
                <Grid container spacing={2} columns={7}>
                    {
                        chosenMonth === undefined || chosenMonth === null
                            ? null
                            : calendarDays.map((day, index) => <Grid item xs={1} id={index} key={index}>
                                <Item
                                    id={index}
                                    className={
                                        day.checked
                                            ? `ItemChecked${isMandatory ? 'Mandatory' : 'Optional'}`
                                            : 'ItemUnchecked'
                                    }
                                    onClick={e => handleDateClick(e)}>
                                    {formatDay(day.date)}
                                </Item>
                            </Grid>)
                    }
                </Grid>
            </Box>
            <button className='MyButton' onClick={e => clearCheckedDates(e)}>Očisti</button>
        </div>
    )
}
