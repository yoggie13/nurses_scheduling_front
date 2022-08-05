import React, { useRef, forwardRef, useCallback, useState } from 'react'
import PrintIcon from '@mui/icons-material/Print';
import '../assets/styles/Schedule.css'
import Schedule from './Schedule';
import { useReactToPrint } from 'react-to-print';

export default function ScheduleContainer() {
    const componentRef = useRef(null);
    const [scheduleName, setScheduleName] = useState();

    const pageStyle = `
    @page {
        size: 297mm 210mm;
      }
    `
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: scheduleName,
        pageStyle: pageStyle
    });


    const Wrapper = forwardRef((props, ref) => (
        <div ref={ref}>
            <Schedule setScheduleName={setScheduleName} />
        </div>
    ));

    return (
        <div className='schedule-container-main'>
            <div className='schedule-container'>
                <Wrapper ref={componentRef}></Wrapper>
            </div>
            <p className='print-button' onClick={handlePrint}>Odštampaj<PrintIcon /></p>
        </div >
    )
}
