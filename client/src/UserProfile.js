import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Register from "./Register";
import {getSocket} from "./JoinChat";
import JoinChat from "./JoinChat";


function UserProfile({socket, username}){
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
                <h3>{username}'s Account</h3>
                <p>Friends: </p>
                <h3>{fList}</h3>
                <button onClick={()=>{returnHome()}}>Return to home page</button>
            </div>
        </div>
    );
}

export default UserProfile;