"use strict";

/* 1Password Emergency Kit
 * 2.2.1
 * Author: Mitchell Cohen
*/

const EMERGENCY_KIT_VERSION = "V2";

import createPDFDocument from "./modules/draw.js";
import mixins from "./modules/mixins.js";

function emergencyKitTemplate({email, name, accountKey, domain, teamURL, qrCode = null}) {
    return {
        version: EMERGENCY_KIT_VERSION,
        createdAt: (new Date()).toLocaleDateString(),
        email,
        name,
        teamURL,
        domain,
        accountKey,
        qrCode
    };
}

class EmergencyKit {
    constructor(template) {
        this.template = template;
    }

    get filename() {
        return `1Password Emergency Kit-${this.template.domain}.pdf`;
    }

    pipe(stream) {
        return createPDFDocument(this.template, stream);
    }
}

function emergencyKit(config) {
    return new EmergencyKit(emergencyKitTemplate(config));
}

if (typeof exports === 'object') {
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
        // Make WebStream available for modules because we might
        // be using webpack
        Object.assign(EmergencyKit.prototype, mixins.WebStream);
    }
    else {
        Object.assign(EmergencyKit.prototype, mixins.FileStream);
    }
    module.exports = exports = emergencyKit;
}

var root = (
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof root !== 'undefined' && root) ||
    (typeof this !== 'undefined' && this)
);

if (typeof root !== 'undefined') {
    Object.assign(EmergencyKit.prototype, mixins.WebStream);
    root.emergencyKit = emergencyKit;
}
