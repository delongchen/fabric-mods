import { FabricMod, SideType } from "../types/FabricMod";
import AdmZip = require("adm-zip");
declare type ModMap = Map<string, FabricMod>;
declare const fileToModMap: Map<string, string>;
declare const existMods: Set<string>;
interface ModsStoreRecord {
    mods: ModMap;
    zip: AdmZip;
}
declare class ModsStore {
    static [SideType.server]: ModsStoreRecord;
    static [SideType.client]: ModsStoreRecord;
    static [SideType.both]: ModsStoreRecord;
    static deleteMod(modId: string): FabricMod;
    static addMod(mod: FabricMod): void;
}
declare function deleteMods(toDelete: string[]): void;
declare function addMods(toAdd: FabricMod[]): void;
declare type UpdateAction = "add" | "del";
declare type AutoUpdateHook = (action: UpdateAction, changeMods: FabricMod[]) => void;
declare const useAutoUpdate: (hook: AutoUpdateHook) => number;
export { fileToModMap, existMods, deleteMods, addMods, useAutoUpdate, ModsStore };
