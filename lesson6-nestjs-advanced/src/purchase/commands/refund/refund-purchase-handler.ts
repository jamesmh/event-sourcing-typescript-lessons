import { RefundPurchaseCommand } from './refund-purchase.command';
import { EventStoreService } from '../../../common/event-store/event-store.service';
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs/dist/interfaces/commands/command-handler.interface";
import { PurchaseRefunded } from 'src/purchase/domain-events';


@CommandHandler(RefundPurchaseCommand)
export class RefundPurchaseHandler implements ICommandHandler<RefundPurchaseCommand> {
    
    constructor(
        private readonly _store: EventStoreService,
        private readonly _bus: EventBus
        ) { }
    
    async execute(cmd: RefundPurchaseCommand) {
        // Notice, that instead of "UPDATE" 'ing a table row we
        // append a new event to the ledger!
        const evt: PurchaseRefunded = new PurchaseRefunded(cmd.id);
        this._store.append(evt.PurchaseId, evt, PurchaseRefunded.TypeName);
        this._bus.publish(evt);
    }
}
