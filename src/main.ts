import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from "./config";
import { loadMods } from "./core/loader";
import { startWatch } from "./core/fileWatcher";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
  await loadMods()
  startWatch()
}

bootstrap();
