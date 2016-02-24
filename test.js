var EmergencyKit = require("./index.js");

var k = new EmergencyKit({
    email: "mitch.cohen@me.com",
    name: "Mitchell Cohen",
    accountKey: "AK-123-456",
    domain: "gatitos",
    teamURL: "gatitos.1password.com",
    dataURL: "blah",
    filename: "1password.pdf"
});

console.log(k.getDownloadURL());