import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/styles/Header.css'
import logo from '../assets/img/logo.png'

export default function Header() {
    return (
        <div className='Header'>
            <img src={logo}></img>
            <ul>
                <Link to='/'>
                    <li>Kreiranje rasporeda</li>
                </Link>
                <Link to='/izvestaji'>
                    <li>Izveštaji</li>
                </Link>
            </ul>
        </div>
    )
}
