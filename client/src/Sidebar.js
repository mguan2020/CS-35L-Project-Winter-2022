import "./Sidebar.css";
import React from 'react';
import {useState} from "react"
import UserSidebar from "./UserSidebar"
import {SidebarData} from './SidebarData'
import {getSData} from "./SidebarData"
import { Socket } from "socket.io-client";
import {getSocket} from "./JoinChat"
function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false);
    let username = "";
    // check if user is logged in
    getSocket().on("logged_in", (arg)=>{
        setShowSidebar(true);
        username = arg;
    });
    
    //if logged in, show friends and chatrooms, otherwise don't
    if (showSidebar){
        return (<div className="User_Sidebar">
            <UserSidebar username={username}/>
        </div>)
    } else {
        return (
            <div className="Sidebar">
                <h>Welcome to our chat app.<br/>Sign in to view chatrooms and friends!</h>
            </div>
        );
    }
}

export default Sidebar;