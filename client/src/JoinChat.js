import "./JoinChat.css";
import io from "socket.io-client";
import {Socket} from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Register from "./Register"
import {passUser} from "./Register"
import {addData} from "./SidebarData";
import UserProfile from "./UserProfile";
const socket = io.connect("http://localhost:3001"); // connect our frontend with backend
const x = 1;
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

  const joinRoom = () => {
    username = passUser();
    console.log("joinROOM! -> Username: " + username);
    console.log("joinROOM! -> Room: " + room);
    r = room;
    if (username !== "" && room !== "") {
      addData(room);
      socket.emit("join_room", room,username); // send the user to a chatroom
       
      setShowChat(true);
      socket.emit("get_data",getRoom());
    }   
  };

  const showUserProfile = () => {
    username = passUser();
    setShowChat(false);
    setShowProfile(true);
    socket.emit("show_friends", (username))
  };

  socket.on("return_home", () => {
    setShowProfile(false);
    setShowChat(false);
  });

  socket.on("logged_in", () => {
    setLoggedIn(true);
    setShowProfile(false);
    setShowChat(false);
  });
  
  socket.on("logged_out", () => {
    setLoggedIn(false);
    setShowProfile(false);
    setShowChat(false);
  });

  let errmsg = "";
  if(room == "")
  {
    errmsg = "Enter a room name";
  }
  if(username == "")
  {
    errmsg = "Log in to join a room!";
  }

  if(!(loggedIn)) {
    return (<div className="JoinChat">
    <h3>Welcome to our chat app. <br/>
      Sign in to view chatrooms and friends!</h3>
    </div>);
  }

  if(showChat){
    return (<div className="JoinChat">
      
         <Chat socket={socket} username={username} room={room}/>
    </div>);
  }

  if(showProfile){
    return (<div className="UserProfile">
      
         <UserProfile socket={socket} username={username}/>
    </div>);
  }

  else{
    return ( <div className="JoinChat">
      <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
              r = event.target.value;
            }}
          />
          <button onClick={joinRoom}>Join A Room </button>
          <button onClick={showUserProfile}>Show My Profile</button>
          {/* <button onClick={updateValues}>Update Username </button> */}
           </div>
          <div>
          </div>
    </div>
    );
  }

}

export default JoinChat;
