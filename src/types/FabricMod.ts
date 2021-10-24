interface Contact {
  email?: string
  irc?: string
  homepage?: string
  issues?: string
  sources?: string
}

interface Author {
  name: string
  contact?: Contact
}

interface Entrypoint {
  main?: string[]
  client?: string[]
  server?: string[]
}

interface Jar {
  file: string
}

interface MixinConfig {
  config: string,
  environment: string
}

interface FabricModRaw {
  //Mandatory fields
  schemaVersion: number // Must always be 1
  id: string
  version: string

  //Metadata
  name: string
  description: string
  contact?: Contact
  authors: (string | Author)[]
  contributors?: (string | Author)[]
  license?: string | string[]
  icon?: string

  //Mod loading
  environment?: string
  entrypoint?: Entrypoint
  jars?: Jar[]
  mixins?: (string | MixinConfig)[]

  //Dependency resolution
  depends?: { [key: string]: string }
  suggests?: unknown

  //Custom
  custom?: any
}

interface FabricMod {
  modRaw: FabricModRaw
  mate: {
    file: string
  }
}

type SideType = 'client' | 'server' | 'both'

export {
  FabricModRaw,
  FabricMod,
  SideType
}
