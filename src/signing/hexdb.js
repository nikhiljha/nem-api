// hexdb
// A library to convert human rememberable codes into hex used by transactions.

module.exports = class meme {
  getType(type) {
    switch(type) {
      case 'transfer':
        return 0x0101;
        break;
      default:
        return null;
    }
  }

  getVersion() {

  }

  getTime() {

  }

  getDeadline() {

  }
};
