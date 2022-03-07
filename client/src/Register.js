import React, { useState } from "react";
import io from "socket.io-client";
import {getSocket} from "./JoinChat";
import "./Register.css";
import Logout from "./Logout";

//const socket = io.connect("http://localhost:3001");

let pass_username = "";

export function passUser() {
    return(pass_username);
}



function Register() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [usernameLog, setUsernameLog] = useState("");
    const [passwordLog, setPasswordLog] = useState("");
    const [showLogout, setShowLogout] = useState(false); //used to show logout page
    const [failregister, setfailregister] = useState(false);
    const [faillogin, setfaillogin] = useState(false);
    const [successlogin, setsuccesslogin] = useState(false);


    const regist = () => {
        getSocket().emit("register",
        usernameReg, 
        passwordReg);
    };

    const login = () => {
        getSocket().emit("login",
        usernameLog, 
        passwordLog);

        ///// RECEIVE VALID LOGIN DATA \\\\\\
        getSocket().on("valid_login", (user) => {
            setfaillogin(false);
            setsuccesslogin(true);
            pass_username = usernameLog;
        });
        setShowLogout(true); //set true to display logout page
        console.log("Going to logout page")
        
        // pass_username = usernameLog;
    };

    // Code to prevent caching of credentials
    getSocket().on("stop",()=>{
        pass_username = "";
    });

    getSocket().on("fail_register",(user)=>{
        setfailregister(true);
    });

    getSocket().on("valid_register",()=>{
        setfailregister(false);
    });

    getSocket().on("invalid_password",()=>{
        setfaillogin(true);
    });

    // if showLogout = false, will show regular registration/login page
    if (showLogout){
        return (<div className="Logout">
            <Logout socket={getSocket()} username={usernameLog}/>
        </div>)
    } else {
        return (
            <div>
                <div className="registration">
                    <h1>Register</h1>
                    <input type="text" placeholder="Username" value={usernameReg}
                        onChange={(e) => {
                            setUsernameReg(e.target.value);
                        }}
                    />
                
                    <input type="password" placeholder="Password" value={passwordReg}
                        onChange={(e) => {
                            setPasswordReg(e.target.value);
                        }}
                    />
                    <button onClick={regist}>Register</button>
                    {failregister && <p style={{color:"red"}}>Username already exists!</p>}
                </div>
                <div className="login">
                    <h1>Login</h1>
                    <input type="text" placeholder="Username" value={usernameLog}
                        onChange={(e) => {
                            setUsernameLog(e.target.value);
                        }}
                    />
                    <input type="password" placeholder="Password" value={passwordLog}
                        onChange={(e) => {
                            setPasswordLog(e.target.value);
                        }}
                    />
                    <button disabled={successlogin} onClick={login}>Login</button>
                    {faillogin && <p style={{color:"red"}}>Incorrect username or password</p>}
                    {successlogin && <p className="loginmsg" >Login successful</p>}
                    {successlogin && <p className="loginasmsg" >Logged in as: </p>}
                    {successlogin && <p className="user"> {usernameLog} </p>}
                </div>
                <div>
                </div>
            </div>
        );
    }
}

export default Register;