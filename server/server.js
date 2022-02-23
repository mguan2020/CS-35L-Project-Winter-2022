const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const readline = require('readline');
const { Server } = require("socket.io"); // socket.io will be responsible for client and server communication
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, { // connect express to socket.io server
  cors: {
    origin: "http://localhost:3000", // this is where the app will be run
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // who connected to the message app

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => { // listen for various events and respond
    fs.appendFile(data.author + "\.txt",data.message + '\n',function (err){
      if(err) throw err;
      console.log("Saved!");
    });
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("send_search", (data) => { // process the search request
    let filepath = data.term + "\.txt";
    try{
      if(fs.existsSync(filepath)){
        console.log("Good");
        const file = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
      });

      file.on('line', (line) => {
        console.log(line);
    });
      }
       else{
         console.log("Cannot find information for " + data.term);
       }
      }
    
    catch(err){ // file not found
      console.log("An exception has occurred.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User with id: ${socket.id} left room: ${data}`);
  });
});

server.listen(3001, () => { // get the node server running
  console.log("Listening at port 3001");
});
