import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PurchaseMade } from "../domain-events";

class AvgCostProjection {
    private _sum: number = 0;
    private _numOfPurchases: number = 0;
    private _avg: number = 0;

    public get Avg() {
        return this._avg;
    }

    applyPurchaseMade(event: PurchaseMade) {
        this._sum += event.Amount;
        this._numOfPurchases++;

        // Compared to the simpler nestjs sample lesson, we compute the results immediately
        // when a new event is applied. "Fetching" the projection will not perform any
        // computation.
        this._avg = this._sum / this._numOfPurchases;
        console.log(`sum: ${this._sum} | num: ${this._numOfPurchases} | avg: ${this._avg}`)
    }
}

// As sample app, we create a singleton instance of the projection for the entire app to use.
// In a prod setting this would be stored to a database/store. So instead
// of modifying in-memory objects, we'd be issuing SQL statements (etc.) to update the projection.
export const avgCostProjection: AvgCostProjection = new AvgCostProjection();

@EventsHandler(PurchaseMade)
export class AvgCostProjection_HandlePurchaseMade implements IEventHandler<PurchaseMade> {
    handle(event: PurchaseMade) {
        avgCostProjection.applyPurchaseMade(event);
    }
}
