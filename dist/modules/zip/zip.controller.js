"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipController = void 0;
const common_1 = require("@nestjs/common");
const zip_service_1 = require("./zip.service");
function setDownloadHeader(res, name) {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${name}`);
}
const SideSet = new Set(['client', 'server', 'both']);
let ZipController = class ZipController {
    async zip(res, side) {
        if (!SideSet.has(side)) {
            res.json({
                status: 1,
                msg: 'fuck'
            });
        }
        else {
            setDownloadHeader(res, `${side}Mods.zip`);
            res.send((0, zip_service_1.getZip)(side));
        }
    }
};
__decorate([
    (0, common_1.Get)(':side'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('side')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ZipController.prototype, "zip", null);
ZipController = __decorate([
    (0, common_1.Controller)('/zip')
], ZipController);
exports.ZipController = ZipController;
//# sourceMappingURL=zip.controller.js.map