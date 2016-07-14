var nodeis = require('./index.js');
const Promise = require('bluebird');
var meme = new nisapi('bob.nem.ninja:7890');

meme.account_get('TALICELCD3XPH4FFI5STGGNSNSWPOTG5E4DS2TOS').then(function(response) {
  console.log(response);
});
