import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
//import "./Logout.css"
import Register from "./Register";
import {getSocket} from "./JoinChat";
import "./Logout.css"


function Logout({socket, username}){
    const [display, setdisplay] = useState(true);


    // Sets Logout display, otherwise goes to Register display
    return ((!display) ? (<Register/>) :
        <div className="Logout">
            <div className="logoutContainer">
                <h3>Logout</h3>
                <p>Signed in as {username}</p>
                <button onClick={()=>{setdisplay(false); getSocket().emit("log_out");}}>Logout</button>
            </div>
        </div>
    );
}

export default Logout;