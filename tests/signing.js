module.exports = {
  test() {
    var nem = require('../src/nem-api.js');
    var nis = new nem(null);
    console.log(nis.sign("f4k3pr1v4t3k3y", "Hello Alice!"));
    nis.signTransaction();
    nis.calcFee();
    console.log("Signing tests finished.")
  }
}
