const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const alert = require('alert');
const readline = require('readline');
const { promisify } = require('util')
const { Server } = require("socket.io"); // socket.io will be responsible for client and server communication

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { // connect express to socket.io server
  cors: {
    origin: "http://localhost:3000", // this is where the app will be run
    methods: ["GET", "POST"],
  },
});

function getInitialMsg(room){
    let filepath = "rooms/" + room + "\.txt";
    console.log(filepath);
    let list = [];
    
      if(fs.existsSync(filepath)){
        console.log("Good");
        const file = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
      });
         
        file.on('line', (line) => {
          console.log(line);
          let m = line.substring(0,line.lastIndexOf("(posted by"));
          let a = line.substring(line.lastIndexOf("by:") + 3, line.lastIndexOf(" (posted at time"));
          let t = line.substring(line.lastIndexOf("time: ") + 6, line.lastIndexOf(")"));
          let combined = {room: room, author: a, message: m, time: t};
          list.push(combined);
      });
      const sleep = promisify(setTimeout);
        sleep(500).then(()=>{
          return list;
        });
         
     
      }

      else{
         return list;
       }
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // who connected to the message app
  
  socket.on("register", (user, pass) => {
    let filepath = 'accounts/' + user + "\.txt";
    if(fs.existsSync(filepath)){
      console.log("Username already exists!")
    }
    else {
      socket.emit("valid_register", user);
      fs.appendFile(filepath,"Password: " + pass + "\n" + 
        "Friends: " + "\n",function (err){
      if(err) throw err;
      console.log("Saved!");
      });
    }
  });
  /*socket.on("send_like",(data)=>{
       socket.to(data.room).emit("receive_like",data);
  });*/

  socket.on("get_data",(room)=>{
    console.log("Rec");
    
    let filepath = "rooms/" + room + "\.txt";
    console.log(filepath);
    let list = [];
    
      if(fs.existsSync(filepath)){
        console.log("Good");
        const file = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
      });
         
        file.on('line', (line) => {
          console.log(line);
          let m = line.substring(0,line.lastIndexOf("(posted by"));
          let a = line.substring(line.lastIndexOf("by:") + 3, line.lastIndexOf(" (posted at time"));
          let t = line.substring(line.lastIndexOf("time: ") + 6, line.lastIndexOf(")"));
          let combined = {room: room, author: a, message: m, time: t};
          list.push(combined);
      });

    const sleep = promisify(setTimeout);
    sleep(1000).then(()=>{
      socket.emit("receive_data",list);
    });
   
    }});

  socket.on("login", (user, pass) => {
    console.log(`Attempted login with id: ${user}`);

    let filepath = 'accounts/' + user + "\.txt";
    
    if(fs.existsSync(filepath)){
      // console.log("valid username!");

      let passLine = "Password: " + pass;
      const file = fs.readFileSync(filepath, 'UTF-8');

      const line = file.split(/\r?\n/);
      if (line[0] == passLine)
      {
        /////// SEND VALID LOGIN DATA \\\\\\
        console.log("valid login!");
        socket.emit("valid_login", user);
      }
      else{
        console.log("invalid Password!");
        socket.emit("invalid_password");
      }
    }
    else{
      console.log("invalid username");
    }

  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => { // listen for various events and respond
    console.log(data.room + "aaa");
    fs.appendFile("rooms/" + data.room + "\.txt",data.message + "(posted by:" + data.author + " (posted at time: " + data.time + ')\n',function (err){
      if(err) throw err;
      console.log("Saved!");
    });
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("send_search", (data) => { // process the search request
    let filepath = "rooms/" + data.room + "\.txt";
    console.log(filepath);
    let list = [];
    
      if(fs.existsSync(filepath)){
        console.log("Good");
        const file = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
      });

        file.on('line', (line) => {
          console.log(line);
        if(line.substring(0,line.lastIndexOf("(posted by")).split(" ").includes(data.term)){
          list.push(line);
        }    
      });
        const sleep = promisify(setTimeout);
        sleep(500).then(()=>{
          socket.emit("search_response",list); // send the list of relevant messages back to the client
        });
      }

      else{
         console.log("Cannot find information for " + data.author);
       }
  
  });

  socket.on("disconnect", () => {
    console.log(`User with id: ${socket.id} left`);
  });
});

server.listen(3001, () => { // get the node server running
  console.log("Listening at port 3001");
});



 

