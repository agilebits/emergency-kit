# The 1Password Emergency Kit

## How to use

The Emergency Kit has to be generated in a browser or web view. Import the file `./lib/emergency-kit.js`.

Here's a minimum viable example!


```
var k = new EmergencyKit({
    email: "wendyappleseed@me.com",
    name: "Wendy Appleseed",
    accountKey: "AK-123-456",
    domain: "my-domain",
    teamURL: "my-domain.1password.com",
    qrCode: "data:image/etc",
    filename: "1password.pdf"
});

k.getDownloadURL().then(function(url) {
    console.log('yo');
    document.write("<a target='_blank' href='" + url + "'>Download PDF</a>");
});
```

## QR code

You are responsible for supplying the `qrCode`. It should be a 144x144 image (PNG) passed in the form of a [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
