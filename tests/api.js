module.exports = {
    test() {
        var nem = require("../src/index.js");
        var nis = new nem("http://go.nem.ninja:7890");
        nis.get("/account/get", {"address": "NAHPYR2PHSZ5MGXKQSW3HFDMIXM36JBHDHCPXDQB"}, function (response) {
            console.log(response.body);
        });
        nis.post("/account/unlocked/info", {}, function (response) {
            console.log(response.body);
        });
        console.log("It works!");
    }
};
