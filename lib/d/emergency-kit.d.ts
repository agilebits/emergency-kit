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

declare var emergencyKit: EmergencyKitStatic;
