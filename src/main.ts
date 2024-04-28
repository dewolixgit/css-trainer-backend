import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesKeys } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  await app.listen(Number(configService.get(EnvironmentVariablesKeys.port)));

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
