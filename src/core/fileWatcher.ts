import { watch } from 'fs'
import config from "../config";
import { loadMods } from "./loader";

export function startWatch() {
  watch(config.modsDir, loadMods)
}
