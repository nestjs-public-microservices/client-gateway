import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  //define variables
  const logger = new Logger('GATEWAY-MAIN');
  const port = envs.port;
  //define logic
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen(port);
  logger.log(`App running on port ${port}`);
}
bootstrap();
