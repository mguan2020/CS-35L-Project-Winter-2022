import "./Sidebar.css";
import React from 'react';
import {useState} from "react"
import UserSidebar from "./UserSidebar"
import {getSocket} from "./JoinChat"
function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false);
    // let username = "";
    
    // check if user is logged in
    getSocket().on("logged_in", (arg)=>{
        setShowSidebar(true);
        // username = arg;
    });

    getSocket().on("logged_out", ()=>{
        setShowSidebar(false);
    });
    
    //if logged in, show friends and chatrooms, otherwise don't
    if (showSidebar){
        return (<div className="UserSidebar">
            <UserSidebar/>
        </div>)
    } else {
        return (
            <div className="Sidebar">
            </div>
        );
    }
}

export default Sidebar;