import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import '../assets/styles/Notification.css'

export default function Notification({ success, message }) {
    return (
        <div className='Notification' id={success ? 'confirm' : 'error'}>
            {
                success
                    ? <CheckCircleIcon />
                    : <ErrorIcon />
            }
            <p>{message}</p>
        </div>
    )
}
