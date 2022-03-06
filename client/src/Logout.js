import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
//import "./Logout.css"
import Register from "./Register";




function Logout({socket, username}){
    const [display, setdisplay] = useState(true);

    // Sets Logout display, otherwise goes to Register display
    return ((!display) ? (<Register/>) :
        <div>
            <div className="Logout">
                <h1>Logout</h1>
                <p>Signed in as {username}</p>
                <button onClick={()=>{setdisplay(false);}}>Logout</button>
            </div>
        </div>
    );
}

export default Logout;