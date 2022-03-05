import React, { useState } from "react";
import io from "socket.io-client";
import {getSocket} from "./JoinChat";
import "./Register.css";

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
    const[failregister, setfailregister] = useState(false);
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

        
        // pass_username = usernameLog;
    };

    getSocket().on("fail_register",(user)=>{
        setfailregister(true);
    });

    getSocket().on("valid_register",()=>{
        setfailregister(false);
    });

    getSocket().on("invalid_password",()=>{
        setfaillogin(true);
    });

    return (
        <div>
            <div className="registration">
                <h1>Register</h1>
                <input type="text" placeholder="Username" 
                    onChange={(e) => {
                        setUsernameReg(e.target.value);
                    }}
                />
               
                <input type="password" placeholder="Password" 
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }}
                />
                <button onClick={regist}>Register</button>
                {failregister && <p style={{color:"red"}}>Username already exists!</p>}
            </div>
            <div className="login">
                <h1>Login</h1>
                <input type="text" placeholder="Username" 
                    onChange={(e) => {
                        setUsernameLog(e.target.value);
                    }}
                />
                <input type="password" placeholder="Password" 
                    onChange={(e) => {
                        setPasswordLog(e.target.value);
                    }}
                />
                <button disabled={successlogin} onClick={login}>Login</button>
                {faillogin && <p style={{color:"red"}}>Incorrect username or password</p>}
                {successlogin && <p style={{color:"green"}}>Login successful</p>}
            </div>
            <div>
            </div>
        </div>
    );
}

export default Register;