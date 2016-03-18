"use strict";

import stream from "stream";

function createUint8ArrayStream() {
    return new stream.Transform({
        transform(chunk, encoding, next) {
            if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);
            this.push(chunk);
            next();
        },
        flush(done) {
            done();
        }
    });
}

function blobFromUint8ArrayStream(stream, {type = 'application/octet-stream'}) {
    let buffer = [];
    return new Promise( (fulfill) => {
        stream.on("data", function (n) {
            buffer.push(n);
        }).on("finish", function (n) {
            fulfill(new Blob(buffer, {type}));
        });
    });
}

let streams = {};
Object.assign(streams, {createUint8ArrayStream, blobFromUint8ArrayStream});

export default streams;
