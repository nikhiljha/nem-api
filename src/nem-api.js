'use strict'

const Promise = require('bluebird');
const unirest = require('unirest');
const stompit = require('stompit');

module.exports = class nisapi {

  /**
   * constructor - Give the object an NIS URL to interact with.
   *
   * @param {string} endpoint HTTP formatted base URL of the NIS, including port.
   */
  constructor(endpoint) {
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

  /**
   * asuri - Given JSON, convert to URL syntax.
   *
   * @param  {string} data JSON formatted data
   * @return {string}      URI formatted arguments
   */
  asuri(data) {
   var url = '';
   for (var prop in data) {
      url += encodeURIComponent(prop) + '=' +
             encodeURIComponent(data[prop]) + '&';
   }
   return "?" + url.substring(0, url.length - 1)
 }


  /**
   * get - Sends an HTTP GET request to the API.
   *
   * @param  {string}   path        Relative path of API call.
   * @param  {json}     data        JSON formatted object to send.
   * @param  {function} callback    Callback that is given a response object.
   */
  get(path, data, callback) {
    unirest.get(this.endpoint + path + this.asuri(data))
    .headers({'Accept':'application/json', 'Content-Type':'application/json'})
    .end(callback);
  }


  /**
   * post - Sends an HTTP Post request to the API.
   *
   * @param  {string}   path        Relative path of API call.
   * @param  {json}     data        JSON formatted object to send.
   * @param  {function} callback    Callback that is given a response object.
   */
  post(path, data, callback) {
    unirest.post(this.endpoint + path)
    .headers({'Accept':'application/json', 'Content-Type':'application/json'})
    .send(data)
    .end(callback);
  }


  /**
   * fixpkey - Fix a hex key for use in signing.
   *
   * @param  {string} privatekey Private key in hex format.
   * @return {string}            Fixed private key.
   */
  fixpkey(privatekey) {
      return ("0000000000000000000000000000000000000000000000000000000000000000"
      + privatekey.replace(/^00/, '')).slice(-64);
  }


  /**
   * sign - Sign a given object with a given private key.
   *
   * @param  {string} privatekey Private key of NEM account in hex.
   * @param  {object} content    Thing that you want to sign.
   * @return {string}            Signature of object as a string.
   */
  sign(privatekey, content) {
    var KeyPairLibrary = require('./signing/KeyPair.js');
    var KeyPair = new KeyPairLibrary();
    var kp = KeyPair.create(this.fixpkey(privatekey));
    var signature = kp.sign(content).toString();
    return signature;
  }


  /**
   * calcFee - Calculate the minimum fee of a transaction.
   *
   * @param  {string} type       Type of transaction (transfer, multisig, etc).
   * @param  {object} options    Options object which contains more information about the transaction.
   * @return {integer}           The fee in XEM that needs to be paid.
   */
  calcFee(type, options) {
    // TODO: Finish this.
  }


  /**
   * signTransaction - description
   *
   * @param  {string} privatekey Private key in hex format.
   * @param  {object} options    Object with all the transaction options.
   * @return {object}            Object that contains the signature and rawbytes.
   */
  signTransaction(privatekey, options) {

  }

}
