import React, { useState } from 'react'
import '../../assets/styles/Settings.css'
import Settings_Nurses from './Settings_Nurses'
import Settings_Parameters from './Settings_Parameters'
import Settings_SequenceRules from './Settings_SequenceRules'
import Settings_Shifts from './Settings_Shifts'
import Settings_GroupingRules from './Settings_GroupingRules'
import Settings_Patterns from './Settings_Patterns'
import SettingsNWDT from './SettingsNWDT'

export default function Settings() {
    const [render, setRender] = useState(<Settings_Nurses />);
    const [chosenID, setChosenID] = useState('nurses');

    const handleRender = (e, value) => {
        e.preventDefault();
        setRender(value)
        setChosenID(e.target.id);
    }
    return (
        <div className='Settings'>
            <h1>Podešavanja</h1>
            <table className='SettingsMenu'>
                <tbody>
                    <tr>
                        <th id='nurses' className={'nurses' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_Nurses />)}>Sestre</th>
                    </tr>
                    <tr>
                        <th id='shifts' className={'shifts' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_Shifts />)}>Smene</th>
                    </tr>
                    <tr>
                        <th id='patterns' className={'patterns' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_Patterns />)}>Paterni</th>
                    </tr>
                    <tr>
                        <th id='nwdt' className={'nwdt' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <SettingsNWDT />)}>Slobodni dani</th>
                    </tr>
                    <tr>
                        <th id='sequence-rules' className={'sequence-rules' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_SequenceRules />)}>Pravila</th>
                    </tr>
                    <tr>
                        <th id='grouping-rules' className={'grouping-rules' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_GroupingRules />)}>Grupisanje</th>
                    </tr>
                    <tr>
                        <th id='parameters' className={'parameters' === chosenID ? 'ChosenTh' : 'NotChosenTh'} onClick={(e) => handleRender(e, <Settings_Parameters />)}>Parametri</th>
                    </tr>
                </tbody>
            </table>
            <div className='SettingsShow'>
                {render}
            </div>
        </div>
    )
}
