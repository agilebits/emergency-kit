interface EmergencyKitConfig {
    email: string;
    name: string;
    accountKey: string;
    domain: string;
    teamURL: string;
    qrCode?: any;
}

interface EmergencyKit {
    toBlob(): Promise<Blob>;
    toURL(): Promise<string>;
}

interface EmergencyKitStatic {
    (config: EmergencyKitConfig): EmergencyKit
}

declare namespace _ek {
    var emergencyKit: EmergencyKitStatic;
}

declare module "emergency-kit" {
    export = _ek.emergencyKit;
}
