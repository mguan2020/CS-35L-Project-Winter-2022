import "./Sidebar.css";
import React from 'react';
import {SidebarData} from './SidebarData'

function Sidebar() {
    return (
        <div className="Sidebar">
            <div className="Header"> Chat Rooms </div>
            <ul className="SidebarList">
                {SidebarData.map((val, key) => {
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