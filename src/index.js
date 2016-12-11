"use strict";

const unirest = require("unirest");
const stomp = require('stompjs');

const Transactions = require("./signing/Transactions.js");
const Converting = require("./signing/convert.js");

const txn = new Transactions("doesnt", "matter");
const convert = new Converting();

module.exports = class nisapi {

  /**
   * constructor - Give the object an NIS URL to interact with.
   *
   * @param {string} endpoint HTTP formatted base URL of the NIS, including port.
   */
    constructor(endpoint) {
        if (endpoint) {
            this.hasNetwork = true;
            if (endpoint.slice(-1).match(/[/\\]/)) {
                this.endpoint = endpoint.slice(0, -1);
                this.socketpt = "ws:" + this.endpoint.replace(/[^/]*/, "").replace(/:.{4}/, ":7778");
            } else {
                this.endpoint = endpoint;
                this.socketpt = "ws:" + this.endpoint.replace(/[^/]*/, "").replace(/:.{4}/, ":7778");
            }
        } else {
            this.hasNetwork = false;
        }
    }

  /**
   * asuri - Given JSON, convert to URL syntax.
   *
   * @param  {string} data JSON formatted data
   * @return {string}      URI formatted arguments
   */
    asuri(data) {
        var url = "";
        for (var prop in data) {
            url += encodeURIComponent(prop) + "=" +
             encodeURIComponent(data[prop]) + "&";
        }
        return "?" + url.substring(0, url.length - 1);
    }

    hex2text(hexx) {
        var hex = hexx.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
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
    .headers({"Accept":"application/json", "Content-Type":"application/json"})
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
    .headers({"Accept":"application/json", "Content-Type":"application/json"})
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
        return ("0000000000000000000000000000000000000000000000000000000000000000" +
      privatekey.replace(/^00/, "")).slice(-64);
    }


  /**
   * sign - Sign a given object with a given private key.
   *
   * @param  {string} privatekey Private key of NEM account in hex.
   * @param  {object} content    Thing that you want to sign.
   * @return {string}            Signature of object as a string.
   */
    sign(privatekey, content) {
        var KeyPairLibrary = require("./signing/KeyPair.js");
        var KeyPair = new KeyPairLibrary();
        var kp = KeyPair.create(this.fixpkey(privatekey));
        var signature = kp.sign(content).toString();
        return signature;
    }


  /**
   * makeTX - Make a transaction given a transaction object and a private key.
   *
   * @param  {txobject} options    Transaction object.
   * @param  {String} privatekey   A private NEM key.
   * @return {parsedtxobject}      An object ready to be signTX'd.
   */
    makeTX(options, privatekey) {
        var transaction = txn.prepareTransfer({"privatekey": privatekey}, options);
        return transaction;
    }

  /**
   * signTX - Sign a parsedtxobject into a ready to send transaction announce.
   *
   * @param  {parsedtxobject} transaction A transaction parsed with makeTX.
   * @param  {String} privatekey         A private NEM key.
   * @return {announceobject}             An object ready to /announce.
   */
    signTX(transaction, privatekey) {
        var KeyPairLibrary = require("./signing/KeyPair.js");
        var KeyPair = new KeyPairLibrary();

        var kp = KeyPair.create(this.fixpkey(privatekey));
        var rawbytes = txn.serializeTransaction(transaction);
        var signedbytes = kp.sign(rawbytes);
        var signed = {"data": convert.ua2hex(rawbytes), "signature": signedbytes.toString()};
        return signed;
    }


  /**
   * doTX - Fully completes a transaction with makeTX and signTX, then sends.
   *
   * @param  {txobject} options    Unparsed transaction object.
   * @param  {String} privatekey   A private NEM key.
   * @param  {callback} callback   Same callback as post();
   */
    doTX(options, privatekey, callback) {
        var transaction = this.makeTX(options, privatekey);
        var transactionobject = this.signTX(transaction, privatekey);
        this.post("/transaction/announce", transactionobject, callback);
    }


  /**
   * setEndpoint - Set the endpoint of the NIS instance.
   *
   * @param  {String} privatekey   A private NEM key.
   */
    setEndpoint(endpoint) {
        if (endpoint.slice(-1).match(/[/\\]/)) {
           this.endpoint = endpoint.slice(0, -1);
        } else {
           this.endpoint = endpoint;
        }
           this.socketpt = "ws:" + this.endpoint.replace(/[^/]*/, "").replace(/:.{4}/, ":7778");
    }

  /**
   * connectWS - Connects to the websocket provider of the current endpoint.
   *
   * @param  {callback} success   Success callback.
   * @param  {callback} fail      Failure callback.
   */
    connectWS(success, fail) {
        var endpoint = this.socketpt + '/w/messages/websocket';
        this.wsclient = stomp.overWS(endpoint.toString());
        this.wsclient.connect({}, {}, success, fail);
    }

  /**
   * connectWS - Connects to the websocket provider of the current endpoint.
   *
   * @param  {callback} subscription  URL Path you want to sub to. Example: /blocks/new
   * @param  {callback} callback      Callback to run when something is recieved.
   */
    subscribeWS(subscription, callback) {
        return this.wsclient.subscribe(subscription, callback);
    }

};
