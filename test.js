var nemapi = require('./index.js');
var bob = new nemapi('http://san.nem.ninja:7890');

bob.get('/account/generate', null, function(response) {
  console.log(response.body.address);
});
