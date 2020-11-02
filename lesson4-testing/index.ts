/**
 * How do we test event sourced systems?
 * 
 * It's actually somewhat straightforward - and this technique exposes how focusing
 * on the domain events rather than state (as our industry is so often doing)
 * makes our software easier to read, work with from a domain semantics POV, to test, etc.
 * 
 * We'll use the projection we created in the previous lesson for testing ;)
 *
 */

import {v4 as uuid} from "uuid";
import {EventStoreWithStreams, PurchaseOverviewProjection} from "../lesson3-projections-per-stream";
import {PurchaseRefunded, PurchaseRequested, PurchaseSuccessful, UUID} from "../lesson2-oop";

// Helpers
const fillProjection = (streamId: UUID, store: EventStoreWithStreams) => {
    const projection = new PurchaseOverviewProjection();
    projection.apply(store.getForStream(streamId));
    return projection;
}

// Tests

const Successful_purchase_should_project_correct_purchase_amount = () => {
    let store = new EventStoreWithStreams();
    const purchaseId = uuid();
    store.append(purchaseId, new PurchaseRequested(purchaseId, 199.00), nameof<PurchaseRequested>());
    store.append(purchaseId, new PurchaseSuccessful(purchaseId), nameof<PurchaseSuccessful>());

    const projection = fillProjection(purchaseId, store);
    console.log(`Successful purchase should project correct purchase amount: ${projection.PurchaseAmount === 199.00}`);
}

const Refunded_purchase_should_project_not_in_flight = () => {
    let store = new EventStoreWithStreams();
    const purchaseId = uuid();
    store.append(purchaseId, new PurchaseRequested(purchaseId, 199.00), nameof<PurchaseRequested>());
    store.append(purchaseId, new PurchaseSuccessful(purchaseId), nameof<PurchaseSuccessful>());
    store.append(purchaseId, new PurchaseRefunded(purchaseId), nameof<PurchaseRefunded>());

    const projection = fillProjection(purchaseId, store);
    console.log(`Refunded purchase should project not in-flight: ${(!projection.IsRequestInFlight)}`);
}

// #### Action ####
// Uncomment to run and see the test results
// ################
// Successful_purchase_should_project_correct_purchase_amount();
// Refunded_purchase_should_project_not_in_flight();
