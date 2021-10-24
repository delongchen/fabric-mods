import { Module } from "@nestjs/common";
import { ZipController } from "./zip.controller";

@Module({
  controllers: [ZipController]
})
export class ZipModule {}
