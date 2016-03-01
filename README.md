# The 1Password Emergency Kit

It's not just for browsers anymore!

## How to use

You can generate Emergency Kits two ways: from a node app, or in a browser or web view.

### node (native client)

The Emergency Kit takes advantage of ES6 features. Use the most recent versions of node.


```javascript
"use strict";

let emergencyKit = require("./lib/emergency-kit-node.js");
let filename = "1Password.pdf";

let k = emergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "appleseed",
    teamURL: "appleseed.1password.com",
    //qrCode: image-data
});

let start = Date.now();
k.toFile(filename).on("finish", () => {
    let end = Date.now();
    console.log("Emergency Kit rendered in " + (end - start) + " ms.");
});
```

### Browser or web view

Run `npm install` and `npm run browserify` to generate the browser library.


 ```html
<script src="/lib/emergency-kit.js"></script>

<script>
var k = emergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "my-domain",
    teamURL: "my-domain.1password.com",
    //qrCode: image-data
});

let start = Date.now();
k.toURL().then(function(url) {
    let end = Date.now();
    console.log("Emergency Kit rendered in " + (end - start) + " ms.");
    document.write("<a target='_blank' href='" + url + "'>Download PDF</a>");
});
</script>
```

## QR code

This library does not generate QR codes. You are responsible for supplying one with the `qrCode` parameter. It should be a 144x144 image (PNG) passed in the form of a [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
