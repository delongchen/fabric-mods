import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ModsStore } from "../../core/store";
import { SideType } from "../../types/FabricMod";
import { InfoService } from "./info.service";

@Controller('/info')
export class InfoController {
  private readonly infoService

  constructor(infoService: InfoService) {
    this.infoService = infoService
  }

  @Get('mods')
  info(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/json')
    res.send(this.infoService.getInfos())
  }
}
