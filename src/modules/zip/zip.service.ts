import { FabricMod, SideType } from "../../types/FabricMod";
import config from "../../config";
import { ModsStore, useAutoUpdate } from "../../core/store";
import { createLogger } from "bunyan";
import AdmZip  = require("adm-zip");
import Zip = require("adm-zip");

const logger = createLogger({
  name: 'Zip Service',
  stream: process.stdout
})

function createZipFile(mods: FabricMod[]) {
  const zip = new Zip()
  for (const mod of mods) {
    zip.addLocalFile(config.modsDir + mod.mate.file)
  }
  return zip.toBuffer()
}

const EMPTY_BUFFER = Buffer.from('')

const zipCache: { [key in SideType]: Buffer } = {
  [SideType.client]: EMPTY_BUFFER,
  [SideType.both]: EMPTY_BUFFER,
  [SideType.server]: EMPTY_BUFFER,
}

useAutoUpdate(() => {
  const sides = [SideType.client, SideType.both, SideType.server]

  for (const side of sides) {
    zipCache[side] = EMPTY_BUFFER
  }
})

const bothZip = ModsStore[SideType.both].zip

function getZip(side: string) {
  const getSidetype = (s: string) => {
    switch (s) {
      case 'client': return SideType.client
      case 'server': return SideType.server
      case 'both': return SideType.both
    }
  }

  logger.info('new get ' + side)
  const sideType = getSidetype(side)
  const cache = zipCache[sideType]

  if (cache === EMPTY_BUFFER) {
    const sideZip = ModsStore[sideType].zip.getEntries()
    const result = new AdmZip(bothZip.toBuffer())
    for (const entry of sideZip) {
      result.addFile(entry.name, entry.getData())
    }
    zipCache[sideType] = result.toBuffer()
  }

  return zipCache[sideType]
}

export {
  createZipFile,
  getZip
}
