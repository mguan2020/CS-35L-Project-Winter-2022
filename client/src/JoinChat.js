import "./JoinChat.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import {passUser} from "./Register"
import {addData} from "./SidebarData";
import UserProfile from "./UserProfile";
const socket = io.connect("http://localhost:3001"); // connect our frontend with backend
let username = "aa";
 var r = "aaa";


export function getRoom() {
  return(r);
}

export function getSocket(){
  return socket;
}

function JoinChat() {
  // const [username, setUsername] = useState(""); // set states of username, room to be empty at first
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [blankChat, setBlankChat] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // const showUserProfile = () => {
  //   username = passUser();
  //   setShowChat(false);
  //   setShowProfile(true);
  //   socket.emit("show_friends", (username))
  // };

  socket.on("profile_showing", () => {
    setShowChat(false);
    setShowProfile(true);
  });

  socket.off("display_chatroom2");
  socket.on("display_chatroom2", (val) => {
      setShowChat(true);
      r = val;
      setRoom(val);
      console.log("Retrieving info from " + getRoom());
      socket.emit("get_data", getRoom());
  });
  socket.on("stop", () => {
    setLoggedIn(true);
    setShowProfile(false);
    setShowChat(false);
  });

  socket.on("return_home", () => {
    setShowProfile(false);
    setShowChat(false);
  });

  socket.on("logged_in", (user) => {
    setLoggedIn(true);
    setShowProfile(false);
    setShowChat(false);
    setDeleted(false);
    username = user;
  });
  
  socket.on("logged_out", () => {
    setLoggedIn(false);
    setShowProfile(false);
    setShowChat(false);
  });

  socket.on("acc_deleted", () => {
    setDeleted(true);
  });

  const joinRoom = () => {
    if (room !== "") {
      username = passUser();
      console.log("joinROOM! -> Username: " + username);
      console.log("joinROOM! -> Room: " + room);
      r = room;
      if (loggedIn !== false && room !== "") {
        addData(room);
        socket.emit("join_room", room,username); // send the user to a chatroom
         console.log("going into get_Data");
        setShowChat(true);
        socket.emit("get_data",getRoom());
      }
    }
    else {
      setBlankChat(true);
    }
  };

  let errmsg = "";
  if(room === "")
  {
    errmsg = "Enter a room name";
  }
  if(username === "")
  {
    errmsg = "Log in to join a room!";
  }

  if(!(loggedIn)) {
    return (<div className="JoinChat">
    <h3>{deleted && <p style={{color:"red"}}>Account Deleted</p>}
    <img src = "https://i.imgur.com/bLnZ2JY.png"
      height = "200" width = "600" />
      </h3>
    </div>);
  }

  if(showChat){
    return (<div className="JoinChat">
      
         <Chat socket={socket} username={username} room={room}/>
    </div>);
  }

  if(showProfile){
    return (<div className="UserProfile">
      
         <UserProfile username={username}/>
    </div>);
  }

  else{
    return ( <div className="JoinChat">
      <div className="joinChatContainer">
          <h3>Join a Chat Room</h3>
          <br></br>
          <input
            type="text"
            placeholder="Room Name"
            onChange={(event) => {
              setRoom(event.target.value);
              r = event.target.value;
            }}
          />
          <br></br>
          <button onClick={joinRoom}>Join</button>
          {blankChat && <p style={{color:"red"}}>Room ID cannot be blank</p>}
          {/* <button onClick={updateValues}>Update Username </button> */}
           </div>
          <div>
          </div>
    </div>
    );
  }

}

export default JoinChat;
