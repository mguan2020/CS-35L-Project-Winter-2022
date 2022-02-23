const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
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
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User with id: ${socket.id} left room: ${data}`);
  });
});

server.listen(3001, () => { // get the node server running
  console.log("Listening at port 3001");
});
