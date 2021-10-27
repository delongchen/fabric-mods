import { Controller, Get, Res, Param } from "@nestjs/common";
import { getZip } from "./zip.service";
import { Response } from "express";

function setDownloadHeader(res: Response, name: string) {
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', `attachment; filename=${name}`)
}

const SideSet = new Set(['client', 'server', 'both'])

@Controller('/zip')
export class ZipController {
  @Get(':side')
  async zip(@Res() res: Response, @Param('side') side: string) {
    if (!SideSet.has(side)) {
      res.json({
        status: 1,
        msg: 'fuck'
      })
    } else {
      setDownloadHeader(res, `${side}Mods.zip`)
      res.send(getZip(side))
    }
  }
}
