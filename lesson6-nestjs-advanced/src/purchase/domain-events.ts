import { DomainEvent } from 'src/common/domain-event';
import { UUID } from "src/common/basic-types";

export class PurchaseMade extends DomainEvent {
    static TypeName: string = 'PurchaseMade';
    PurchaseId: UUID;
    Amount: number;

    constructor(id: UUID, amount: number) {
        super();
        this.PurchaseId = id;
        this.Amount = amount;
    }
}

export class PurchaseRefunded extends DomainEvent {
    static TypeName: string = 'PurchaseRefunded';
    PurchaseId: UUID;

    constructor(id: UUID) {
        super();
        this.PurchaseId = id;
    }
}