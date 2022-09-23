import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router';
import '../assets/styles/Schedule.css'
import services from '../services/services';
import Loading from './Loading';
import Notification from './Notification';

export default function Schedule({ setScheduleName }) {
    const [schedule, setSchedule] = useState();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState();
    const weekdays = ["Ne","Po","Ut","Sr","Če","Pe","Su"];

    const location = useLocation().pathname;
    var loc = location.slice(location.lastIndexOf('/') + 1, location.length);

    useEffect(() => {
        setLoading(true);
        getSchedule();
    }, [])

    const getSchedule = async () => {
        var res = await services.GetSchedule(parseInt(loc));

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((response) => {
                    setSchedule(response);
                    setLoading(false);
                    setScheduleName(schedule.Name);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri dovlačenju podataka iz baze"
            });
            setLoading(false);
        }
    }

    const generateTableHeader = () => {
        const headerNumbers = []
        const headerDays = [];
        for (let i = 1; i <= schedule.NumberOfDays; i++) {
            headerDays.push(<th key={i}>{weekdays[new Date(schedule.Year, schedule.Month-1, i).getDay()]}</th>)
            headerNumbers.push(<th key={i}>{i}</th>)
        }

        return (<>
            <tr>
            <th rowSpan={2}>Sestra/Tehničar</th>
            {headerDays}
            <th colSpan={3}>Br. sati</th>
            </tr>
            <tr>
            {headerNumbers}
            <th>R</th>
            <th>O</th>
            <th>Uk.</th>
            </tr>
        </>

        );
    }
    const generateRows = () => {
        const rows = [];

        schedule.NursesAndDays.forEach((nurDay) => {
            var row = [];
            row.push(<th key={nurDay.NurseID}>{nurDay.NurseName}</th>)
            let j = 1;

            for (let i = 0; i < nurDay.Days.length; i++) {
                if (nurDay.Days[i].Day === j) {
                    row.push(<td style={{ 'text-align': 'center' }}>{nurDay.Days[i].Symbol}</td>)
                    j++;
                    if (i === nurDay.Days.length - 1 && j <= schedule.NumberOfDays) {
                        for (let k = j; k <= schedule.NumberOfDays; k++) {
                            row.push(<td></td>)
                        }
                    }
                }
                else {
                    let k = i === 0 ? 1 : nurDay.Days[i - 1].Day + 1;
                    if (i + 1 >= nurDay.Days.length) {
                        for (k; k <= schedule.NumberOfDays; k++) {
                            if (k === nurDay.Days[i].Day) {
                                row.push(<td style={{ 'text-align': 'center' }}>{nurDay.Days[i].Symbol}</td>)
                            }
                            else
                                row.push(<td></td>)
                        }
                    } else {
                        for (k; k < nurDay.Days[i + 1].Day; k++) {
                            if (k === nurDay.Days[i].Day) {
                                row.push(<td style={{ 'text-align': 'center' }}>{nurDay.Days[i].Symbol}</td>)
                            }
                            else
                                row.push(<td></td>)
                        }
                        j = k;
                    }
                }
            }
            row.push(<td style={{fontWeight: 'bold'}}>{calculateNumberOfHours(nurDay.Days)[0]}</td>)
            row.push(<td style={{fontWeight: 'bold'}}>{calculateNumberOfHours(nurDay.Days)[1]}</td>)
            row.push(<td style={{fontWeight: 'bold'}}>{calculateNumberOfHours(nurDay.Days)[2]}</td>)
            rows.push(<tr>{row}</tr>)
        })
        return rows;
    }
    const calculateNumberOfHours = (days) => {
        var hoursWork = 0;
        var hoursVac = 0;
        days.forEach((day) => {
            if(day.Working) hoursWork += day.Duration;
            else hoursVac += day.Duration;
        })
        return [hoursWork, hoursVac, hoursWork+hoursVac];
    }
    const choseThisSchedule = async () => {
        var res = await services.ChoseSchedule(schedule.ScheduleID);

        if (res !== undefined && res.status === 200) {
            var s = schedule;
            s.Chosen.data = [1]
            setSchedule(s);
            setAlert({
                success: true,
                message: "Uspešno odabran"
            })
        } else {
            setAlert({
                success: false,
                message: "Greška pri odabiru"
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
                        setAlert={setAlert}
                    />
                    : null
            }
            {
                loading
                    ? <Loading />
                    : <div className='Schedule'>
                        <div className='schedule-header'>
                            <h1>{schedule.Name}</h1>
                            <button className='MyButton'
                                disabled={schedule.Chosen.data[0] === 1}
                                onClick={e => choseThisSchedule()}>Odaberi</button>
                        </div>
                        <table className='ScheduleTable'>
                            <thead>
                                    {generateTableHeader()}
                            </thead>
                            <tbody>
                                {generateRows()}
                            </tbody>
                        </table>
                        <div className='Signature'>
                            <div className='alignLeft'>
                                <p>{new Date(Date.now()).toLocaleDateString('sr-rs')}</p>
                                <p>Beograd</p>
                            </div>
                            <div className='alignRight'>
                                <p>_______________________</p>
                                <p style={{ 'text-align': 'center' }}>Ružica Nikolić</p>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
