import { Injectable } from "@nestjs/common";
import { ModsStore, useAutoUpdate } from "../../core/store";
import { SideType } from "../../types/FabricMod";

let infoCache: Buffer | null = null

useAutoUpdate(() => {
  infoCache = null
})

@Injectable()
export class InfoService {
  getInfos() {
    if (infoCache === null) {
      infoCache = Buffer.from(
        JSON.stringify([...(ModsStore[SideType.both].mods.values())])
      )
    }
    return infoCache
  }
}
