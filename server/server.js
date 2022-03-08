const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const alert = require('alert');
const readline = require('readline');
const { promisify } = require('util')
const { Server } = require("socket.io"); // socket.io will be responsible for client and server communication
const { createSocket } = require("dgram");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

let onlineUsers = [];
var dict = {};

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
          let l = line.substring(line.lastIndexOf(')')+1,line.lastIndexOf(':'));
          let q = line.substring(line.lastIndexOf(",")+1,line.lastIndexOf("]")-1).split(" ");
          console.log(q);
          let combined = {room: room, author: a, message: m, time: t, numLikes: parseInt(l),likedby:q};
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
      socket.emit("fail_register",filepath);
    }
    else {
      socket.emit("valid_register", user);
      fs.appendFile(filepath,"Password: " + pass + "\n" + 
        "Friends: " + "\n",function (err){
      if(err) throw err;
      console.log("Saved!");
      });

      fs.appendFile(filepath + "_rooms","Rooms: " + "\n",function (err){
      if(err) throw err;
      console.log("Saved Room File!");
      });
    }
  });

  // Code to receive info on adding friend and saving to account.txt
  // simply appends to end of file
  // FUNCTIONALITY HAS NOT BEEN TESTED
  socket.on("add_friend", (user, friend)=>{
    let filepath = "accounts/"+ user +"\.txt";
    let friendpath = "accounts/"+ friend + "\.txt";
    let exists = false;
    //checks if user is valid
    if(fs.existsSync(filepath)){
      //checks if friend is already added to friends list
      try {
        const data = fs.readFileSync(filepath, 'utf-8');

        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
          if (line == friend) {
            exists = true;
          }
        });
      } catch {
        throw err;
      }
      
      //checks if friend is valid
      if (exists) {
        socket.emit("exists_friend");
      }
      else if (!exists && fs.existsSync(friendpath)){
        fs.appendFile(filepath, friend+"\n",function (err){
          if(err) throw err;
          console.log("Saved friend!");
          socket.emit("saved_friend");
        });
      } else {
        socket.emit("invalid_friend");
      }
    } else {
      throw 'File doesn\'t exist';
    }
  });

  // Code to stop logged_in components from displaying
  socket.on("stop_chat",()=>{
      socket.emit("stop");
  });

  socket.on("log_out",(user)=>{
    if (onlineUsers.indexOf(user) != -1){
      onlineUsers.splice(onlineUsers.indexOf(user), 1);
      sockid = socket.id
      delete dict.sockid;
    }
    socket.emit("logged_out");
  });

  socket.on("stop_profile",()=>{
    socket.emit("return_home");
  });

  // DELETE ACCOUNT IMPLEMENTATION
  socket.on("delete_account",(user)=>{
    // Remove the user from onlineUsers
    if (onlineUsers.indexOf(user) != -1){
      onlineUsers.splice(onlineUsers.indexOf(user), 1);
      sockid = socket.id
      delete dict.sockid;
    }

    // Delete the user's .txt file
    let filepath = 'accounts/' + user + "\.txt";
    if(fs.existsSync(filepath)){
      fs.unlinkSync(filepath);
    }

    // Delete the user's room's file
    let filepath2 = 'accounts/' + user + "_rooms" + "\.txt";
    if(fs.existsSync(filepath2)){
      fs.unlinkSync(filepath2);
    }

    // Remove this user from everyone else's friends list
    fs.readdirSync("accounts/").forEach(file => {
      let userFilePath = "accounts/" + file;
      fs.readFile(userFilePath, 'utf8', function(err, data) {
        let toRemove = user;
        let re = new RegExp('^.*' + toRemove + '.*$', 'gm');
        let formatted = data.replace(re, '');
        formatted = formatted.replace(/\n{2,}/g, '\n');
      
        fs.writeFile(userFilePath, formatted, 'utf8', function(err) {
          if (err) return console.log(err);
        });
      });
    });

    // If user sent a message in the chat, 
    // replace the sender with "deleted account"
    fs.readdirSync("rooms/").forEach(file => {
      let userFilePath = "rooms/" + file;
      fs.readFile(userFilePath, 'utf8', function(err, data) {
        let result = data.replace(new RegExp('by:' + user, 'g'), 'by:deleted account');
      
        // console.log(result);
        fs.writeFile(userFilePath, result, 'utf8', function(err) {
          if (err) return console.log(err);
        });
      });
    });

    socket.emit("logged_out");
    socket.emit("acc_deleted");
  });

  socket.on("show_friends", (user) => {
    socket.emit("profile_showing");
    let filepath = 'accounts/' + user + "\.txt";
    let friend_list = []
    
    if(fs.existsSync(filepath)){
      // console.log("valid username!");

      const file = fs.readFileSync(filepath, 'UTF-8');

      const lines = file.split(/\r?\n/);
      for(let i = 2; i < lines.length-1; i++){
        friend_list.push(lines[i] + "\n");
      }
    }
    socket.emit("friend_list", friend_list);
  });

  
  socket.on("send_like",(data,uname)=>{

    fs.readFile("rooms/" + data.room + "\.txt", {encoding: 'utf8'}, function (err,dat) {
      console.log(data.numLikes);
      let old = data.message + "(posted by:" + data.author + " (posted at time: " + data.time + ')' + (data.numLikes-1) + ':liked by,';
      console.log(old);
      console.log(data.likedby[0]);
      console.log(data.likedby[1]);

      for(let i = 0; i < data.likedby.length-1; i++){
        old += data.likedby[i] + " ";
      }
      old += "]\n";
      let ne = data.message + "(posted by:" + data.author + " (posted at time: " + data.time + ')' + data.numLikes + ':liked by,';
      for(let i = 0; i < data.likedby.length; i++){
        ne += data.likedby[i] + " ";
      }
      console.log(ne);
     ne += "]\n";
      var formatted = dat.replace(old, ne);
    fs.writeFile("rooms/" + data.room + "\.txt", formatted, 'utf8', function (err) {
      if (err) return console.log(err);
     
      
   });

  });
     socket.to(data.room).emit("receive_like",data);
  });

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
          let l = line.substring(line.lastIndexOf(')')+1,line.lastIndexOf(':'));
          let start = line.lastIndexOf(",")+1;
          let end = line.lastIndexOf("]")-1;
          console.log(start);
          console.log(end);
          let q = (start > end) ? [] : line.substring(start,end).split(" ");
          console.log(q);

          let combined = {room: room, author: a, message: m, time: t, numLikes: parseInt(l),likedby:q};
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

    // Make sure user isn't already logged in (in another tab)
    if (onlineUsers.indexOf(user) != -1)
    {
      socket.emit("already_logged", user);
    }
    else {
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
          socket.emit("logged_in", user);
          onlineUsers.push(user);
          dict[socket.id] = user;
        }
        else{
          console.log("invalid Password!");
          socket.emit("invalid_password");
        }
      }
      else{
        console.log("invalid username");
        socket.emit("invalid_password");
      }
    }
  });

  socket.on("join_room", (data,username) => {
    socket.join(data);
    let filepath = 'accounts/' + username + "\.txt";

    //fs.appendFile(filepath,"Room: " + data); // add room number to file
    console.log(`User with id: ${username} joined room: ${data}`);
  });

  socket.on("send_message", (data) => { // listen for various events and respond
    console.log(data.room + "aaa");
    let content = data.message + "(posted by:" + data.author + " (posted at time: " + data.time + ')' + data.numLikes + ':liked by,]\n';
    fs.appendFile("rooms/" + data.room + "\.txt",content,function (err){
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
          let m = line.substring(0,line.lastIndexOf("(posted by"));
          let a = line.substring(line.lastIndexOf("by:") + 3, line.lastIndexOf(" (posted at time"));
          let t = line.substring(line.lastIndexOf("time: ") + 6, line.lastIndexOf(")"));
          let toAdd = m + " (posted by: " + a + ") at time: " + t;
          list.push(toAdd);
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
    // Retrive username, remove user from dict
    user = dict[socket.id]
    sockid = socket.id
    delete dict.sockid;


    // Remove user from onlineUsers
    if (onlineUsers.indexOf(user) != -1){
      onlineUsers.splice(onlineUsers.indexOf(user), 1)
    }
  });
});

server.listen(3001, () => { // get the node server running
  console.log("Listening at port 3001");
});



 

