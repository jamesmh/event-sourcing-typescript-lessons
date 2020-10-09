/**
 * Let's try to build something like what we had for the "functional.ts" examples,
 * but now using an OOP approach.
 *
 * We won't cover concepts introduced in the "functional.ts" examples, but will build upon them.
 */

// Utils
import {v4 as uuid} from 'uuid'

function now(): TimeStamp {
    return new Date().getTime();
}

// Some extra types for better readability
export type TimeStamp = number;
export type UUID = string;

// Some base classes, types
export abstract class DomainEvent {
    EventId: UUID;
    At: TimeStamp;

    constructor() {
        this.EventId = uuid();
        this.At = new Date().getTime();
    }
}

export interface Meta {
    Event: DomainEvent;
    Type: string;
}

export class EventStore {
    private _log: string[];

    constructor() {
        this._log = [];
    }

    append(event: DomainEvent, type: string) {
        this._log.push(JSON.stringify({Event: event, Type: type}));
    }

    getAll() {
        return this._log
            .map(e => JSON.parse(e) as Meta);
    }
}

// Let's build some domain events!
export class PurchaseRequested extends DomainEvent {
    PurchaseId: UUID;
    Amount: number;

    constructor(id: UUID, amount: number) {
        super();
        this.PurchaseId = id;
        this.Amount = amount;
    }
}

export class PurchaseSuccessful extends DomainEvent {
    PurchaseId: UUID;

    constructor(id: UUID) {
        super();
        this.PurchaseId = id;
    }
}

export class PurchaseRefunded extends DomainEvent {
    PurchaseId: UUID;

    constructor(id: UUID) {
        super();
        this.PurchaseId = id;
    }
}

// *************
// Let's try use-case to demonstrate how this works.
// *************

let store = new EventStore();

// Let's try to make a purchase that's successful.
const id = uuid();

store.append(new PurchaseRequested(id, 199.00), nameof<PurchaseRequested>());
store.append(new PurchaseSuccessful(id), nameof<PurchaseSuccessful>());


// #### Action ####
// Uncomment to see results 👇
// ################

//console.log(store);






