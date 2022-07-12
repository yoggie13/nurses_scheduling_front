import React, { useRef, forwardRef, useCallback, useState } from 'react'
import PrintIcon from '@mui/icons-material/Print';
import '../assets/styles/Report.css'
import Report from './Report';
import { useReactToPrint } from 'react-to-print';

export default function ReportContainer() {
    const componentRef = useRef(null);
    const [reportName, setReportName] = useState();

    const pageStyle = `
    @page {
        size: 297mm 210mm;
      }
    `
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: reportName,
        pageStyle: pageStyle
    });


    const Wrapper = forwardRef((props, ref) => (
        <div ref={ref}>
            <Report setReportName={setReportName} />
        </div>
    ));

    return (
        <div className='report-container-main'>
            <div className='report-container'>
                <Wrapper ref={componentRef}></Wrapper>
            </div>
            <p className='print-button' onClick={handlePrint}>Odštampaj<PrintIcon /></p>
        </div >
    )
}
