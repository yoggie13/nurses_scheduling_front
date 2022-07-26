import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import '../assets/styles/Modal.css'

export default function Modal({ content, setModal }) {
    return (
        <div className='Modal'>
            <div className='ModalHeader'>
                <CloseIcon className='CloseModal'
                    onClick={e => setModal(false)} />
            </div>
            <div className='ModalBody'>{content}</div>
        </div>
    )
}
