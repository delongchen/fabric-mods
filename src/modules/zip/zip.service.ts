import { FabricMod, SideType } from "../../types/FabricMod";
import config from "../../config";
import Zip = require('adm-zip')
import { getMods } from "../../core/store";

function createZipFile(mods: FabricMod[]) {
  const zip = new Zip()
  for (const mod of mods) {
    zip.addLocalFile(config.modsDir + mod.mate.file)
  }
  return zip.toBuffer()
}

const EMPTY_BUFFER = Buffer.from('')
const zipCache = {
  server: EMPTY_BUFFER,
  client: EMPTY_BUFFER,
  both: EMPTY_BUFFER
}

function getZip(side: SideType) {
  const { mods, changed } = getMods(side)
  console.log(changed);
  if (changed) {
    zipCache[side] = createZipFile(mods)
  }
  return zipCache[side]
}

export {
  createZipFile,
  getZip
}
