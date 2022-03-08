import Sidebar from "./Sidebar";
import "./UserSidebar.css"
import React, { useEffect, useState } from "react";
import {getSocket} from "./JoinChat";
import {passUser} from "./Register"

function UserSidebar(){
    const [display, setdisplay] = useState(true);
    const [friend_username, setFriendUsername] = useState("");
    const [failfriend, setFailFriend] = useState(false);
    const [savedfriend, setSavedFriend] = useState(false);
    const [existsfriend, setExistsFriend] = useState(false);
    const [blankFriend, setBlankFriend] = useState(false);
    const [selfAdd, setSelfAdd] = useState(false);
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
   const [friend,setfriend] = useState([]);

    // when user logs out, sidebar will not display friends and chatrooms
    getSocket().on("logged_out", ()=>{
        setdisplay(false);
    });

    getSocket().on("invalid_friend", ()=>{
        setFailFriend(true);
        setSavedFriend(false);
        setSelfAdd(false);
        setExistsFriend(false);
        setBlankFriend(false);
    });

    getSocket().on("saved_friend", ()=>{
        setExistsFriend(false);
        setBlankFriend(false);
        setFailFriend(false);
        setSavedFriend(true);
        setSelfAdd(false);
    });

    getSocket().on("exists_friend", ()=>{
        setExistsFriend(true);
        setBlankFriend(false);
        setFailFriend(false);
        setSavedFriend(false);
        setSelfAdd(false);
    });

    // function to add friend
    const addFriend = () => {
        if (friend_username != "" && passUser() != friend_username)
        {
            getSocket().emit("add_friend", passUser(), friend_username);
            
            // getSocket().emit("show_friends", passUser());
        }
        else if (friend_username == "") {
            setBlankFriend(true);
            setFailFriend(false);
            setSavedFriend(false);
            setSelfAdd(false);
        }
        else if (friend_username == passUser()) {
            setBlankFriend(false);
            setFailFriend(false);
            setSavedFriend(false);
            setSelfAdd(true);
        }
    };

    // function to see chatrooms you are part of
    const retrieveChat = () => {
        getSocket().emit("join_room", passUser());
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
            <br></br>
            <div className="Header">Followers</div>
            <input type="text" placeholder="Username" value={friend_username}
                        onChange={(e) => {
                            setFriendUsername(e.target.value);
                        }}
                    />
            <button onClick={addFriend}>Add Friend</button>
            {failfriend && <p style={{color:"red"}}>Invalid Friend</p>}
            {blankFriend && <p style={{color:"red"}}>Must Enter Friend</p>}
            {selfAdd && <p style={{color:"red"}}>Can't add yourself!</p>}
            {savedfriend && <p style={{color:"green"}}>Friend added!</p>}
            {existsfriend && <p>Friend already exists!</p>}


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

export default UserSidebar;

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