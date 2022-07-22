import React, { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import Loading from '../Loading';
import services from '../../services/services';
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
        var n = nurses;
        n[index].Name = e.target.value;

        setNurses([...n]);

        addNurseForChange(index);
    }
    const handleSurnameChange = (e, index) => {
        var n = nurses;
        n[index].Surname = e.target.value;

        setNurses([...n]);

        addNurseForChange(index);
    }
    const handleExperienceChange = (e, index) => {
        var n = nurses;
        n[index].Experienced = e.target.checked ? 1 : 0;

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
        setLoading(true);

        if (nursesToChange !== undefined &&
            nursesToChange !== null &&
            nursesToChange.length > 0) {

            var editData = [];
            nursesToChange.forEach((nurse) => {
                editData.push(nurses[nurse])
            })

            var res = await services.EditNurses(editData);
            if (res !== undefined && res.status === 200) {
                setAlert({
                    succsess: true,
                    message: "Uspešno sačuvane izmene"
                });
            }
            else {
                setAlert({
                    succsess: false,
                    message: "Greška pri čuvanju izmena"
                })
            }
        }

        if (nursesToDelete !== undefined &&
            nursesToDelete !== null &&
            nursesToDelete.length > 0) {

            var ret = await services.DeleteNurses(nursesToDelete);
            if (ret !== undefined && ret.status === 200) {
                setAlert({
                    succsess: true,
                    message: "Uspešno izbrisane sestre"
                });
            }
            else {
                setAlert({
                    succsess: false,
                    message: "Greška pri brisanju"
                })
            }
        }
        setLoading(false)
    }

    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='SettingsArray'>
                        {
                            nurses.map((nurse, index) => <div className='SettingsRow' key={nurse.NurseID}>
                                <TextField
                                    value={nurse.Name}
                                    onChange={(e) => handleNameChange(e, index)}
                                    label='Ime'
                                />
                                <TextField
                                    value={nurse.Surname}
                                    onChange={(e) => handleSurnameChange(e, index)}
                                    label='Prezime'
                                />
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={nurse.Experienced === 1 ? true : false}
                                            onChange={(e) => handleExperienceChange(e, index)}
                                        />}
                                        label="Iskusna" />
                                </FormGroup>
                                <DeleteForeverRounded
                                    onClick={(e) => handleDelete(e, index)}
                                />
                            </div>)
                        }
                        <button className='MyButton' disabled={
                            (nursesToChange === undefined || nursesToChange === null || nursesToChange.length <= 0)
                            && (nursesToDelete === undefined || nursesToDelete === null || nursesToDelete.length <= 0)
                        }
                            onClick={(e) => handleSave(e)}>Sačuvaj izmene</button>
                    </div>
            }
        </>
    )
}
