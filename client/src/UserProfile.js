import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Register from "./Register";
import {getSocket} from "./JoinChat";
import JoinChat from "./JoinChat";


function UserProfile({username}){
    const [fList, setFList] = useState([]); 
    const returnHome = () => {
        getSocket().emit("stop_profile")
    };

    getSocket().on("friend_list",(friend_list)=>{
        setFList(friend_list)
    });

    return (
        <div className="Profile">
            <div className="profilecontainer">
                <h3>{username}'s Profile</h3>
                <br></br>
                <p>Following:
                <h3>{fList}</h3>
                </p>
            </div>
        </div>
    );
}

export default UserProfile;