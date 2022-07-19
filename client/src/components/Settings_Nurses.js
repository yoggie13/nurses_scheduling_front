import React, { useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Loading from './Loading';
import services from '../services/services';
import { DeleteForeverRounded } from '@mui/icons-material';

export default function Settings_Nurses() {
    const [nurses, setNurses] = useState([]);
    const [nursesToChange, setNursesToChange] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();
    const [nursesToDelete, setNursesToDelete] = useState([]);

    useEffect(() => {
        setLoading(true);
        getNurses();
    }, [])

    const getNurses = async () => {
        var res = await services.GetNurses();

        if (res !== undefined && res.status === 200) {
            res.json()
                .then((response) => {
                    setNurses(response);
                    setLoading(false);
                })
        }
        else {
            setAlert({
                succsess: false,
                message: "Greška pri učitvanju"
            })
        }
    }
    const handleNameChange = (e, index) => {
        e.preventDefault();

        var n = nurses;
        n[index].Name = e.target.value;

        setNurses([...n]);

        addNurseForChange(index);

    }
    const handleSurnameChange = (e, index) => {
        e.preventDefault();

        var n = nurses;
        n[index].Surname = e.target.value;

        setNurses([...n]);

        addNurseForChange(index);
    }
    const handleExperienceChange = (e, index) => {
        e.preventDefault();

        var n = nurses;
        n[index].Experienced = e.target.checked;

        setNurses([...n]);

        addNurseForChange(index);
    }

    const addNurseForChange = (index) => {
        var n = nursesToChange;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === index) {
                return;
            }
        }
        n.push(index)
        setNursesToChange([...n]);
    }
    const handleDelete = (e, index) => {
        e.preventDefault();

        var d = nursesToDelete;
        d.push(nurses[index].NurseID);
        setNursesToDelete([...d]);

        var n = nurses;
        n.splice(index, 1);
        setNurses([...n])

        var ntc = nursesToChange;

        for (let i = 0; i < ntc.length; i++) {
            if (ntc[i] === index)
                ntc.splice(i, 1);
            if (ntc[i] > index)
                ntc[i]--;
        }

        setNursesToChange([...ntc]);
    }

    const handleSave = async (e) => {

    }
    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='NurseArray'>
                        {
                            nurses.map((nurse, index) => <div className='NurseSettings' key={nurse.NurseID}>
                                <TextField
                                    value={nurse.Name}
                                    onChange={(e) => handleNameChange(e, index)} />
                                <TextField
                                    value={nurse.Surname}
                                    onChange={(e) => handleSurnameChange(e, index)} />
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={nurse.Experienced}
                                            onChange={(e) => handleExperienceChange(e, index)}
                                        />}
                                        label="Iskusna" />
                                </FormGroup>
                                <DeleteForeverRounded
                                    onClick={(e) => handleDelete(e, index)}
                                />
                            </div>)
                        }
                        <button className='MyButton' onClick={(e) => handleSave(e)}>Sačuvaj izmene</button>
                    </div>
            }
        </>
    )
}
