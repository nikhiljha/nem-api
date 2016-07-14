var nodeis = require('./index.js');
const Promise = require('bluebird');
var meme = new nodeis('bob.nem.ninja:7890');

meme.account_generate().then(function(response) {
  console.log(response);
});
