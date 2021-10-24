import { parse } from 'toml'
import AppConfig from "../types/AppConfig";
import { readFileSync } from 'fs'

const config = <AppConfig>parse(
  readFileSync('src/config/config.toml', 'utf-8')
)

export default config
