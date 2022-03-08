import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Register from "./Register";
import {getSocket} from "./JoinChat";
import JoinChat from "./JoinChat";
import "./UserProfile.css"


function UserProfile({username}){
    const [fList, setFList] = useState([]); 
    const [followers,setfollowers] = useState([]);
    getSocket().on("friend_list",(friend_list)=>{
        setFList(friend_list)
    });

    getSocket().on("followers_list",(friend_list)=>{
        setfollowers(friend_list)
    });

    

    if (fList.length == 0)
    {
        setFList(["You aren't following anybody yet!"])
    }

    if(followers.length == 0){
        setfollowers(["No followers yet!"])
    }

    const deleteAccount = () => {
        getSocket().emit("delete_account", username)
    }

    return (
        <div className="Profile">
            <div className="profilecontainer">
                <span class="i-circle">{username.charAt(0)}</span>
                <h3>{username}'s Profile</h3>
                <br></br>
                <p>Following:
                <h3>{fList}</h3>
                </p>
                <br></br>
                <p>You are being followed by:
                <h3>{followers}</h3>
                </p>
                <br></br>
                <button onClick={deleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}

export default UserProfile;