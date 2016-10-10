var Stomp = require('stompjs');
var client = Stomp.overWS('ws://go.nem.ninja:7778/w/messages/696/sapenea6/websocket');

console.log("ayy occured");

client.debug = function(str) {
  console.log("DEBUG/N: " + str);
}

client.connect('', '', function(frame) {
  client.debug("connected to Stomp");
  client.subscribe('/blocks', function(message) {
      console.log(message.body)
  });
}, function(msg) {
  client.debug(msg);
});
