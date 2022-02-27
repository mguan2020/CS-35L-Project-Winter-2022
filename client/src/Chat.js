import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";
import "./Chat.css";
import SearchResult from "./SearchResult";
const fs = require('fs');
const readline = require('readline');

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState(""); // the message to be sent
  const [messageList, setMessageList] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [finalSearchTerm,setfinalSearchTerm] = useState("");
  const [messageR, setMessageR] = useState([]); // messages to be displayed
  const [isSearching, setisSearching] = useState(false);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds(),
      };

      await socket.emit("send_message", messageData); // talk to server
      setMessageList((list) => [...list, messageData]);
     
      setCurrentMessage("");
    }
  };

  socket.on("search_response",(list)=>{
       console.log("Hooray!");
       console.log(list);
       setMessageR(list);
       console.log(list.length);
  });

 const sendSearchRequest = async () => {
    if (searchTerm !== "") {
      const searchData = {
        room: room,
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
  
  const clearSearchResults = async()=> {
       setisSearching(false);
  }
  


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

  }, [socket]);

  return (
    <div className="chat-window">
          <div className="chat-header">
              <p className= "header"> Chat with your Friends </p>
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
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
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

      <SearchResult list={messageR} term={finalSearchTerm} search={isSearching}/>


    </div>
  );
}


export default Chat;
