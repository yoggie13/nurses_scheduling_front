import React, { useState } from 'react'
import '../../assets/styles/Settings.css'
import Settings_Nurses from './Settings_Nurses'
import Settings_Parameters from './Settings_Parameters'
import Settings_Rules from './Settings_Rules'
import Settings_Shifts from './Settings_Shifts'
import Settings_GroupingRules from './Settings_GroupingRules'

export default function Settings() {
    const [render, setRender] = useState(<Settings_Nurses />);
    const handleRender = (e, value) => {
        e.preventDefault();
        setRender(value)
    }
    return (
        <div className='Settings'>
            <h1>Podešavanja</h1>
            <table className='SettingsMenu'>
                <tbody>
                    <tr>
                        <th onClick={(e) => handleRender(e, <Settings_Nurses />)}>Sestre</th>
                    </tr>
                    <tr>
                        <th onClick={(e) => handleRender(e, <Settings_Shifts />)}>Smene</th>
                    </tr>
                    <tr>
                        <th onClick={(e) => handleRender(e, <Settings_Rules />)}>Pravila</th>
                    </tr>
                    <tr>
                        <th onClick={(e) => handleRender(e, <Settings_GroupingRules />)}>Grupisanje</th>
                    </tr>
                    <tr>
                        <th onClick={(e) => handleRender(e, <Settings_Parameters />)}>Parametri</th>
                    </tr>
                </tbody>
            </table>
            <div className='SettingsShow'>
                {render}
            </div>
        </div>
    )
}
