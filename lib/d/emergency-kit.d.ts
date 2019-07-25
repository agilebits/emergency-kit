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

declare module "emergency-kit" {
    export const create: (config: EmergencyKitConfig) => EmergencyKit;
    export default create;
}
