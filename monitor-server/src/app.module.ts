import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedantsTypeModule } from './pedants-type/pedants-type.module';
import { ErrorCollectionController } from './error-collection/error-collection.controller';
import { ErrorCollectionModule } from './error-collection/error-collection.module';

@Module({
  imports: [PedantsTypeModule, ErrorCollectionModule],
  controllers: [AppController, ErrorCollectionController],
  providers: [AppService],
})
export class AppModule {}
