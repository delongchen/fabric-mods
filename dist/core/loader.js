"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMods = void 0;
const promises_1 = require("fs/promises");
const FabricMod_1 = require("../types/FabricMod");
const store_1 = require("./store");
const config_1 = require("../config");
const AdmZip = require("adm-zip");
const FABRIC_MOD_JSON = 'fabric.mod.json';
async function readModsDir() {
    const dir = await (0, promises_1.opendir)(config_1.default.modsDir);
    const jars = new Set();
    for await (const dirent of dir) {
        if (dirent.isFile() && dirent.name.endsWith('.jar')) {
            jars.add(dirent.name);
        }
    }
    return jars;
}
const getModEnv = (s) => {
    switch (s) {
        case '*': return FabricMod_1.SideType.both;
        case 'client': return FabricMod_1.SideType.client;
        case 'sever': return FabricMod_1.SideType.server;
        default: return FabricMod_1.SideType.both;
    }
};
function loadOneMod(fileName) {
    return new Promise((resolve, reject) => {
        const zip = new AdmZip(config_1.default.modsDir + fileName);
        const fabricModJSONS = zip.getEntry(FABRIC_MOD_JSON);
        if (fabricModJSONS) {
            fabricModJSONS.getDataAsync((data, err) => {
                if (err)
                    reject(err);
                else {
                    const json = data.toString();
                    const modRaw = JSON.parse(json);
                    resolve({
                        modRaw,
                        mate: { file: fileName, side: getModEnv(modRaw.environment), zipData: zip.toBuffer() }
                    });
                }
            });
        }
        else {
            reject(`nf ${fileName} `);
        }
    });
}
async function loadMods() {
    const jars = await readModsDir();
    const modsToLoad = [];
    const modToDelete = [];
    for (const existMod of store_1.existMods) {
        if (!jars.has(existMod))
            modToDelete.push(existMod);
    }
    for (const jarName of jars) {
        if (!store_1.existMods.has(jarName))
            modsToLoad.push(jarName);
    }
    (0, store_1.deleteMods)(modToDelete);
    const modsToAdd = [];
    let promiseRoot = Promise.resolve();
    for (const toLoad of modsToLoad) {
        const cur = loadOneMod(toLoad)
            .then(mod => {
            modsToAdd.push(mod);
        })
            .catch(console.log);
        promiseRoot = promiseRoot.then(() => cur);
    }
    await promiseRoot;
    (0, store_1.addMods)(modsToAdd);
}
exports.loadMods = loadMods;
//# sourceMappingURL=loader.js.map