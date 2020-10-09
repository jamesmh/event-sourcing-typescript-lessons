/**
 * Imagine we were building some logic for an POS system payment device.
 * We can use TypeScript's type aliasing to make many domain specific types explicit.
 * Note, for example, how some of the Domain Events contain the same data (or none at all other than ids),
 * yet the named type itself represents some domain concept that is not the same as the others that have the same "shape". 
 * 
 * This highlights how domain events are themselves not just data, but represent actual real-world "things".
 * By using a robust type system, they can be made explicit.
 *
 * Implications of this include code that reads much clearer, focusing on domain semantics vs. technical jargon.
 * 
 * Note: Any code comments begining with "#### Action ####" means it's code that you can uncomment to interact with 😊.
 */

 // Utils
import { v4 as uuid } from 'uuid'
function now(): TimeStamp {
    return new Date().getTime();
}

// Base types
type UUID = string;
type TimeStamp = number;
type JSONString = string;
type DomainEvent = { eventId: UUID, at: TimeStamp };

// Purchase
type PurchaseItem = { itemId: UUID, name: string, amount: number };
type PurchaseItemCollection = PurchaseItem[];
type PurchaseId = UUID;

// Domain Events
type PurchaseRequested = DomainEvent & { purchaseId: PurchaseId, items: PurchaseItemCollection}
type PurchaseSuccessful = DomainEvent & { purchaseId: PurchaseId};
type PurchaseRefunded = DomainEvent & { purchaseId: PurchaseId, amount: number }

// Primitive event store: By storing each event as a serialized JSON string we will
// simulate having to serilaize our events and send it to an event store over the network.
let eventStore: JSONString[] = [];

// *************
// Let's begin!!
// *************

// Let's try to "make a purchase" and put it into our event store.
const itemsPurchased: PurchaseItemCollection = [
    { itemId: uuid(), amount: 50.55, name: "Work Desk" },
    { itemId: uuid(), amount: 2.44, name: "Pencils" }
];

const purchaseId = uuid();
const requested: PurchaseRequested = { eventId: uuid(), at: now(), purchaseId, items: itemsPurchased };
const success: PurchaseSuccessful = { eventId: uuid(), at: now(), purchaseId };

eventStore.push(JSON.stringify(requested), JSON.stringify(success));

// #### Action ####
// Cool! Uncomment the `console.log` below to see what it looks like!
// 👇
// ################

//console.log(eventStore);


// But, there's a problem...
// No information about the _type_ being serialized is stored! 
// How do we know what kind of event it is when deserializing?
//
// We CAN deserialize the first event (PurchaseRequested) as a totally different event!

const notCorrect: PurchaseRefunded = JSON.parse(eventStore[0]);

// #### Action ####
// The output here WON'T have the shape of the PurchaseRefunded!
// (We never even created an event of that type!)
// 👇
// ################

// console.log(notCorrect);


// What can we do to make this work!?...
// We need to store the type along with the event itself... let's try again!
// npm package `ts-nameof` gives us a way to "get" the type (this is one of a few ways). 
// (It enables a new global function "nameof()")

// Let's define a "Meta" type that will store both the event AND the type 😅
type Meta = { event: DomainEvent, type: string }
eventStore = [];

// Some helpers!
function append(event: DomainEvent, type: string) {
    eventStore.push(JSON.stringify({ event, type }));
}
function getAllEvents() {
    return eventStore
        .map(e => JSON.parse(e) as Meta);
}
function getEvents(type: string) {
    getAllEvents()
        .filter(e => e.type == type);
}

// Let's append the original 2 events that we were working with:
append(requested, nameof<PurchaseRequested>());
append(success, nameof<PurchaseSuccessful>());

// #### Action ####
// Let's see if we can deserialize and get the correctly typed events!
// You should see one of each kind of event accounted for.
// 👇
// ################

// console.log(nameof<PurchaseRequested>() + ": " + getEvents(nameof<PurchaseSuccessful>()).length);
// console.log(nameof<PurchaseSuccessful>() + ": " + getEvents(nameof<PurchaseRequested>()).length);


// Now, let's build a basic projection to show us the counts of certain events.
class PurchaseCountsProjection {
    Requests: number = 0;
    Purchases: number = 0;

    // We'll pass in the `Meta` type so we can test against
    // the type in order to decide what effect that event
    // has against our projection.
    apply(events: Meta[]): void {
        for(const event of events) {
            switch(event.type) {
                case nameof<PurchaseRequested>():
                    this.Requests++;
                    break;
                case nameof<PurchaseSuccessful>():
                    this.Purchases++;
                    break;
            }
        }
    }
}

// Let's try it by making 2 more purchase requests:
const requested2: PurchaseRequested = { eventId: uuid(), at: now(), purchaseId: uuid(), items: [ { itemId: uuid(), name: 'Monitor', amount: 200.00  } ] };
const requested3: PurchaseRequested = { eventId: uuid(), at: now(), purchaseId: uuid(), items: [ { itemId: uuid(), name: 'Monitor', amount: 199.00  } ] };
append(requested2, nameof<PurchaseRequested>());
append(requested3, nameof<PurchaseRequested>());

const projection = new PurchaseCountsProjection();
projection.apply(getAllEvents());

// #### Action ####
// We should now have 3 requested purchases and 1 sucessful! 
// 👇
// ################

//console.log(projection);