"use strict";

/* 1Password Emergency Kit
 * 2.2.1
 * Author: Mitchell Cohen
*/

const EMERGENCY_KIT_VERSION = "V2";

import moment from "moment";
import createPDFDocument from "./modules/draw.js";
import mixins from "./modules/mixins.js";

function emergencyKitTemplate({email, name, accountKey, domain, teamURL, qrCode = null}) {
    return {
        version: EMERGENCY_KIT_VERSION,
        createdAt: moment().format("MMMM Do, YYYY"),
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
    Object.assign(EmergencyKit.prototype, mixins.FileStream);
    module.exports = exports = emergencyKit;
} else {
    var root = window || global || root || this;
    Object.assign(EmergencyKit.prototype, mixins.WebStream);
    root.emergencyKit = emergencyKit;
}
