/// <reference types="node" />
interface Contact {
    email?: string;
    irc?: string;
    homepage?: string;
    issues?: string;
    sources?: string;
}
interface Author {
    name: string;
    contact?: Contact;
}
interface Entrypoint {
    main?: string[];
    client?: string[];
    server?: string[];
}
interface Jar {
    file: string;
}
interface MixinConfig {
    config: string;
    environment: string;
}
interface FabricModRaw {
    schemaVersion: number;
    id: string;
    version: string;
    name: string;
    description: string;
    contact?: Contact;
    authors: (string | Author)[];
    contributors?: (string | Author)[];
    license?: string | string[];
    icon?: string;
    environment?: string;
    entrypoint?: Entrypoint;
    jars?: Jar[];
    mixins?: (string | MixinConfig)[];
    depends?: {
        [key: string]: string;
    };
    suggests?: unknown;
    custom?: any;
}
interface FabricMod {
    modRaw: FabricModRaw;
    mate: {
        file: string;
        side: SideType;
        zipData: Buffer;
    };
}
declare enum SideType {
    client = 0,
    server = 1,
    both = 2
}
export { FabricModRaw, FabricMod, SideType };
