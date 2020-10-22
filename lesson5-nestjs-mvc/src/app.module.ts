import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseController } from './purchase/purchase.controller';

@Module({
  imports: [],
  controllers: [AppController, PurchaseController],
  providers: [AppService],
})
export class AppModule {}
