import Sidebar from "./Sidebar";
import "./UserSidebar.css"
import React, { useEffect, useState } from "react";
import {getSocket} from "./JoinChat";

function Logout({username}){
    const [display, setdisplay] = useState(true);

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
   const [friend,setfriend] = useState([
    {
        title: "Friend 1",
        link: "/Group",
    },
    {
        title: "Friend 2",
        link: "/Friends",
    },
    {
        title: "Friend 3",
        link: "/Family",
    }
    ]);

    // when user logs out, sidebar will not display friends and chatrooms
    getSocket().on("stop", ()=>{
        setdisplay(false);
    })

    // function to add friend
    const addFriend = () => {
        getSocket().emit("add_friend");
    };

    const retrieveChat = () => {
        getSocket().emit("");
    }

    // Sets Logout display, otherwise goes to Sidebar display
    return ((!display) ? (<Sidebar/>) :
        <div className="UserSidebar">
            <div className="Header"> Chat Rooms </div>
            <ul className="UserSidebarList">
                {d.map((val, key) => {
                    return (
                        <li key={key}
                            className = "chatroom"
                            onClick={retrieveChat}>
                            <div id="spacer"></div>
                            <div id="title">
                                Room: {val.title}
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="Header">Followers</div>
            <button onClick={addFriend}>Add Friend</button>
            <ul className="SidebarList">
                {friend.map((val, key) => {
                    return (
                        <li key={key}
                            className = "chatroom"
                            onClick={() => {
                                window.location.pathname = val.link
                            }}>
                            <div id="spacer"></div>
                            <div id="title">
                                {val.title}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Logout;

/*return (
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
        <div className="Header">Followers</div>
        <button onClick={addFriend}>Add Friend</button>
        <ul className="SidebarList">
            {friend.map((val, key) => {
                return (
                    <li key={key}
                        className = "chatroom"
                        onClick={() => {
                            window.location.pathname = val.link
                        }}>
                        <div id="spacer"></div>
                        <div id="title">
                            {val.title}
                        </div>
                    </li>
                );
            })}
        </ul>
    </div>
);*/