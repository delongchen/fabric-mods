"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWatch = void 0;
const fs_1 = require("fs");
const config_1 = require("../config");
const loader_1 = require("./loader");
function startWatch() {
    (0, fs_1.watch)(config_1.default.modsDir, loader_1.loadMods);
}
exports.startWatch = startWatch;
//# sourceMappingURL=fileWatcher.js.map