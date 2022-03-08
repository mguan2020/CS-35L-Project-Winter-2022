import React, { useState } from "react";
import Register from "./Register";
import {getSocket} from "./JoinChat";
import "./Logout.css"


function Logout({socket, username}){
    const [display, setdisplay] = useState(true);
    const [profileShown, setProfileShown] = useState(false);

    
    const showUserProfile = () => {
        socket.emit("show_friends", (username));
        socket.emit("show_followers",(username));
        setProfileShown(true);
    };
    
    const returnHome = () => {
        socket.emit("stop_profile", (username))
        setProfileShown(false);
    };

    getSocket().on("acc_deleted", () =>{
        setdisplay(false);
    })


    // Sets Logout display, otherwise goes to Register display
    if (!profileShown){
        return ((!display) ? (<Register/>) :
        <div className="Logout">
            <div className="logoutContainer">
                <h3>Signed In</h3>
                <p>Username: {username}</p>
                <button onClick={showUserProfile}>Show My Profile</button>
                <br></br>
                <button onClick={()=>{setdisplay(false); getSocket().emit("log_out", (username));}}>Logout</button>
            </div>
        </div>
        );
    } else{
        return ((!display) ? (<Register/>) :
        <div className="Logout">
            <div className="logoutContainer">
                <h3>Signed In</h3>
                <p>Username: {username}</p>
                <button onClick={returnHome}>Return Home</button>
                <br></br>
                <button onClick={()=>{setdisplay(false); getSocket().emit("log_out", (username));}}>Logout</button>
            </div>
        </div>
        );
    }
}

export default Logout;