"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("./config");
const loader_1 = require("./core/loader");
const fileWatcher_1 = require("./core/fileWatcher");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(config_1.default.port);
    await (0, loader_1.loadMods)();
    (0, fileWatcher_1.startWatch)();
}
bootstrap();
//# sourceMappingURL=main.js.map