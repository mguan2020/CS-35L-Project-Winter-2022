import React, { useState } from "react";
import io from "socket.io-client";
import "./Register.css";

const socket = io.connect("http://localhost:3001");

let pass_username = "";

export function passUser() {
    return(pass_username);
}

function Register() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [usernameLog, setUsernameLog] = useState("");
    const [passwordLog, setPasswordLog] = useState("");

    const regist = () => {
        socket.emit("register",
        usernameReg, 
        passwordReg);
    };

    const login = () => {
        socket.emit("login",
        usernameLog, 
        passwordLog);

        ///// RECEIVE VALID LOGIN DATA \\\\\\
        socket.on("valid_login", (user) => {
            pass_username = usernameLog;
        });
        // pass_username = usernameLog;
    };

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
                <button onClick={login}>Login</button>
            </div>
            <div>
            </div>
        </div>
    );
}

export default Register;