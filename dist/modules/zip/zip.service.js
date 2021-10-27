"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZip = exports.createZipFile = void 0;
const FabricMod_1 = require("../../types/FabricMod");
const config_1 = require("../../config");
const store_1 = require("../../core/store");
const bunyan_1 = require("bunyan");
const AdmZip = require("adm-zip");
const Zip = require("adm-zip");
const logger = (0, bunyan_1.createLogger)({
    name: 'Zip Service',
    stream: process.stdout
});
function createZipFile(mods) {
    const zip = new Zip();
    for (const mod of mods) {
        zip.addLocalFile(config_1.default.modsDir + mod.mate.file);
    }
    return zip.toBuffer();
}
exports.createZipFile = createZipFile;
const EMPTY_BUFFER = Buffer.from('');
const zipCache = {
    [FabricMod_1.SideType.client]: EMPTY_BUFFER,
    [FabricMod_1.SideType.both]: EMPTY_BUFFER,
    [FabricMod_1.SideType.server]: EMPTY_BUFFER,
};
(0, store_1.useAutoUpdate)(() => {
    const sides = [FabricMod_1.SideType.client, FabricMod_1.SideType.both, FabricMod_1.SideType.server];
    for (const side of sides) {
        zipCache[side] = EMPTY_BUFFER;
    }
});
const bothZip = store_1.ModsStore[FabricMod_1.SideType.both].zip;
function getZip(side) {
    const getSidetype = (s) => {
        switch (s) {
            case 'client': return FabricMod_1.SideType.client;
            case 'server': return FabricMod_1.SideType.server;
            case 'both': return FabricMod_1.SideType.both;
        }
    };
    logger.info('new get ' + side);
    const sideType = getSidetype(side);
    const cache = zipCache[sideType];
    if (cache === EMPTY_BUFFER) {
        const sideZip = store_1.ModsStore[sideType].zip.getEntries();
        const result = new AdmZip(bothZip.toBuffer());
        for (const entry of sideZip) {
            result.addFile(entry.name, entry.getData());
        }
        zipCache[sideType] = result.toBuffer();
    }
    return zipCache[sideType];
}
exports.getZip = getZip;
//# sourceMappingURL=zip.service.js.map