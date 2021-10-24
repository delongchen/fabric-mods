import { FabricMod, SideType } from "../types/FabricMod";

const fileToModMap = new Map<string, string>();
const modsMap = new Map<string, FabricMod>();
const existMods = new Set<string>();
const status = {
  changed: {
    server: true,
    client: true
  }
}

const modsStore = {
  server: <FabricMod[]>[],
  client: <FabricMod[]>[],
  uk: <FabricMod[]>[],
  all: <FabricMod[]>[]
};

function setChanged(mod: FabricMod) {
  status.changed[
    (mod.modRaw.environment === 'client' ? 'client' : 'server')
    ] = true
}

function deleteMods(toDelete: string[]) {
  if (toDelete.length) {
    for (const modName of toDelete) {
      const modId = fileToModMap.get(modName);
      const mod = modsMap.get(modId)

      if (modId) {
        console.log(`delete ${mod.modRaw.name}`);
        existMods.delete(modName);
        fileToModMap.delete(modName);
        modsMap.delete(modId);
        setChanged(mod)
      }
    }
  }
}

function addMods(toAdd: FabricMod[]) {
  if (toAdd.length) {
    for (const mod of toAdd) {
      console.log(`load ${mod.modRaw.name}`);
      const fileName = mod.mate.file;
      const modId = mod.modRaw.id;
      existMods.add(fileName);
      fileToModMap.set(fileName, modId);
      modsMap.set(modId, mod);
      setChanged(mod)
    }
  }
}

function freshMods() {
  const mods = Array.from(modsMap.values());
  const { server, client, uk } = modsStore;
  server.length = 0
  client.length = 0
  uk.length = 0
  modsStore.all = mods

  for (const mod of mods) {
    const env = mod.modRaw.environment;
    if (env) {
      switch (env) {
        case "*":
          server.push(mod);
          client.push(mod);
          break;
        case "server":
          server.push(mod);
          break;
        case "client":
          client.push(mod);
          break;
        default:
          uk.push(mod);
      }
    } else {
      client.push(mod);
      server.push(mod);
      uk.push(mod);
    }
  }

  status.changed.server = false
  status.changed.client = false
}

function getMods(side: SideType): { mods: FabricMod[], changed: boolean } {
  if (side === 'both') {
    const changed = status.changed.server || status.changed.client
    if (changed) freshMods()
    return { mods: modsStore.all, changed }
  } else {
    const changed = status.changed[side]
    if (changed) freshMods()
    return { mods: modsStore[side], changed }
  }
}

export {
  fileToModMap,
  modsMap,
  existMods,
  deleteMods,
  addMods,
  status,
  modsStore,
  freshMods,
  getMods
};
