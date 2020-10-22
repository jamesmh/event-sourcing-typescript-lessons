import { v4 as createUuid } from 'uuid';

/**
 * Some Base Types
 */

export type UUID = string;
export type TimeStamp = number;


/**
 * Domain Events
 */

export abstract class DomainEvent {
    static TypeName: string = 'DomainEvent';
    EventId: UUID;
    At: TimeStamp;

    constructor() {
        this.EventId = createUuid();
        this.At = new Date().getTime();
    }
}

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

/** 
 * Event Store
 */

export interface Meta {
    Event: DomainEvent;
    Type: string;
    StreamId: UUID
}

export class EventStore {
    private _log: Meta[];

    constructor() {
        this._log = [];
    }

    append(streamId: UUID, event: DomainEvent, type: string): void {
        const meta: Meta = {StreamId: streamId, Event: event, Type: type}
        this._log.push(meta);
    }

    getAll(): Meta[] {
        return this._log;
    }

    getForStream(streamId: UUID): Meta[] {
        return this.getAll()
            .filter(meta => meta.StreamId === streamId);
    }
}