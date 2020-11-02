import { AppService } from './app.service';
import { PurchaseController } from './purchase/purchase.controller';
import { EventStoreService } from './common/event-store/event-store.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AllProjection_HandlePurchaseRefunded, AllProjection_HandlePurchaseMade } from './purchase/projections/all';
import { AvgCostProjection_HandlePurchaseMade } from './purchase/projections/avg-cost-report';
import { MakePurchaseHandler } from './purchase/commands/make-purchase/make-purchase.handler';
import { RefundPurchaseHandler } from './purchase/commands/refund/refund-purchase-handler';

@Module({
  imports: [CqrsModule],
  controllers: [PurchaseController],
  providers: [AppService, EventStoreService, MakePurchaseHandler, RefundPurchaseHandler, 
    AllProjection_HandlePurchaseRefunded, AllProjection_HandlePurchaseMade,
    AvgCostProjection_HandlePurchaseMade],
})
export class AppModule {}
