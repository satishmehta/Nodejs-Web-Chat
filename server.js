var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var server = require('http').createServer(app);
var io= require('socket.io').listen(server);

users=[];
connections =[];

server.listen(process.env.PORT || 5000);
console.log('Server is running on post no 5000');

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('CONNECTED: %s sockets connected',connections.length);

  //Disconnect
  socket.on('disconnect',function(data){
    //if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1 );
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("DISCONNECTED: %s sockets connected" , connections.length);
  });

  //Send Message
  socket.on('send message',function(data){
    console.log(data);
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  //New users
  socket.on('new user',function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
  });

  function updateUsernames(){
      io.sockets.emit('get users', users);
  }

});
