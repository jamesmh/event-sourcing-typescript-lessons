/**
 * In event sourcing, an event store (the log) isn't just one massive log (logically). 
 * Often, we want to group certain sets of events together. 
 * 
 * For example, all events associated with the same purchase (PurchaseRequested, PurchaseSuccessful, etc.)
 * are all "about" the same thing -> the same purchase.
 * 
 * We would store all events that are "about" the same domain entity or process _a stream_.
 * In DDD terms, an aggregate is associated to one stream.
 * The stream is identified by some unique Id that is common across all events for that stream.
 * Ex. a purchase Id.
 * 
 * Let's look at processing some events and creating a projection per stream!
 */

import { v4 as uuid } from 'uuid';
import {DomainEvent, Meta, PurchaseRefunded, PurchaseRequested, PurchaseSuccessful, UUID} from "../lesson2-oop";

// Event store with stream support
export interface MetaWithStream extends Meta {
    StreamId: UUID;
}

export class EventStoreWithStreams {
    private _log: string[];

    constructor() {
        this._log = [];
    }

    append(streamId: UUID, event: DomainEvent, type: string): void {
        const meta: MetaWithStream = {StreamId: streamId, Event: event, Type: type}
        this._log.push(JSON.stringify(meta));
    }

    getAll(): MetaWithStream[] {
        return this._log
            .map(e => JSON.parse(e) as MetaWithStream);
    }

    getForStream(streamId: UUID): MetaWithStream[] {
        return this.getAll()
            .filter(meta => meta.StreamId === streamId);
    }
}

// Let's begin!!
const store = new EventStoreWithStreams();

// 1. Successful purchase
const purchaseId = uuid();
store.append(purchaseId, new PurchaseRequested(purchaseId, 199.00), nameof<PurchaseRequested>());
store.append(purchaseId, new PurchaseSuccessful(purchaseId), nameof<PurchaseSuccessful>());

// 2. Refunded purchase
const purchaseId2 = uuid();
store.append(purchaseId2, new PurchaseRequested(purchaseId2, 50.00), nameof<PurchaseRequested>());
store.append(purchaseId2, new PurchaseSuccessful(purchaseId2), nameof<PurchaseSuccessful>());
store.append(purchaseId2, new PurchaseRefunded(purchaseId2), nameof<PurchaseRefunded>());

// 3. Purchase currently "in-flight" (being requested)
const purchaseId3 = uuid();
store.append(purchaseId3, new PurchaseRequested(purchaseId3, 500.99), nameof<PurchaseRequested>());


// Here's a projection to show us a general view of a purchase.
export class PurchaseOverviewProjection {
    Id: UUID = "";
    PurchaseAmount: number = 0;
    PurchasedAt: Date = new Date();
    WasRefunded: boolean = false;
    IsRequestInFlight: boolean = false;
    
    apply(events: Meta[]){
        for(const meta of events) {
            switch(meta.Type) {
                case nameof<PurchaseRequested>():
                    this.applyPurchaseRequested(meta.Event as PurchaseRequested);
                    break;
                case nameof<PurchaseSuccessful>():
                    this.applyPurchaseSuccessful(meta.Event as PurchaseSuccessful);
                    break;
                case nameof<PurchaseRefunded>():
                    this.applyPurchaseRefunded(meta.Event as PurchaseRefunded);
                    break;
            }
        }
    }

    private applyPurchaseRequested(event: PurchaseRequested) {
        this.Id = event.PurchaseId;
        this.PurchaseAmount = event.Amount;
        this.PurchasedAt = new Date(event.At);
        this.IsRequestInFlight = true;
    }

    private applyPurchaseSuccessful(event: PurchaseSuccessful) {
        this.IsRequestInFlight = false;
    }

    private applyPurchaseRefunded(event: PurchaseRefunded) {
        this.WasRefunded = true;
    }
}

// Let's run the projection for each of our purchase "streams"
const projection1 = new PurchaseOverviewProjection();
const projection2 = new PurchaseOverviewProjection();
const projection3 = new PurchaseOverviewProjection();

projection1.apply(store.getForStream(purchaseId));
projection2.apply(store.getForStream(purchaseId2));
projection3.apply(store.getForStream(purchaseId3));

// #### Action ####
// See the results here
// ################

// console.log(`Purchase 1:`)
// console.log(projection1)
// console.log("------------------------")
// console.log(`Purchase 2:`)
// console.log(projection2)
// console.log("------------------------")
// console.log(`Purchase 3:`)
// console.log(projection3)
// console.log("------------------------")
