import { FabricMod, SideType } from "../types/FabricMod";
import AdmZip = require("adm-zip");
import config from "../config";
import { createLogger } from "bunyan";

type ModMap = Map<string, FabricMod>

const fileToModMap = new Map<string, string>();
const existMods = new Set<string>();
const logger = createLogger({
  name: "Mods Store",
  stream: process.stdout
});

const modMaps: ModMap[] = [
  new Map<string, FabricMod>(),
  new Map<string, FabricMod>(),
  new Map<string, FabricMod>()
];
const zips: AdmZip[] = [new AdmZip, new AdmZip, new AdmZip];

const [server, client, both] = modMaps;
const [serverZip, clientZip, bothZip] = zips;

interface ModsStoreRecord {
  mods: ModMap,
  zip: AdmZip
}

class ModsStore {
  static [SideType.server]: ModsStoreRecord = { mods: server, zip: serverZip };
  static [SideType.client]: ModsStoreRecord = { mods: client, zip: clientZip };
  static [SideType.both]: ModsStoreRecord = { mods: both, zip: bothZip };

  static deleteMod(modId: string) {
    const mod = both.get(modId);
    if (mod) {
      const { side, file: fileName } = mod.mate;
      const { mods, zip } = ModsStore[side];
      mods.delete(mod.modRaw.id);
      zip.deleteFile(zip.getEntry(fileName));
    }
    return mod;
  }

  static addMod(mod: FabricMod) {
    const { side, file: fileName, zipData } = mod.mate;
    const { mods, zip } = ModsStore[side];
    mods.set(mod.modRaw.id, mod);
    zip.addFile(fileName, zipData);
  }
}

function deleteMods(toDelete: string[]) {
  if (toDelete.length) {
    const deletedMods: FabricMod[] = [];
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

function addMods(toAdd: FabricMod[]) {
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

type UpdateAction = "add" | "del"
type AutoUpdateHook = (action: UpdateAction, changeMods: FabricMod[]) => void
const updateList: AutoUpdateHook[] = [];
const doUpdate = (action: UpdateAction, changeMods: FabricMod[]) => {
  updateList.forEach(it => it(action, changeMods));
  logger.info({ action, mods: changeMods.map(it => it.modRaw.name), all: changeMods.length });
};
const useAutoUpdate = (hook: AutoUpdateHook) => updateList.push(hook);

export {
  fileToModMap,
  existMods,
  deleteMods,
  addMods,
  useAutoUpdate,
  ModsStore
};
