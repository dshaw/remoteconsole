(function() {

  // Make sure Socket.IO and JSON are available
  if (!window.io || !JSON) return;

  // Instantiate Transport with Socket.IO
  if (!socket) {
    var socket = window.socket = new io.Socket(null);
    socket.connect();
    socket.on("connect", function() {
      console.log("IO Connected.");
    });
    socket.on("disconnect", function() {
      console.log("Reconnecting.");
      socket.connect();
    });
  }

  // usage: log('inside coolFunc',this,arguments);
  // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
  window.log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    var args = Array.prototype.slice.call(arguments);
    if(this.console){
      console.log( args );
    }
    if(this.socket){
      try {
        socket.send(JSON.stringify({ log : args }));
      } catch(e) {
        // can't do anything with non-serializable data.
      }
    }
  };

})();
