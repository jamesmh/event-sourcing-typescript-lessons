import { EventStoreService } from './../../../common/event-store/event-store.service';
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs/dist/interfaces/commands/command-handler.interface";
import { MakePurchaseCommand } from "./make-purchase.command";
import { PurchaseMade } from 'src/purchase/domain-events';
import { v4 as createUuid } from 'uuid';


@CommandHandler(MakePurchaseCommand)
export class MakePurchaseHandler implements ICommandHandler<MakePurchaseCommand> {
    
    constructor(
        private readonly _store: EventStoreService,
        private readonly _bus: EventBus
        ) { }
    
    async execute(cmd: MakePurchaseCommand) {
        const evt: PurchaseMade = new PurchaseMade(createUuid(), cmd.amount);
        this._store.append(evt.PurchaseId, evt, PurchaseMade.TypeName);
        this._bus.publish(evt);

        console.log(`Purchase ${evt.PurchaseId} was made.`)
    }
}
