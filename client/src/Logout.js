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

    getSocket().on("return_home", () =>{
        setProfileShown(false);
        setdisplay(true);
    });

    // Sets Logout display, otherwise goes to Register display
    if (!profileShown){
        return ((!display) ? (<Register/>) :
        <div className="Logout">
            <div className="logoutContainer">
                <br></br>
                <img src = "https://i.imgur.com/bLnZ2JY.png"
      height = "100" width = "300" alt = "" />
                <h3>Signed In</h3>
                <p>Username: {username}</p>
                <button onClick={showUserProfile}>Show My Profile</button>
                <br></br>
                <span class="redLogOut" onClick={()=>{setdisplay(false); getSocket().emit("log_out", (username));}}>Log Out</span>
            </div>
        </div>
        );
    } else{
        return ((!display) ? (<Register/>) :
        <div className="Logout">
            <div className="logoutContainer">
                <br></br>
                <img src = "https://i.imgur.com/bLnZ2JY.png"
      height = "100" width = "300" alt = "" />
                <h3>Signed In</h3>
                <p>Username: {username}</p>
                <button onClick={returnHome}>Return Home</button>
                <br></br>
                <span class="redLogOut" onClick={()=>{setdisplay(false); getSocket().emit("log_out", (username));}}>Log Out</span>
            </div>
        </div>
        );
    }
}

export default Logout;