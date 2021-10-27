/// <reference types="node" />
import { FabricMod } from "../../types/FabricMod";
declare function createZipFile(mods: FabricMod[]): Buffer;
declare function getZip(side: string): Buffer;
export { createZipFile, getZip };
