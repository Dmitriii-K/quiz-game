import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { appUse } from './app-use';
import { ConfigurationType } from './settings/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  appUse(app);
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings',{infer:true});

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Тестовый Swagger')
    .setDescription('Тестовое API')
    .setVersion('1.0')
    .addTag('BloggersPlatform')
    .addBasicAuth()  // Добавляем поддержку Basic Auth
    .addBearerAuth() // Добавляем поддержку Bearer Auth
    .addApiKey({ type: 'apiKey', name: 'refreshToken', in: 'cookie' }, 'refreshToken') // Добавляем поддержку API Key (Refresh Token)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // console.log(apiSettings.PORT)//----------------------
  await app.listen(apiSettings.PORT, () => {
    console.log(`Started at ${apiSettings.PORT} port`)
  });
}
bootstrap();