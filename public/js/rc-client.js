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
      var message = stringifyLog(args);
      if (message.length) {
        socket.send(message);
        if (this.visualizer) {
          visualizer.innerHTML += '<li>'+message+'</li>';
        }
      }
    }
  };

  // from fuse.js
  function isPrimitive(value) {
    var type = typeof value;
    return value == null || type == 'boolean' || type == 'number' || type == 'string';
  }

  function shallowCopy(obj) {
    if (isPrimitive(obj)) {
      return obj;
    }

    var copy = {};
    for (var p in obj) {
      if (isPrimitive(obj[p])) {
        copy[p] = obj[p];
      }
    }
    return copy;
  }

  function stringifyLog(args) {
    var message = '';
    try {
        message = JSON.stringify({ log : args });
    } catch(e) {
      if(console && console.error){
        console.error( e );
      }
      for (var i=0, len=args.length; i<len; i++) {
        args[i] = shallowCopy(args[i]);
      }
      message = JSON.stringify({ log : args });
    }
    return message;
  }

})();
