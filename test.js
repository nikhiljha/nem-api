var nodeis = require('./index.js');
var meme = new nodeis('bob.nem.ninja:7890');
console.log(meme.heartbeat().message);
