import { Controller, Get, Res } from "@nestjs/common";
import { getMods } from "../../core/store";
import { Response } from "express";

@Controller('/info')
export class InfoController {
  @Get('mods')
  info(@Res() res: Response) {
    res.json(getMods('both'))
  }
}
