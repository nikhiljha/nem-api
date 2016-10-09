# nem-api
Advanced API Wrapper for the NIS Layer of the NEM Blockchain Platform

[![npm version](https://img.shields.io/npm/v/nem-api.svg?maxAge=2592000)](https://www.npmjs.com/package/nem-api) [![build status](https://travis-ci.org/nikhiljha/nem-api.svg?branch=master)](https://travis-ci.org/nikhiljha/nem-api) [![bitHound Overall Score](https://www.bithound.io/github/nikhiljha/nem-api/badges/score.svg)](https://www.bithound.io/github/nikhiljha/nem-api)

## Features

- Signing
- NIS Management
- Fully commented code for anyone to learn from!

## Installation

Just like anything else on npm, just do `npm install nem-api --save`.

## Usage Examples

This is incomplete, and more features are being added. It should be self explanatory if you read these examples and the code.



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
