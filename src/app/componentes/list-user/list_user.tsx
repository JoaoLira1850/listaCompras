import { useEffect, useState } from "react";

export default function lista_user(){
    const [user, setUser ] = useState([])

    useEffect(()=>{
        fetch('/api/user').then(response => response.json()).then(data =>{

            setUser(data)
        })
    },[]);
    return (
            
        <div> 

        </div>

        
    )

}