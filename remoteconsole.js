/**
 * Remote Console server.
 */

/*-----------------------------------------------
  Dependencies
-----------------------------------------------*/

var http        = require('http'),
    // npm
    static      = require('node-static'),
    // vendor
    // Socket.IO needs to be > v0.5.3
    io          = require('./vendor/socket.io');


/*-----------------------------------------------
  Configuration
-----------------------------------------------*/

var fileServer  = new static.Server('./public'),
    port        = parseInt(process.env.PORT) || 8888;


/*-----------------------------------------------
  Server
-----------------------------------------------*/

server = http.createServer(function(request, response) {
  request.on('end', function() {
    fileServer.serve(request, response);
  });
});
server.listen(port);
console.log('Server listening on port :' + port);


var socket = io.listen(server, { transports: ['websocket',
    'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'] });

socket.on('connection', function(client){
  console.log("New client connected.");
  client.on('message', function(message){
    try {
      var msg = JSON.parse(message);
      if ("log" in msg) {
        console.log(msg.log);
      }
    } catch(e) {
      console.warn(e);
    }
  });
  client.on('disconnect', function(){
    console.log("Client disconnected.");
  });
});