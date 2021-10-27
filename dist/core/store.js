"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModsStore = exports.useAutoUpdate = exports.addMods = exports.deleteMods = exports.existMods = exports.fileToModMap = void 0;
const FabricMod_1 = require("../types/FabricMod");
const AdmZip = require("adm-zip");
const bunyan_1 = require("bunyan");
const fileToModMap = new Map();
exports.fileToModMap = fileToModMap;
const existMods = new Set();
exports.existMods = existMods;
const logger = (0, bunyan_1.createLogger)({
    name: "Mods Store",
    stream: process.stdout
});
const modMaps = [
    new Map(),
    new Map(),
    new Map()
];
const zips = [new AdmZip, new AdmZip, new AdmZip];
const [server, client, both] = modMaps;
const [serverZip, clientZip, bothZip] = zips;
class ModsStore {
    static [FabricMod_1.SideType.server] = { mods: server, zip: serverZip };
    static [FabricMod_1.SideType.client] = { mods: client, zip: clientZip };
    static [FabricMod_1.SideType.both] = { mods: both, zip: bothZip };
    static deleteMod(modId) {
        const mod = both.get(modId);
        if (mod) {
            const { side, file: fileName } = mod.mate;
            const { mods, zip } = ModsStore[side];
            mods.delete(mod.modRaw.id);
            zip.deleteFile(zip.getEntry(fileName));
        }
        return mod;
    }
    static addMod(mod) {
        const { side, file: fileName, zipData } = mod.mate;
        const { mods, zip } = ModsStore[side];
        mods.set(mod.modRaw.id, mod);
        zip.addFile(fileName, zipData);
    }
}
exports.ModsStore = ModsStore;
function deleteMods(toDelete) {
    if (toDelete.length) {
        const deletedMods = [];
        for (const modName of toDelete) {
            const modId = fileToModMap.get(modName);
            if (modId) {
                existMods.delete(modName);
                fileToModMap.delete(modName);
                const deletedMod = ModsStore.deleteMod(modId);
                deletedMods.push(deletedMod);
            }
        }
        doUpdate("del", deletedMods);
    }
}
exports.deleteMods = deleteMods;
function addMods(toAdd) {
    if (toAdd.length) {
        for (const mod of toAdd) {
            const { file: fileName } = mod.mate;
            const modId = mod.modRaw.id;
            existMods.add(fileName);
            fileToModMap.set(fileName, modId);
            ModsStore.addMod(mod);
        }
        doUpdate("add", toAdd);
    }
}
exports.addMods = addMods;
const updateList = [];
const doUpdate = (action, changeMods) => {
    updateList.forEach(it => it(action, changeMods));
    logger.info({ action, mods: changeMods.map(it => it.modRaw.name), all: changeMods.length });
};
const useAutoUpdate = (hook) => updateList.push(hook);
exports.useAutoUpdate = useAutoUpdate;
//# sourceMappingURL=store.js.map