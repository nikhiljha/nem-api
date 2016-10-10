// 'use strict'
//
// const stomper = require('stomp');
// const SockJS = require('sockjs-client');
//
// module.exports = class nemsockets {
//
//   /**
//    * constructor - Gives the class a socket uri to use.
//    *
//    * @param  {string} socketuri URL for the socket to connect to.
//    */
//   constructor(endpoint) {
//     // This does not handle null values, because there is no need.
//     this.socketuri = endpoint + '/w';
//     this.socket = new SockJS(this.socketuri + '/messages');
//     this.stomp = stomper.over(this.socket);
//     this.stomp.debug = undefined;
//   }
//
//   connect(callback) {
//     self.stompClient.connect({},
//       function(frame) { if (callback) callback(true) },
//       function() { if (callback) callback(false) }
//     );
//   }
//
//
// }
