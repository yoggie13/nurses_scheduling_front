import React from 'react'
import { useState } from 'react'
import '../assets/styles/Report.css'

export default function Report() {
    const [report, setReport] = useState({
        id: 0,
        name: "Jul",
        numberOfDays: 31,
        nursesAndDays: [
            {
                nurseID: 0,
                nurseName: "Marina Marinic",
                days: [
                    {
                        day: 1,
                        label: "1"
                    },
                    {
                        day: 2,
                        label: "3"
                    },
                    {
                        day: 4,
                        label: "*"
                    }
                ]
            },
            {
                nurseID: 1,
                nurseName: "Milica Milicic",
                days: [
                    {
                        day: 2,
                        label: "1"
                    },
                    {
                        day: 4,
                        label: "2"
                    },
                    {
                        day: 5,
                        label: "8III"
                    }
                ]
            }
        ]
    })
    const generateTableHeader = () => {
        const header = [<th>Sestra/Tehničar</th>]
        for (let i = 1; i <= report.numberOfDays; i++) {
            header.push(<th key={i}>{i}</th>)
        }

        return header;
    }
    const generateRows = () => {
        const rows = [];

        report.nursesAndDays.forEach((nurDay) => {
            var row = [];
            row.push(<th>{nurDay.nurseName}</th>)
            let j = 1;

            for (let i = 0; i < nurDay.days.length; i++) {
                if (nurDay.days[i].day === j) {
                    row.push(<td>{nurDay.days[i].label}</td>)
                    j++;
                    if (i === nurDay.days.length - 1 && j < report.numberOfDays) {
                        for (let k = j; k <= report.numberOfDays; k++) {
                            row.push(<td></td>)
                        }
                    }
                }
                else {
                    let k = i === 0 ? 1 : nurDay.days[i - 1].day + 1;
                    if (i + 1 >= nurDay.days.length) {
                        for (k; k <= report.numberOfDays; k++) {
                            if (k === nurDay.days[i].day) {
                                row.push(<td>{nurDay.days[i].label}</td>)
                            }
                            else
                                row.push(<td></td>)
                        }
                        break;
                    } else {
                        for (k; k < nurDay.days[i + 1].day; k++) {
                            if (k === nurDay.days[i].day) {
                                row.push(<td>{nurDay.days[i].label}</td>)
                            }
                            else
                                row.push(<td></td>)
                        }
                        j = k;
                    }
                }
            }
            rows.push(<tr>{row}</tr>)
        })
        return rows;
    }
    return (
        <div className='report-container'>
            <div className='Report'>
                <h1>{report.name}</h1>
                <table className='ReportTable'>
                    <thead>
                        <tr>
                            {generateTableHeader()}
                        </tr>
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
                        <p>Ružica Nikolić</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
