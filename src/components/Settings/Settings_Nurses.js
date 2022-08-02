import React, { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup, TextField, } from '@mui/material';
import Loading from '../Loading';
import services from '../../services/services';
import { DeleteForeverRounded } from '@mui/icons-material';
import Modal from '../Modal';
import Notification from '../Notification'

export default function Settings_Nurses() {
    const [nurses, setNurses] = useState([]);
    const [nursesToChange, setNursesToChange] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();
    const [nursesToDelete, setNursesToDelete] = useState([]);
    const [modal, setModal] = useState();
    const [newNurse, setNewNurse] = useState({
        Name: "",
        Surname: "",
        Experienced: false
    });

    const isValid = (field) => {
        if (field === undefined || field === null)
            return false;
        return true;
    }

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
                success: false,
                message: "Greška pri učitavanju"
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
                    success: true,
                    message: "Uspešno sačuvane izmene"
                });
            }
            else {
                setAlert({
                    success: false,
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
                    success: true,
                    message: "Uspešno izbrisane sestre"
                });
                setLoading(false);
            }
            else {
                setAlert({
                    success: false,
                    message: "Greška pri brisanju"
                })
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }
    const addNurse = async () => {
        setLoading(true);

        if (!isValid(newNurse.Name) || !isValid(newNurse.Surname)) {
            setAlert({
                success: false,
                message: "Polja nisu popunjena kako treba"
            });
            setLoading(false);
            return;
        } else {
            var res = await services.AddNurse(newNurse);
            if (res !== undefined && res.status === 200) {
                setAlert({
                    success: true,
                    message: "Uspešno dodato"
                });
                setNewNurse({
                    Name: "",
                    Surname: "",
                    Experienced: false
                })
                setModal(false);
                getNurses();
            }
            else {
                setAlert({
                    success: false,
                    message: "Greška pri čuvanju"
                });
                setLoading(false);
            }
        }

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
                        <div className='NursesFooter'>
                            <button className='MyButton' onClick={(e) => setModal(true)}>Dodaj setru</button>
                            <button className='MyButton' disabled={
                                (nursesToChange === undefined || nursesToChange === null || nursesToChange.length <= 0)
                                && (nursesToDelete === undefined || nursesToDelete === null || nursesToDelete.length <= 0)
                            }
                                onClick={(e) => handleSave(e)}>Sačuvaj izmene</button>
                        </div>
                    </div>
            }
            {
                modal
                    ? <Modal
                        content={
                            <>
                                <TextField
                                    label="Ime"
                                    value={newNurse.Name}
                                    onChange={(e) => setNewNurse({ ...newNurse, Name: e.target.value })}
                                />
                                <TextField
                                    label="Prezime"
                                    value={newNurse.Surname}
                                    onChange={(e) => setNewNurse({ ...newNurse, Surname: e.target.value })}
                                />
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox
                                            value={newNurse.Experienced}
                                            onChange={(e) => setNewNurse({ ...newNurse, Experienced: e.target.checked })}
                                        />}
                                        label="Iskusna"
                                    />
                                </FormGroup>
                                <button className="MyButton" onClick={(e) => addNurse()}>Sačuvaj</button>
                            </>
                        }
                        setModal={setModal}
                    />
                    : null
            }
            {
                alert !== undefined && alert !== null
                    ? <Notification
                        success={alert.success}
                        message={alert.message}
                        setAlert={setAlert}
                    />
                    : null
            }
        </>
    )
}
