var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var users = [];


io.on('connection', function(socket){
  console.log('client connected');
  socket.on('message', function(message){
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', function(){
    socket.broadcast.emit('message', "your opponent has just logged out");
    if(users.length < 2){
    socket.broadcast.emit('prompt', "You Win!");
  };
  });
  socket.on('userReg', function(nickname){
    socket.nickname = nickname;
    users.push(nickname);

    if(users.length === 1 || typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {
      socket.join('drawer');
      io.in('drawer').emit('drawer', socket.nickname);
      socket.broadcast.emit('message', socket.nickname + " is the drawer");
      io.in('drawer').emit('newWord');
    }
    else {
      socket.join('guesser');
      io.in('guesser').emit('guesser', socket.nickname);
      socket.broadcast.emit('message', socket.nickname + " is the guesser");
    };
    socket.broadcast.emit('message', nickname + ' has just logged in');
    io.emit('userList', users);
  });
  // listen for 'draw' event then use socket.broadcast to broadcast to other...
  // clients
socket.on('draw', function(position){
  socket.broadcast.emit('draw', position);
});
socket.on('guess', function(guess){
  socket.broadcast.emit('guess', guess);
});

});
server.listen(process.env.PORT || 8080);
