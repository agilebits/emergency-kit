"use strict";

/* 1Password Emergency Kit
 * 2.4.0
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

if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
    Object.assign(EmergencyKit.prototype, mixins.WebStream);
}
else {
    Object.assign(EmergencyKit.prototype, mixins.FileStream);
}

export const create = (config) => {
    return new EmergencyKit(emergencyKitTemplate(config));
}

export default create;
