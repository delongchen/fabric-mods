import { Module } from '@nestjs/common';
import { ZipModule } from "./modules/zip/zip.module";
import { InfoModule } from "./modules/info/info.module";

@Module({
  imports: [
    ZipModule,
    InfoModule
  ]
})
export class AppModule {}
