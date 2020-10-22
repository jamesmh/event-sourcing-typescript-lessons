import { PurchaseRefunded } from './../types';
import { Meta, PurchaseMade, UUID } from '../types'

export interface Purchase {
    Id: UUID;
    Amount: number;
    At: Date;
    WasRefunded: boolean;
}

export class AllPurchasesProjection {
    private _purchases: Purchase[] = [];

    public get Purchases() {
        return this._purchases;
    }

    apply(events: Meta[]){
        for(const meta of events) {
            switch(meta.Type) {
                case PurchaseMade.TypeName:
                    this.applyPurchaseMade(meta.Event as PurchaseMade);
                    break;
                case PurchaseRefunded.TypeName:
                    this.applyPurchaseRefunded(meta.Event as PurchaseRefunded);
                    break;
            }
        }
    }
    applyPurchaseRefunded(event: PurchaseRefunded) {
        this._purchases.find(p => p.Id === event.PurchaseId).WasRefunded = true;
    }

    private applyPurchaseMade(event: PurchaseMade) {
        this._purchases.push({ Id: event.PurchaseId, Amount: event.Amount, At: new Date(event.At), WasRefunded: false });
    }
}