"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toml_1 = require("toml");
const fs_1 = require("fs");
const config = (0, toml_1.parse)((0, fs_1.readFileSync)('src/config/config.toml', 'utf-8'));
exports.default = config;
//# sourceMappingURL=index.js.map