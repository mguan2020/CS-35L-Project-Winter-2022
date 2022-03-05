import "./Sidebar.css";
import React from 'react';
import {useEffect,useState} from "react"
import {SidebarData} from './SidebarData'
import {getSData} from "./SidebarData"
function Sidebar() {
 const [d,setd] = useState([
        {
            title: "Group",
            link: "/Group",
        },
        {
            title: "Friends",
            link: "/Friends",
        },
        {
            title: "Family",
            link: "/Family",
        }
   ]);


   function addData(room){
       
   }

    return (
        <div className="Sidebar">
            <div className="Header"> Chat Rooms </div>
            <ul className="SidebarList">
                {d.map((val, key) => {
                    return (
                        <li key={key}
                            className = "chatroom"
                            onClick={() => {
                                window.location.pathname = val.link
                            }}>
                            <div id="spacer"></div>
                            <div id="title">
                                Room: {val.title}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Sidebar;