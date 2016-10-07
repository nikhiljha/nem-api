'use strict'

const Promise = require('bluebird');
const unirest = require('unirest');

module.exports = class nisapi {

  // One object per NIS used, this makes the frontend code cleaner.
  constructor(endpoint) {
    // Make sure the endpoint isn't null and log a warning if there is.
    if (endpoint) {
      // May be unclear to newer developers so I'll explain it here.
      // Slicing -1 starts from the end of the string.
      // This checks if the last character is a slash and reacts accordingly.
      if (endpoint.slice(-1).match(/[/\\]/)) {
        this.endpoint = endpoint.slice(0, -1);
      } else {
        this.endpoint = endpoint;
      }
    } else {
      // Warning message in case of a null endpoint.
      console.log('WARNING: The NIS API was initiated with a null item, this \
      is fine if you only need signing for whatever reason, but it could be \
      the result of some bad NIS management code.')
    }
  }

  // Weird workaround to convert JSON to URL Parameters.
  getAsUriParameters(data) {
   var url = '';
   for (var prop in data) {
      url += encodeURIComponent(prop) + '=' +
          encodeURIComponent(data[prop]) + '&';
   }
   return "?" + url.substring(0, url.length - 1)
 }

  // All 'get' requests are handled here.
  get(path, data, callback) {
    unirest.get(this.endpoint + path + this.getAsUriParameters(data))
    .headers({'Accept':'application/json', 'Content-Type':'application/json'})
    .end(callback);
  }

  // All 'post' requests are handled here.
  post(path, data, callback) {
    unirest.post(this.endpoint + path + this.getAsUriParameters(data))
    .headers({'Accept':'application/json', 'Content-Type':'application/json'})
    .end(callback);
  }

  // Converts the private key from hex into a useable format.
  fixPrivateKey(privatekey) {
      return ("0000000000000000000000000000000000000000000000000000000000000000"
      + privatekey.replace(/^00/, '')).slice(-64);
  }

  // Used for signing anything.
  sign(privatekey, content) {
    var KeyPaire = require('./signing/KeyPair.js');
    var KeyPair = new KeyPaire();
    var kp = KeyPair.create(this.fixPrivateKey(privatekey));
    var signature = kp.sign(content).toString();
    return signature;
  }


}
