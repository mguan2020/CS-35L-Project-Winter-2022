import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";


const socket = io.connect("http://localhost:3001"); // connect our frontend with backend

function App() {
  const [username, setUsername] = useState(""); // set states of username, room to be empty at first
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false); // whether user has joined chat or not

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room); // send the user to a chatroom
      setShowChat(true);
    }
  };

  if(showChat){
    return (<div className="App">
         <Chat socket={socket} username={username} room={room} />
    </div>);
  }
  else{
    return ( <div className="App">
      <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Enter username..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room </button> </div>
          
          
    </div>);
  }

}

export default App;
