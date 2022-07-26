import React from 'react'
import { Link } from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';
import '../assets/styles/Header.css'
import logo from '../assets/img/logo.png'
import { Settings } from '@mui/icons-material';

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
                <Link to='podesavanja'>
                    <li><Settings /></li>
                </Link>
            </ul>
        </div>
    )
}
