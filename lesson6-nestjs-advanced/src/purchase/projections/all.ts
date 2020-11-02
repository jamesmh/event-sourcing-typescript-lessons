import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UUID } from "src/common/basic-types";
import { PurchaseMade, PurchaseRefunded } from "../domain-events";

export interface Purchase {
    Id: UUID;
    Amount: number;
    At: Date;
    WasRefunded: boolean;
}

class AllPurchasesProjection {
    private _purchases: Purchase[] = [];

    public get Purchases() {
        return this._purchases;
    }

    applyPurchaseRefunded(event: PurchaseRefunded) {
        this._purchases.find(p => p.Id === event.PurchaseId).WasRefunded = true;
    }

    applyPurchaseMade(event: PurchaseMade) {
        this._purchases.push({ Id: event.PurchaseId, Amount: event.Amount, At: new Date(event.At), WasRefunded: false });
    }
}

// Singleton for the purpose of our sample application.
export const allPurchasesProjection = new AllPurchasesProjection();

@EventsHandler(PurchaseRefunded)
export class AllProjection_HandlePurchaseRefunded implements IEventHandler<PurchaseRefunded> {
    handle(event: PurchaseRefunded) {
        allPurchasesProjection.applyPurchaseRefunded(event);
    }    
}

@EventsHandler(PurchaseMade)
export class AllProjection_HandlePurchaseMade implements IEventHandler<PurchaseMade> {
    handle(event: PurchaseMade) {
        allPurchasesProjection.applyPurchaseMade(event);
    }    
}

