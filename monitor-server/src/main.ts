import { NestFactory } from '@nestjs/core'; //创建 Nest 应用程序的实例
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  await app.listen(3200);
}
bootstrap();
