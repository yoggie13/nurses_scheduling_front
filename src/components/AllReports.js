import React, { useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../assets/styles/AllReports.css'

export default function AllReports() {
    const [reportsList, setReportsList] = useState([
        {
            id: 0,
            name: 'Jul',
            date: '5.7.2022',
            percentage: '70%'
        },
        {
            id: 1,
            name: 'Jul',
            date: '5.7.2022',
            percentage: '72%'
        }
    ]);

    return (
        <div className='AllReports'>
            <h1>Svi izveštaji</h1>
            <table className='AllReportsTable'>
                <thead>
                    <th>Rb</th>
                    <th>Naziv</th>
                    <th>Datum generisanja</th>
                    <th>Procenat ispunjenosti zahteva</th>
                    <th>Link</th>
                </thead>
                <tbody>
                    {
                        reportsList.map((report, index) => <tr>
                            <td>{`${index + 1}.`}</td>
                            <td>{report.name}</td>
                            <td>{report.date}</td>
                            <td>{report.percentage}</td>
                            <td><ArrowForwardIosIcon /></td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}
