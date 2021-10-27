import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ModsStore } from "../../core/store";
import { SideType } from "../../types/FabricMod";

@Controller('/info')
export class InfoController {
  @Get('mods')
  info(@Res() res: Response) {
    res.json([...ModsStore[SideType.both].mods.values()])
  }
}
