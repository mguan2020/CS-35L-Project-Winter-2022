import "./JoinChat.css";
import io from "socket.io-client";
import {Socket} from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Register from "./Register"
import {passUser} from "./Register"

const socket = io.connect("http://localhost:3001"); // connect our frontend with backend
let username = "";

function JoinChat() {
  // const [username, setUsername] = useState(""); // set states of username, room to be empty at first
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false); // whether user has joined chat or not

  const joinRoom = () => {
    username = passUser();
    console.log("joinROOM! -> Username: " + username);
    if (username !== "" && room !== "") {
      socket.emit("join_room", room); // send the user to a chatroom
      setShowChat(true);
    }   
  };

  // const updateValues = () => {
  //   setUsername(passUser());
  // }

  // const receiveUsername = () => {
  //   if (passUser != "") {
  //     setUsername(passUser);
  //   }
  // };
  // ///// RECEIVE VALID LOGIN DATA \\\\\\
  // socket.on("valid_login", (user) => {
  //   console.log("received!");
  //   setUsername(user); // need this to execute
  // });

  let errmsg = "";
  if(room == "")
  {
    errmsg = "Enter a room name";
  }
  if(username == "")
  {
    errmsg = "Log in to join a room!";
  }

  if(showChat){
    return (<div className="JoinChat">
         <Chat socket={socket} username={username} room={room} />
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
            }}
          />
          <button onClick={joinRoom}>Join A Room </button>
          {/* <button onClick={updateValues}>Update Username </button> */}
           </div>
          <div>
          </div>
    </div>
    );
  }

}

export default JoinChat;