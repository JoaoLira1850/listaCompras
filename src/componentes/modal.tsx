
import React from "react";
import './style.css'


interface ModalProps {
    isOpen: boolean,
    onClose:()=> void,
    children: React.ReactNode
}

const Modal:React.FC<ModalProps> = ({isOpen, onClose, children}) =>{
    if (isOpen == false) return null

    return (
        <div className="overlay">
            <div className="modal">
                <button onClick={onClose} className="closeButton"> X </button>
                {children}
            </div>
        </div>
    )
}

export default Modal