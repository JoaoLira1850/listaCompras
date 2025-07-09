import React from "react"
import './style.css'

interface Modal2Props{
    isOpen: boolean,
    onClose:()=> void,
    children: React.ReactNode
}


const Popup : React.FC<Modal2Props> = ({isOpen,onClose,children}) =>{

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

export default Popup