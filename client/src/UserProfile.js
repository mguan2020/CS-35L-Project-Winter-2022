import React, { useState } from "react";
import {getSocket} from "./JoinChat";
import {passUser} from "./Register";
import "./UserProfile.css"
import "./Chat.css";
import { Socket } from "socket.io-client";


function UserProfile({username}){
    const [fList, setFList] = useState([]); 
    const [followers,setfollowers] = useState([]);
    const [friendList,setfriendList] = useState([]);
    const [age,setage] = useState("");
    const [aboutme,setaboutme] = useState("");
    const [email,setemail] = useState("");

    const[pending,setpending] = useState([]);
    getSocket().on("friend_list",(friend_list)=>{
        setFList(friend_list)
        
    });

    getSocket().off("followers_list");
    getSocket().on("followers_list",(friend_list)=>{
        setfollowers(friend_list)
        console.log("In followers_list");
        for(let i = 0; i < friend_list.length; i++){
            if(fList.includes(friend_list[i]) && !friendList.includes(friend_list[i])){
                    console.log("Entered into later");
                    console.log(friend_list[i]);
                    setfriendList((list) => [...list, friend_list[i]]);
               
              
            }
            else if(!fList.includes(friend_list[i]) && !friendList.includes(friend_list[i])){
                console.log("Follow pending");
                setpending((list) => [...list, friend_list[i]]);
            }
        }
        
    });


     
    

    

    if (fList.length === 0)
    {
        //setFList(["You aren't following anybody yet!"]);
    }

    if(followers.length === 0){
        //setfollowers(["No followers yet!"]);
    }

    if(friendList.length == 0){
        
    }

    const deleteAccount = () => {
        localStorage.removeItem('age'+username);
        localStorage.removeItem('email'+username);
        localStorage.removeItem('aboutme'+username);
        getSocket().emit("delete_account", username);
    }

    return (
        <div className="Profile">
            <div className="profilecontainer">
                <span class="i-circle">{username.charAt(0)}</span>
                <h3>{username}'s Profile</h3>

                <p>Age:
                <input
                      className="bar"
                      type="text"
                      value={localStorage.getItem('age'+username)}
                      placeholder="Enter age..."
                      onChange={(event) => {
                          setage(event.target.value);
                          localStorage.setItem('age' + username,event.target.value);
                      }}
                  />
                  

                </p>
                <br></br>
                <p>Email:
                <input
                      className="bar"
                      type="text"
                      value={localStorage.getItem('email'+username)}
                      placeholder="Enter email address..."
                      onChange={(event) => {
                          setemail(event.target.value);
                          localStorage.setItem('email' + username,event.target.value);
                      }}
                  />
                </p>
            
                <br></br>

                <p>AboutMe:
                <input
                      className="bar"
                      type="text"
                      value={localStorage.getItem('aboutme'+username)}
                      placeholder="Tell us about yourself..."
                      onChange={(event) => {
                          setaboutme(event.target.value);
                          localStorage.setItem('aboutme'+username,event.target.value);
                      }}
                  />
                </p>
                <p>Friends:
                <h3>{friendList.length == 0 ? ["No friends to show"]: friendList}</h3>
                </p>
                <br></br>


                <br></br>
             
                 
                {pending.map((pen) => {
            return (
                <>
              <p style={{color:"red"}}>Pending Friend Request from: {pen}</p>
              <button onClick={()=>{
                  getSocket().emit("add_friend", passUser(), pen);
              }}>Accept</button>
              <button onClick={()=>{
                  getSocket().emit("decline_friend", passUser(), pen);
              }}>Decline</button>
              </>
            );
          })}
          <br></br>
          <br></br>
                <span class="redButton" onClick={deleteAccount}>Delete Account</span>
          

            </div>
        </div>
    );
}

export default UserProfile;