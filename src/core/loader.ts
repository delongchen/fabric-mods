import { opendir } from 'fs/promises'
import { FabricMod, FabricModRaw, SideType } from "../types/FabricMod";
import { existMods, deleteMods, addMods } from "./store";
import config from "../config";
import AdmZip = require('adm-zip')

const FABRIC_MOD_JSON = 'fabric.mod.json'

async function readModsDir() {
  const dir = await opendir(config.modsDir)
  const jars = new Set<string>()

  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.endsWith('.jar')) {
      jars.add(dirent.name)
    }
  }

  return jars
}

const getModEnv = (s: string): SideType => {
  switch (s) {
    case '*': return SideType.both
    case 'client': return SideType.client
    case 'sever': return SideType.server
    default: return SideType.both
  }
}

function loadOneMod(fileName: string) {
  return new Promise<FabricMod>((resolve, reject) => {
    const zip = new AdmZip(config.modsDir + fileName)
    const fabricModJSONS = zip.getEntry(FABRIC_MOD_JSON)
    if (fabricModJSONS) {
      fabricModJSONS.getDataAsync((data, err) => {
        if (err) reject(err)
        else {
          const json = data.toString()
          const modRaw = <FabricModRaw>JSON.parse(json)
          resolve({
            modRaw,
            mate: { file: fileName, side: getModEnv(modRaw.environment), zipData: zip.toBuffer()}
          })
        }
      })
    } else {
      reject(`nf ${fileName} `) //not a fabric mod
    }
  })
}

async function loadMods() {
  const jars = await readModsDir()
  const modsToLoad: string[] = []
  const modToDelete: string[] = []

  for (const existMod of existMods) {
    if (!jars.has(existMod)) modToDelete.push(existMod)
  }

  for (const jarName of jars) {
    if (!existMods.has(jarName)) modsToLoad.push(jarName)
  }

  deleteMods(modToDelete)

  const modsToAdd: FabricMod[] = []
  let promiseRoot = Promise.resolve()
  for (const toLoad of modsToLoad) {
    const cur = loadOneMod(toLoad)
      .then(mod => {
        modsToAdd.push(mod)
      })
      .catch(console.log)
    promiseRoot = promiseRoot.then(() => cur)
  }
  await promiseRoot
  addMods(modsToAdd)
}

export {
  loadMods
}
