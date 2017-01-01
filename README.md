# nem-api
Advanced API Wrapper for the NIS Layer of the NEM Blockchain Platform

[![npm version](https://img.shields.io/npm/v/nem-api.svg?maxAge=2592000)](https://www.npmjs.com/package/nem-api) [![build status](https://travis-ci.org/nikhiljha/nem-api.svg?branch=master)](https://travis-ci.org/nikhiljha/nem-api)

## Features

IMPORTANT: Are you a buisness looking to build on NEM? Do your research first, it probably isn't for you.

- Signing
- NIS Management
- Fully commented code for anyone to learn from!

## Installation

Just like anything else on npm, just do `npm install nem-api --save`.

## Usage Examples

This is incomplete, and more features are being added. It should be fairly simple if you read these examples and the code.



### Initialization
```
var nemapi = require('nem-api');
var san = new nemapi('http://san.nem.ninja:7890');
```

The API URL can be null if you just want signing. In fact, a lot of things can be null, everything is properly handled.

### Signing
```
var signature = san.sign(hexPrivateKey, thingToSign);
console.log(signature);
```

### Verifying
TODO: Implement verifying, when it's done it'll probably look like this.
```
if (san.verify(thingThatWasSigned, hexPublicKey)) {
  console.log("Signature checks out!");
} else {
  console.log("Bad signature! Is it an impostor?!?!?");
}
```

### NIS Requests
```
san.get('/account/get', {'address': 'YOUR_ADDRESS'}, function(response) {
  console.log(response.body);
});
```

For post requests just use `san.post`. Note that `response.body` is a javascript object already, and does not need to be parsed in order to access the insides.

### Making a Transaction Object

A transaction object looks like this.

```
var txobject = {
  'isMultisig': false,
  'recipient': "TXXX-XXXX-XXXX-XXX", // Dashes optional, all parsed later.
  'amount': 1, // Amount of XEM to send.
  'message': 'Hello reciever!', // Message to send.
  'due': 60 // Not sure what this does but the default is probably fine.
}
```

You can send this transaction in a couple ways.

You can make it, serialize it, then send it yourself.

```
var transaction = this.makeTX(transactionobject, privatekey);
var transactionobject = this.signTX(transaction, privatekey);
this.post('/transaction/announce', transactionobject, callback);
```

Or you can just give it to the `doTX()` function and it'll handle that all for you.

```
san.doTX(transactionobject, privatekey, callback);
```

The callback is a regular `post()` callback, so it is passed an object called
response, which contains response.body (parsed JSON).

### Using WebSockets

Have an example, it should be self explanatory.

This does not work on web. For web you do the same thing in my code except you 

```
var nem = require('nem-api');
var bob = new nem("http://bob.nem.ninja:7890/")

function getNewBlocks() {
    var thing = bob.subscribeWS("/blocks/new", function(message) {
        console.log(message.body);
    });
    // Later you can thing.unsubscribe(); so keep this object safe.
}

bob.connectWS(function () {
    getNewBlocks();
}, function() {
  console.log("This runs in case of a failure.");
});
```

## Donations

I'd love donations for this project especially if you make money by using it.

Donation Counter: 0 XEM / 0.000 BTC

XEM: NCICWX-TT6FQE-UUFE2Z-ZGV67I-4BNSUC-J4K2ZI-UV32 / BTC: 1KQ41VXJkMBdd6Fcj23pdTqnevhXt2NVvv