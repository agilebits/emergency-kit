# The 1Password Emergency Kit

It's not just for browsers anymore!

## How to use

You can generate Emergency Kits two ways: from a node app, or in a browser or web view.

### node (native client)

The Emergency Kit takes advantage of ES6 features. Use the most recent versions of node.

```
"use strict";

const EmergencyKit = require("./index.js");

let k = new EmergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "appleseed",
    teamURL: "appleseed.1password.com",
    filename: "1password.pdf"
    //qrCode: image-data
});

k.toDisk(); // Will produce "1password.pdf" in the active directory
```

### Browser or web view

Run `npm install` and `npm run browserify` to generate the browser library.

 ```
<script src="/lib/emergency-kit.js"></script>

<script>
var k = new EmergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "my-domain",
    teamURL: "my-domain.1password.com",
    filename: "1password.pdf"
    //qrCode: image-data
});

k.getDownloadURL().then(function(url) {
    console.log('yo');
    document.write("<a target='_blank' href='" + url + "'>Download PDF</a>");
});
</script>
```

## QR code

This library does not generate QR codes. You are responsible for supplying one with the `qrCode` parameter. It should be a 144x144 image (PNG) passed in the form of a [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
