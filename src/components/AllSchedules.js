import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../assets/styles/AllSchedules.css'
import services from '../services/services';
import Loading from './Loading';
import Notification from './Notification';

export default function AllSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState();

    useEffect(() => {
        setLoading(true);
        getSchedules();
    }, [])

    const getSchedules = async () => {

        var res = await services.GetSchedules();

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((response) => {
                    setSchedules(response);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                success: false,
                message: "Greška pri čitanju iz baze"
            });
            setLoading(false);
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
                    : <div className='AllSchedules'>
                        <h1>Svi izveštaji</h1>
                        <table className='AllSchedulesTable'>
                            <thead>
                                <th>Rb</th>
                                <th>Naziv</th>
                                <th>Datum generisanja</th>
                                <th>Procenat ispunjenosti zahteva</th>
                                <th>Odabran</th>
                                <th>Link</th>
                            </thead>
                            <tbody>
                                {
                                    schedules.map((schedule, index) => <tr key={index}>
                                        <td>{`${index + 1}.`}</td>
                                        <td>{schedule.Name}</td>
                                        <td>{schedule.GeneratedOn}</td>
                                        <td>{schedule.Percentage}</td>
                                        <td>{schedule.Chosen}</td>
                                        <td>
                                            <Link to={`/rasporedi/${schedule.ScheduleID}`}>
                                                <ArrowForwardIosIcon />
                                            </Link>
                                        </td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div >
            }
        </>
    )
}
