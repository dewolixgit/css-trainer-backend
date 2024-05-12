import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesKeys } from './config/environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, '..', 'api-static'), {
    prefix: '/api-static',
  });

  const configService = app.get(ConfigService);

  await app.listen(Number(configService.get(EnvironmentVariablesKeys.port)));

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
