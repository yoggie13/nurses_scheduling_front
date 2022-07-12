import React from 'react'
import logo from '../assets/img/logo.png'
import '../assets/styles/Loading.css'

export default function Loading() {
    return (
        <div className='Loading'>
            <img src={logo} alt='loading-logo'></img>
        </div>
    )
}
