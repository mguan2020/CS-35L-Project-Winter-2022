import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
//import { Socket } from "socket.io-client";
import "./Chat.css";
import SearchResult from "./SearchResult";
import {getRoom} from "./JoinChat";
import JoinChat from "./JoinChat";
import Heart from "react-animated-heart";
//import {rem} from "./JoinChat";


//const fs = require('fs');
//const readline = require('readline');

function Chat({ socket, username, room}) {
  const [currentMessage, setCurrentMessage] = useState(""); // the message to be sent
  //const [messageList, setMessageList] = useState([{room: getRoom(),author:username,message:"hiii",time:"xtime"}]);
  const [messageList, setMessageList] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [finalSearchTerm,setfinalSearchTerm] = useState("");
  const [messageR, setMessageR] = useState([]); // messages to be displayed
  const [isSearching, setisSearching] = useState(false);
  const [display, setdisplay] = useState(true);
 // const [numLikes,setnumLikes] = useState([]);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      console.log(room + "y");
      console.log(socket + "y");
      console.log(username + "y");
      const messageData = {
        room: getRoom(),
        author: username,
        message: currentMessage,
        numLikes: 0,
        likedby: [],
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds(),
      };

      await socket.emit("send_message", messageData); // talk to server
      console.log(messageData.room + "x");
      console.log(messageData.likedby);
      setMessageList((list) => [...list, messageData]);
    //  setnumLikes((list) => [...list, 0]);
      setCurrentMessage("");
    }
  };

  socket.on("search_response",(list)=>{
       console.log(list);
       setMessageR(list);
       console.log(list.length);
  });
   
  
  

 const sendSearchRequest = async () => {
    if (searchTerm !== "") {
      const searchData = {
        room: getRoom(),
        author: username,
        term: searchTerm,
      };
      console.log("x");
      await socket.emit("send_search", searchData); // send this request to socket.io
    setfinalSearchTerm(searchTerm);
    setSearchTerm("");
    setisSearching(true);
  }
}


/*socket.on("receive_like",(data)=>{
      for(let i = 0; i < numLikes.length; i++){
        if(messageList[i].time === data.time){
          let n = [...numLikes];
          n[i]++;
          setnumLikes(n);
          break;
        }
      }
});*/

socket.off("receive_data");
socket.on("receive_data",(data)=>{
    console.log("Y");

    setMessageList(data);
    console.log(data);
});
 

  
  const clearSearchResults = async()=> {
       setisSearching(false);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("aaa");
      setMessageList((list) => [...list, data]);
     // setnumLikes((list) => [...list, 0]);
    });

  }, [socket]);

  socket.on("receive_like",(data)=>{
    console.log("Received");
     for(let i = 0; i < messageList.length; i++){
         if (messageList[i].time===data.time){
           console.log("Okay");
           let n = [...messageList];
           n[i].numLikes = data.numLikes;
           n[i].likedby = data.likedby;
           setMessageList(n);
         }
     }
  });

  const leaveRoom = () => {
    socket.emit("stop_chat");
    setdisplay(false);
  }

  return ( (!display) ? (<JoinChat/>) :
    <div className="chat-window">
          <div className="chat-header">
              <p className= "header"> Room: {getRoom()} </p>
              <div className="search-bar">
                  <input
                      className="bar"
                      type="text"
                      value={searchTerm}
                      placeholder="Search for a keyword..."
                      onChange={(event) => {
                          setSearchTerm(event.target.value);
                      }}
                      onKeyPress={(event) => {
                          event.key === "Enter" && sendSearchRequest();
                      }}
                  />
                  <button onClick={sendSearchRequest}>Find</button>
                  <button onClick={clearSearchResults}>Clear Results</button>
              </div>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">


          {messageList.map((messageContent,i) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              > 
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                    <Heart isClick={messageContent.numLikes > 0} onClick={()=>{
                      if(username !== messageContent.author && !messageContent.likedby.includes(username)){
                        let n = [...messageList];
                        n[i].numLikes++;
                        console.log(n[i].likedby);
                        n[i].likedby.push(username);
                        console.log(n[i].likedby);
                        setMessageList(n);
                        socket.emit("send_like",messageContent,username);
                        }
                    }}/>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                    <p id="time"></p>
                    <p id= "time"> Likes:{messageContent.numLikes}</p>

                 

                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Enter Your Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <input type="button" value="Leave room" onClick={leaveRoom}></input>
      
      <SearchResult list={messageR} term={finalSearchTerm} search={isSearching}/>
    </div>
    
  );
}


export default Chat;
